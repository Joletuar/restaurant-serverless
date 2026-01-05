import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import type { GetAllIngredientsResultDto } from '@src/bounded-contexts/ingredients/application/get-all-ingredients/get-all-ingredient-result.dto';
import { GetAllIngredients } from '@src/bounded-contexts/ingredients/application/get-all-ingredients/get-all-ingredients.use-case';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import { createApiGatewayLambdaProxyHandler } from '@src/bounded-contexts/shared/infrastructure/aws/resources/api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';
import type { HttpSuccessResponse } from '@src/bounded-contexts/shared/infrastructure/aws/resources/api-gateway/types/http-response.interface';

const handler = async (
  _event: APIGatewayProxyEventV2,
  ctx: Context
): Promise<HttpSuccessResponse<GetAllIngredientsResultDto>> => {
  const repo = {} as IngredientRepository;
  const getAllIngredientsUseCase = new GetAllIngredients(repo);

  const ingredients = await getAllIngredientsUseCase.execute();

  return {
    data: ingredients,
    statusCode: StatusCodes.OK,
    metaData: {
      requestId: ctx.awsRequestId,
      timestamp: new Date().toISOString(),
    },
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
