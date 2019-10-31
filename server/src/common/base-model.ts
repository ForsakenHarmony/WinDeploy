import {ID, InterfaceType, Field, ObjectType} from "type-graphql";
import {PrimaryGeneratedColumn} from "typeorm";

export type IDType = string;

@InterfaceType()
export abstract class BaseGraphQLObject {
  @Field(() => ID)
  id!: IDType;
}

@ObjectType({ implements: BaseGraphQLObject })
export abstract class BaseModel implements BaseGraphQLObject {
  @PrimaryGeneratedColumn('uuid')
  id!: IDType;
}
