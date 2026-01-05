import { IngredientMapper } from '@src/bounded-contexts/ingredients/application/ingredient.mapper';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import { NotFoundIngredientException } from '../../domain/exceptions/not-found-ingredient';
import type { FindIngredientByIdResultDto } from './find-ingredient-by-id-result.dto';
import type { FindIngredientByIDto } from './find-ingredient-by-id.dto';

export class FindIngredientById {
  constructor(private readonly repository: IngredientRepository) {}

  async execute(
    dto: FindIngredientByIDto
  ): Promise<FindIngredientByIdResultDto> {
    const { id } = dto;

    const ingredient = await this.repository.findById(
      IdValueObject.fromPrimitives(id)
    );

    if (!ingredient) throw new NotFoundIngredientException(id);

    return IngredientMapper.toDto(ingredient);
  }
}
