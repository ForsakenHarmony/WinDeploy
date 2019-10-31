import { Field as GqlField } from 'type-graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

export function Field(options: any = {}): any {
  const factories = [
    GqlField({ nullable: false, ...options }) as MethodDecoratorFactory,
    Column(options) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
