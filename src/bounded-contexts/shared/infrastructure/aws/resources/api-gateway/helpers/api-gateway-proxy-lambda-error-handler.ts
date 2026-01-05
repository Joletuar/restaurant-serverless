import type { Context } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { ErrorCode } from '@src/bounded-contexts/shared/domain/error-code.enum';
import { ErrorMessages } from '@src/bounded-contexts/shared/domain/error-messages';
import { ApplicationException } from '@src/bounded-contexts/shared/domain/exceptions/application.exception';
import { DomainValidationException } from '@src/bounded-contexts/shared/domain/exceptions/domain-validation.exception';
import { DomainException } from '@src/bounded-contexts/shared/domain/exceptions/domain.exception';
import { NotFoundException } from '@src/bounded-contexts/shared/domain/exceptions/not-found.exception';
import { RootException } from '@src/bounded-contexts/shared/domain/exceptions/root.exception';

import type { HttpErrorResponse } from '../types/http-response.interface';
import { createLambdaLogger } from './lambda-logguer';

export const apiGatewayProxyLambdaErrorHandler = (
  error: unknown,
  ctx: Context
): HttpErrorResponse => {
  const logger = createLambdaLogger(ctx);

  logger.error(error as any);

  const res: HttpErrorResponse = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    error: {
      message: ErrorMessages[ErrorCode.DEFAULT_ERROR_CODE],
      cause: 'Ha ocurrido un error inesperado, intenta más tarde.',
    },
    metaData: {
      requestId: ctx.awsRequestId,
      timestamp: new Date().toISOString(),
    },
  };

  if (error instanceof RootException) {
    res.error = {
      message: ErrorMessages[error.errorCode],
      cause: error.message,
    };

    if (error instanceof DomainValidationException) {
      res.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    }

    if (error instanceof NotFoundException) {
      res.statusCode = StatusCodes.NOT_FOUND;
    }

    if (error instanceof DomainException) {
      res.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (error instanceof ApplicationException) {
      res.statusCode = StatusCodes.BAD_REQUEST;
    }

    return res;
  }

  return res;
};
