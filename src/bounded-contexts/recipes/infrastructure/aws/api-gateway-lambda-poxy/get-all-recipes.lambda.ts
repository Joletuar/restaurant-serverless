import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import type {
  ApiGatwayProxyLambdaHandler,
  ApiGatwayProxyLambdaHandlerResponse,
} from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';
import { createApiGatewayLambdaProxyHandler } from '@src/bounded-contexts/shared/infrastructure/aws/resources/http-api-gateway/helpers/create-api-gateway-proxy-lambda-handler.helper';

import { getAllRecipesUseCase } from '../../dependencies';

const handler: ApiGatwayProxyLambdaHandler = async (
  _event: APIGatewayProxyEventV2
): Promise<ApiGatwayProxyLambdaHandlerResponse> => {
  const recipes = await getAllRecipesUseCase.execute();

  return {
    data: recipes,
  };
};

export default createApiGatewayLambdaProxyHandler({
  handler,
});
