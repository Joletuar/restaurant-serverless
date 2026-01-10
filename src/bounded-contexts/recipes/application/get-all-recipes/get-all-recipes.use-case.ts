import { RecipeMapper } from "@src/bounded-contexts/recipes/application/recipe.mapper";
import type { RecipeRepository } from "@src/bounded-contexts/recipes/domain/recipe.repository";

import type { GetAllRecipesResultDto } from "./get-all-recipes-result.dto";

export class GetAllRecipes {
  constructor(private readonly repository: RecipeRepository) {}

  async execute(): Promise<GetAllRecipesResultDto> {
    const recipes = await this.repository.getAll();

    return RecipeMapper.toDtos(recipes);
  }
}
