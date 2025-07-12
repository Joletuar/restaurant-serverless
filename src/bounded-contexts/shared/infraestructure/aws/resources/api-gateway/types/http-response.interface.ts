import type { HttpStatusCode } from './statu-codes.enum';

export interface HttpSuccessResponse<TData> {
  data: TData;
  statusCode: HttpStatusCode;
  metaData: Metadata;
}

interface Metadata {
  timestamp: string;
  requestId: string;
  pagination?: Pagination;
}

interface Pagination {
  page: number;
  perPage: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface HttpErrorResponse {
  error: {
    statusCode: HttpStatusCode;
    code: string;
    message: string;
    details: { message: string }[];
  };

  timestamp: string;
  requestId: string;
}
