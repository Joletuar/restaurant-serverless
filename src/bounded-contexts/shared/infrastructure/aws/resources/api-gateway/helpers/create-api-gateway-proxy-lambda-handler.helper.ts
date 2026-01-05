import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';

import type { HttpSuccessResponse } from '../types/http-response.interface';
import { apiGatewayProxyLambdaErrorHandler } from './api-gateway-proxy-lambda-error-handler';

type Handler = (
  event: APIGatewayProxyEventV2,
  ctx: Context
) => Promise<HttpSuccessResponse<any>>;

interface Props {
  handler: Handler;
}

export const createApiGatewayLambdaProxyHandler = (
  props: Props
): APIGatewayProxyHandlerV2 => {
  const { handler } = props;

  return async (
    event: APIGatewayProxyEventV2,
    ctx: Context
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
      const { data, statusCode } = await handler(event, ctx);

      return {
        body: JSON.stringify(data),
        statusCode,
      };
    } catch (err) {
      const { error, metaData, statusCode } = apiGatewayProxyLambdaErrorHandler(
        err,
        ctx
      );

      return {
        body: JSON.stringify({ error, metaData }),
        statusCode,
      };
    }
  };
};
