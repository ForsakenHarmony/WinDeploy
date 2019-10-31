process.env.NODE_ENV = process.env.NODE_ENV || "production";
import "./patch-stdout";

import "reflect-metadata";
import "sqlite3";
import opn from "open";

import { bootstrap } from "./common";
import { ComputerResolver } from "./resolvers/computerResolver";
import { SoftwareResolver } from "./resolvers/softwareResolver";

import {Computer} from "./entities/computer";
import {Software} from "./entities/software";


process.on("uncaughtException", function(err) {
  console.error(err && err.stack ? err.stack : err);
});

bootstrap({
  resolvers: [ComputerResolver, SoftwareResolver],
  entities: [Software, Computer],
  migrations: [
  ],
})
  .then(async () => {
    const isProd = process.env.NODE_ENV === "production";
    isProd && opn("http://localhost:4000", { url: true });
  })
  .catch(console.error);
