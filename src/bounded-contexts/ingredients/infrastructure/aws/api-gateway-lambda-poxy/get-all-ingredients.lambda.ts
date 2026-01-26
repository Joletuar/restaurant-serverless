import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import type {
  ApiGatewayProxyLambdaHandler,
  ApiGatwayProxyLambdaHandlerResponse,
} from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';
import { createApiGatewayLambdaProxyHandler } from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';

import { getAllIngredientsUseCase } from '../../dependencies';

const handler: ApiGatewayProxyLambdaHandler = async (
  _event: APIGatewayProxyEventV2
): Promise<ApiGatwayProxyLambdaHandlerResponse> => {
  const ingredients = await getAllIngredientsUseCase.execute();

  return {
    data: ingredients,
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
