import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';

import type { HttpSuccessResponse } from '../types/http-response.interface';

interface Props {
  handler: Handler;
}

type Handler = <TData>(
  event: APIGatewayProxyEventV2
) => Promise<HttpSuccessResponse<TData>>;

export const createApiGatewayLambdaProxyHandler = (
  props: Props
): Promise<APIGatewayProxyHandlerV2> => {
  const { handler } = props;

  return async (
    event: APIGatewayProxyEventV2
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
      const { data, statusCode } = await handler(event);
    } catch (error) {
      const {} = apiGatewayProxyLambdaErrorHandler(error);
    }
  };
};
