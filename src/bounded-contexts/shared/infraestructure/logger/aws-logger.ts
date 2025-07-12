import { Logger } from '@aws-lambda-powertools/logger';

import type { Context } from 'aws-lambda';

import type { Logger as ILogger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class AwsLogger implements ILogger {
  private logger: Logger;

  constructor() {
    this.logger = new Logger({ serviceName: 'RestaurantApp' });
  }

  info(data: Context, msg: string, ...args: unknown[]): void {
    this.logger.addContext(data);
    this.logger.info({
      message: msg,
      extra: args,
    });
  }

  warn(data: Context, msg: string, ...args: unknown[]): void {
    this.logger.addContext(data as Context);
    this.logger.warn({
      message: msg,
      extra: args,
    });
  }

  error(data: Context, msg: string, ...args: unknown[]): void {
    this.logger.addContext(data);
    this.logger.error({
      message: msg,
      extra: args,
    });
  }

  debug(data: Context, msg: string, ...args: unknown[]): void {
    this.logger.addContext(data);
    this.logger.debug({
      message: msg,
      extra: args,
    });
  }
}
