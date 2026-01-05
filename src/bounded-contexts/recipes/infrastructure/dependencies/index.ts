import { FindRecipeById } from '../../application/find-recipe-by-id/find-recipe-by-id.use-case';
import { GetAllRecipes } from '../../application/get-all-recipes/get-all-recipes.use-case';
import { RecipeValidatorDomainService } from '../../domain/recipe-validator.domain-service';
import type { RecipeRepository } from '../../domain/recipe.repository';

const repo = {} as RecipeRepository;

export const recipeValidatorDomainService = new RecipeValidatorDomainService(
  repo
);

export const findRecipeByIdUseCase = new FindRecipeById(
  recipeValidatorDomainService
);
export const getAllRecipesUseCase = new GetAllRecipes(repo);
