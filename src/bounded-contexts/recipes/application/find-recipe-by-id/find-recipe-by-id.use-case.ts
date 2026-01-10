import { RecipeMapper } from "@src/bounded-contexts/recipes/application/recipe.mapper";
import { IdValueObject } from "@src/bounded-contexts/shared/domain/value-objects/id.value-object";

import type { FindRecipeByIdDto } from "./find-recipe-by-id.dto";
import type { FindRecipeByIdResultDto } from "./find-recipe-by-id-result.dto";
import type { RecipeValidatorDomainService } from "../../domain/recipe-validator.domain-service";

export class FindRecipeById {
  constructor(
    private readonly recipeValidatorDomainService: RecipeValidatorDomainService
  ) {}

  async execute(dto: FindRecipeByIdDto): Promise<FindRecipeByIdResultDto> {
    const { id } = dto;

    const recipe = await this.recipeValidatorDomainService.ensureRecipeExists(
      IdValueObject.fromPrimitives(id)
    );

    return RecipeMapper.toDto(recipe);
  }
}
