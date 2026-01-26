import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import {
  type ApiGatewayProxyLambdaHandler,
  type ApiGatwayProxyLambdaHandlerResponse,
  createApiGatewayLambdaProxyHandler,
} from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';

import { findRecipeByIdUseCase } from '../../dependencies';

const handler: ApiGatewayProxyLambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<ApiGatwayProxyLambdaHandlerResponse> => {
  const { pathParameters } = event;

  // TODO: validate path parameters
  if (!pathParameters) throw new Error('Path parameters id are required');

  const { id } = pathParameters;

  // TODO: validate path parameters
  if (!id) throw new Error('Recipe id is required');

  const recipe = await findRecipeByIdUseCase.execute({ id });

  return {
    data: recipe,
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
