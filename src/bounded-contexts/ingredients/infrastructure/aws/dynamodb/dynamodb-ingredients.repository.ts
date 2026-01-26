import { GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import type { Ingredient } from '@src/bounded-contexts/ingredients/domain/ingredient.entity';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import ingredientsEnvirontment from '@src/bounded-contexts/ingredients/infrastructure/config/environment';
import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import type { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { DynamoDbRespository } from '@src/bounded-contexts/shared/infrastructure/aws/resources/dynamodb/types/dynamodb.respository';

import { DynamoDbIngredientsMapper } from './helpers/dynamodb-ingredients.mapper';

export class DynamoDbIngredientsRepository
  extends DynamoDbRespository
  implements IngredientRepository
{
  constructor() {
    super(ingredientsEnvirontment.INGREDIENTS_TABLE_NAME);
  }

  async findById(id: IdValueObject): Promise<Nullable<Ingredient>> {
    try {
      const cmd = new GetItemCommand({
        TableName: this.TABLE_NAME,
        Key: marshall(id),
      });

      const result = await this.client.send(cmd);
      const ingredient = result.Item;

      if (!ingredient) return null;

      return DynamoDbIngredientsMapper.toEntity(ingredient);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async getAll(): Promise<Ingredient[]> {
    try {
      const cmd = new ScanCommand({
        TableName: this.TABLE_NAME,
      });

      const result = await this.client.send(cmd);
      const ingredients = result.Items;

      if (!ingredients || ingredients.length === 0) return [];

      return DynamoDbIngredientsMapper.toEntityList(ingredients);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  errorHandler(_error: unknown): never {
    throw new Error('Method not implemented.');
  }
}
