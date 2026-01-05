import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import {
  type ApiGatwayProxyLambdaHandler,
  type ApiGatwayProxyLambdaHandlerResponse,
  createApiGatewayLambdaProxyHandler,
} from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';

import { findIngredientByIdUseCase } from '../../dependencies';

const handler: ApiGatwayProxyLambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<ApiGatwayProxyLambdaHandlerResponse> => {
  const { pathParameters } = event;

  // TODO: valdiate path parameters
  if (!pathParameters) throw new Error('Path parameters id are requiered');

  const { id } = pathParameters;

  // TODO: valdiate path parameters
  if (!id) throw new Error('Ingredient id is requiered');

  const ingredients = await findIngredientByIdUseCase.execute({ id });

  return {
    data: ingredients,
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
