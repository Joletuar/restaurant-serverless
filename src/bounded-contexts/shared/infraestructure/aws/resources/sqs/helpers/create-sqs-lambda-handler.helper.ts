import type {
  Context,
  SQSBatchResponse,
  SQSHandler,
  SQSRecord,
} from 'aws-lambda';

interface Props<TParsedData> {
  handler: Handler<TParsedData>;
  recordParser: RecordParser<TParsedData>;
}

type Handler<TRecord> = (record: TRecord, context?: Context) => Promise<void>;
type RecordParser<TOutput> = (event: SQSRecord) => TOutput;

export const createFifoSqsLambdaHandler = async <TParsedData>(
  props: Props<TParsedData>
): Promise<SQSHandler> => {
  const { handler, recordParser } = props;

  return async (event, context) => {
    const sqsBatchResponse: SQSBatchResponse = {
      batchItemFailures: [],
    };

    for (const record of event.Records) {
      try {
        await handler(recordParser(record), context);
      } catch (error) {
        errorHandler(error);

        sqsBatchResponse.batchItemFailures.push({
          itemIdentifier: record.messageId,
        });
      }
    }
  };
};
