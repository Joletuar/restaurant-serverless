import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export abstract class DynamoDbRespository {
  abstract errorHandler(error: unknown): never;

  private readonly _client = new DynamoDBClient({});

  constructor(private readonly _tableName: string) {}

  get client(): DynamoDBClient {
    return this._client;
  }

  get TABLE_NAME(): string {
    return this._tableName;
  }
}
