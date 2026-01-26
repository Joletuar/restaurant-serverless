import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import type {
  ApiGatewayProxyLambdaHandler,
  ApiGatwayProxyLambdaHandlerResponse,
} from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';
import { createApiGatewayLambdaProxyHandler } from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';

import { getAllOrdersUseCase } from '../../dependencies';

const handler: ApiGatewayProxyLambdaHandler = async (
  _event: APIGatewayProxyEventV2
): Promise<ApiGatwayProxyLambdaHandlerResponse> => {
  const orders = await getAllOrdersUseCase.execute();

  return {
    data: orders,
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
