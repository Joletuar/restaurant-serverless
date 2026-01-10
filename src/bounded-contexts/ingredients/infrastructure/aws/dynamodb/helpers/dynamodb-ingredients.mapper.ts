import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { Ingredient } from '@src/bounded-contexts/ingredients/domain/ingredient.entity';

export const DynamoDbIngredientsMapper = {
  toEntity(item: Record<string, AttributeValue>): Ingredient {
    const { name } = unmarshall(item);

    return Ingredient.fromPrimitives({
      name,
    });
  },

  toEntityList(items: Record<string, AttributeValue>[]): Ingredient[] {
    return items.map((i) => DynamoDbIngredientsMapper.toEntity(i));
  },
};
