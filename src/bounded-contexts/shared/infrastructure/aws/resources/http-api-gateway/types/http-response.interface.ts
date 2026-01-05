import type { StatusCodes } from 'http-status-codes';

export interface Pagination {
  page: number;
  perPage: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

interface Metadata {
  timestamp: string;
  requestId: string;
  pagination?: Pagination;
}

export interface HttpSuccessResponse<TData> {
  data: TData;
  statusCode: StatusCodes;
  metaData: Metadata;
}

export interface HttpErrorResponse {
  error: {
    message: string;
    cause: string;
  };
  statusCode: StatusCodes;
  metaData: Metadata;
}
