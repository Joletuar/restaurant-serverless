import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import {
  type ApiGatwayProxyLambdaHandler,
  type ApiGatwayProxyLambdaHandlerResponse,
  createApiGatewayLambdaProxyHandler,
} from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';

import { findOrderByIdUseCase } from '../../dependencies';

const handler: ApiGatwayProxyLambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<ApiGatwayProxyLambdaHandlerResponse> => {
  const { pathParameters } = event;

  // TODO: validate path parameters
  if (!pathParameters) throw new Error('Path parameters id are required');

  const { id } = pathParameters;

  // TODO: validate path parameters
  if (!id) throw new Error('Order id is required');

  const order = await findOrderByIdUseCase.execute({ id });

  return {
    data: order,
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
