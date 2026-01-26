import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import type { UpdateOrderStatusByIdDto } from '@src/bounded-contexts/orders/application/update-order-status-by-id/update-order-by-id.dto';
import {
  type ApiGatewayProxyLambdaHandler,
  type ApiGatwayProxyLambdaHandlerResponse,
  createApiGatewayLambdaProxyHandler,
} from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';

import { updateOrderStatusByIdUseCase } from '../../dependencies';

const handler: ApiGatewayProxyLambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<ApiGatwayProxyLambdaHandlerResponse> => {
  const { pathParameters, body } = event;

  // TODO: validate path parameters
  if (!pathParameters) throw new Error('Path parameters id are required');

  const { id } = pathParameters;

  // TODO: validate path parameters
  if (!id) throw new Error('Order id is required');

  // TODO: validate body
  if (!body) throw new Error('Body is required');

  const { status } = JSON.parse(body);

  // TODO: validate status
  if (!status) throw new Error('Status is required');

  const updateOrderDto: UpdateOrderStatusByIdDto = { id, status };

  const order = await updateOrderStatusByIdUseCase.execute(updateOrderDto);

  return {
    data: order,
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
