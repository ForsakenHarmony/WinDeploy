import { Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Software } from "../entities/software";

@Resolver(Software)
export class SoftwareResolver {
  constructor(
    @InjectRepository(Software)
    private readonly softwareRepo: Repository<Software>
  ) {}
}
