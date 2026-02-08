import { resolve } from 'node:path';

/**
 * Base path for all bounded contexts
 */
const BOUNDED_CONTEXTS_BASE = resolve(__dirname, '../../src/bounded-contexts');

/**
 * Helper to build lambda path
 */
const buildLambdaPath = (context: string, lambdaFileName: string): string => {
  return resolve(
    BOUNDED_CONTEXTS_BASE,
    context,
    'infrastructure/aws/api-gateway-lambda-poxy',
    lambdaFileName
  );
};

/**
 * Lambda paths configuration
 */
export const LAMBDA_PATHS = {
  // Orders
  orders: {
    createOrder: buildLambdaPath('orders', 'create-order.lambda.ts'),
    updateOrderStatusById: buildLambdaPath(
      'orders',
      'update-order-status-by-id.lambda.ts'
    ),
    getAllOrders: buildLambdaPath('orders', 'get-all-orders.lambda.ts'),
    findOrderById: buildLambdaPath('orders', 'find-order-by-id.lambda.ts'),
  },

  // Recipes
  recipes: {
    getAllRecipes: buildLambdaPath('recipes', 'get-all-recipes.lambda.ts'),
    findRecipeById: buildLambdaPath('recipes', 'find-recipe-by-id.lambda.ts'),
  },

  // Ingredients
  ingredients: {
    getAllIngredients: buildLambdaPath(
      'ingredients',
      'get-all-ingredients.lambda.ts'
    ),
    findIngredientById: buildLambdaPath(
      'ingredients',
      'find-ingredient-by-id.lambda.ts'
    ),
  },
} as const;

/**
 * Type-safe lambda path keys
 */
export type LambdaPathKey = keyof typeof LAMBDA_PATHS;
