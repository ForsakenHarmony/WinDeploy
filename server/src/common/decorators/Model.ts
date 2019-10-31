import {ObjectType} from 'type-graphql';
import {Entity } from 'typeorm';

import {
  ClassDecoratorFactory, composeClassDecorators
} from '../utils';

export function Model() {
  const factories = [
    Entity() as ClassDecoratorFactory,
    ObjectType() as ClassDecoratorFactory
  ];

  return composeClassDecorators(...factories);
}
