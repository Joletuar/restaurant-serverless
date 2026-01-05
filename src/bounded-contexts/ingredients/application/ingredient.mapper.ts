import type { Ingredient } from "../domain/ingredient.entity";
import type { IngredientDto } from "./ingredient.dto";

export class IngredientMapper {
  static toDto(ingredient: Ingredient): IngredientDto {
    const primitives = ingredient.toPrimitives();

    return primitives;
  }

  static toDtos(ingredients: Ingredient[]): IngredientDto[] {
    return ingredients.map((ingredient) => this.toDto(ingredient));
  }
}
