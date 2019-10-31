import { Container } from "typedi";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import {createConnection, EntitySchema, useContainer as ormUseContainer} from "typeorm";
import { PubSub } from "graphql-subscriptions";
import { buildSchema } from "type-graphql";
import { ErrorLoggerMiddleware } from "../middlewares/error-logger";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import net from "net";
import opn from "open";

interface CreateServerArgs {
  entities: ((Function | string | EntitySchema<any>))[];
  migrations: (Function | string)[];
  resolvers: Array<Function | string>;
}

export async function bootstrap({
  migrations,
  entities,
  resolvers
}: CreateServerArgs) {
  const isProd = process.env.NODE_ENV === "production";

  // register 3rd party IOC container
  ormUseContainer(Container);

  const ormConfig: SqliteConnectionOptions = {
    type: "sqlite",
    database: "database.sqlite",
    logger: "advanced-console",
    logging: ["error", "warn", "info", "schema", "migration", "log"],
    synchronize: !isProd,
    entities,
    migrations,
    migrationsRun: true // isProd
    // dropSchema: true,
  };

  await createConnection(ormConfig);

  const pubSub = new PubSub();
  Container.set({ id: "PB", value: pubSub });

  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: !isProd && "../schema.graphql",
    container: Container,
    pubSub,
    globalMiddlewares: [ErrorLoggerMiddleware /*, ResolveTimeMiddleware*/]
  });

  const app = express();

  const path = require("path");
  app.use("/", express.static(path.join(__dirname, "./public")));

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: !isProd,
    uploads: false,
    debug: true,
    tracing: true,
    subscriptions: "/api/graphql",
    formatError: error => {
      console.warn(error);
      return error;
    }
  });

  server.applyMiddleware({ app, path: "/api/graphql" });

  const http = app.listen(4000, () => {
    server.installSubscriptionHandlers(http);

    const serverInfo: any = {
      ...(http.address() as net.AddressInfo),
      server: http,
      subscriptionsPath: server.subscriptionsPath
    };

    // Convert IPs which mean "any address" (IPv4 or IPv6) into localhost
    // corresponding loopback ip. Note that the url field we're setting is
    // primarily for consumption by our test suite. If this heuristic is
    // wrong for your use case, explicitly specify a frontend host (in the
    // `frontends.host` field in your engine config, or in the `host`
    // option to ApolloServer.listen).
    let hostForUrl = serverInfo.address;
    if (serverInfo.address === "" || serverInfo.address === "::")
      hostForUrl = "localhost";

    serverInfo.url = require("url").format({
      protocol: "http",
      hostname: hostForUrl,
      port: serverInfo.port,
      pathname: server.graphqlPath
    });

    serverInfo.subscriptionsUrl = require("url").format({
      protocol: "ws",
      hostname: hostForUrl,
      port: serverInfo.port,
      slashes: true,
      pathname: server.subscriptionsPath
    });

    console.log(
      `Server is running, GraphQL Playground available at ${serverInfo.url}, Subscriptions at ${serverInfo.subscriptionsUrl}`
    );
    isProd && opn("http://localhost:4000", { url: true });
  });
}
