import { Logger } from '@aws-lambda-powertools/logger';

import type { Context } from 'aws-lambda';

const logger = new Logger();

export const createLambdaLogger = (ctx: Context): Logger => {
  logger.addContext(ctx);

  return logger;
};
