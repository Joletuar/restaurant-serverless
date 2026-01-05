import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import type {
  HttpSuccessResponse,
  Pagination,
} from '../types/http-response.interface';
import { apiGatewayProxyLambdaErrorHandler } from './api-gateway-proxy-lambda-error-handler';

export type ApiGatwayProxyLambdaHandlerResponse = {
  data: any;
  statusCode?: StatusCodes;
  pagination?: Pagination;
};

export type ApiGatwayProxyLambdaHandler = (
  event: APIGatewayProxyEventV2,
  ctx?: Context
) => Promise<ApiGatwayProxyLambdaHandlerResponse>;

interface Props {
  handler: ApiGatwayProxyLambdaHandler;
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
      const { data, statusCode = StatusCodes.OK } = await handler(event, ctx);

      const res: HttpSuccessResponse<any> = {
        data,
        statusCode,
        metaData: {
          requestId: ctx.awsRequestId,
          timestamp: new Date().toISOString(),
        },
      };

      return {
        body: JSON.stringify(res),
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
