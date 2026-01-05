import { IdValueObject } from "@src/bounded-contexts/shared/domain/value-objects/id.value-object";

import { RecipeRepository } from "./recipe.repository";
import { NotFoundRecipeException } from "./exceptions/not-found-recipe.exception";
import { Recipe } from "./recipe.entity";

export class RecipeValidatorDomainService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async ensureRecipeExists(recipeId: IdValueObject): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(recipeId);

    if (!recipe) throw new NotFoundRecipeException(recipeId.value);

    return recipe;
  }
}
