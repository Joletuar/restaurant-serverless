import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import type { CreateOrderDto } from '@src/bounded-contexts/orders/application/create-order/create-order.dto';
import {
  type ApiGatewayProxyLambdaHandler,
  type ApiGatwayProxyLambdaHandlerResponse,
  createApiGatewayLambdaProxyHandler,
} from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';

import { createOrderUseCase } from '../../dependencies';

const handler: ApiGatewayProxyLambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<ApiGatwayProxyLambdaHandlerResponse> => {
  const { body } = event;

  // TODO: validate body
  if (!body) throw new Error('Body is required');

  const createOrderDto: CreateOrderDto = JSON.parse(body);

  const order = await createOrderUseCase.execute(createOrderDto);

  return {
    data: order,
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
