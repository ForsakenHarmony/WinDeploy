import { Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Computer } from "../entities/computer";
import { Software } from "../entities/software";

@Resolver(Computer)
export class ComputerResolver {
  constructor(
    @InjectRepository(Computer)
    private readonly computerRepo: Repository<Computer>,
    @InjectRepository(Software)
    private readonly softwareRepo: Repository<Software>
  ) {}
}
