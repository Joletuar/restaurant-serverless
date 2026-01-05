import type { Recipe } from "../domain/recipe.entity";
import type { RecipeDto } from "./recipe.dto";

export class RecipeMapper {
  static toDto(recipe: Recipe): RecipeDto {
    const primitives = recipe.toPrimitives();

    return primitives;
  }

  static toDtos(recipes: Recipe[]): RecipeDto[] {
    return recipes.map((recipe) => this.toDto(recipe));
  }
}
