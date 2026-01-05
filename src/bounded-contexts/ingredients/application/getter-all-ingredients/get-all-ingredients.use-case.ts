import { IngredientMapper } from '@src/bounded-contexts/ingredients/application/ingredient.mapper';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';

import type { GetAllIngredientsResultDto } from './get-all-ingredient-result.dto';

export class GetAllIngredients {
  constructor(private readonly repository: IngredientRepository) {}

  async execute(): Promise<GetAllIngredientsResultDto> {
    const ingredients = await this.repository.getAll();

    return IngredientMapper.toDtos(ingredients);
  }
}
