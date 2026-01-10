import type {
  Context,
  SQSBatchResponse,
  SQSHandler,
  SQSRecord,
} from 'aws-lambda';

import { createLambdaLogger } from '../../lambda/helpers/lambda-logger';

type Handler<TRecord> = (record: TRecord, context?: Context) => Promise<void>;
type RecordParser<TOutput> = (event: SQSRecord) => TOutput;

interface Props<TParsedData> {
  handler: Handler<TParsedData>;
  recordParser: RecordParser<TParsedData>;
}

export const createFifoSqsLambdaHandler = async <TParsedData>(
  props: Props<TParsedData>
): Promise<SQSHandler> => {
  const { handler, recordParser } = props;

  return async (event, ctx) => {
    const logger = createLambdaLogger(ctx);

    const sqsBatchResponse: SQSBatchResponse = {
      batchItemFailures: [],
    };

    for (const record of event.Records) {
      try {
        await handler(recordParser(record), ctx);
      } catch (error) {
        logger.error(
          {
            message: (error as any)?.message || 'Uncontrolled Error',
          },
          error as Error
        );

        sqsBatchResponse.batchItemFailures.push({
          itemIdentifier: record.messageId,
        });
      }
    }
  };
};
