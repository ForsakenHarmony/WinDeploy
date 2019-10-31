import {Software} from "./software";
import {Lazy} from "../helpers";
import {ManyToMany, Field, Model, BaseModel} from "../common";

@Model()
export class Computer extends BaseModel {
  @Field()
  name!: string;

  @Field()
  mac!: string;

  @ManyToMany(type => Software,{
    lazy: true,
    cascade: true
  })
  software!: Lazy<Software[]>
}
