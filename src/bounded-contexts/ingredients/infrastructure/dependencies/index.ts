import { FindIngredientById } from '../../application/find-ingredient-by-id/find-ingredient-by-id.use-case';
import { GetAllIngredients } from '../../application/get-all-ingredients/get-all-ingredients.use-case';
import { DynamoDbIngredientsRepository } from '../aws/dynamodb/dynamodb-ingredients.repository';

const repo = new DynamoDbIngredientsRepository();

export const getAllIngredientsUseCase = new GetAllIngredients(repo);
export const findIngredientByIdUseCase = new FindIngredientById(repo);
