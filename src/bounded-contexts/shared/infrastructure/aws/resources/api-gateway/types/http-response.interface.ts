interface Pagination {
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
  statusCode: HttpStatusCode;
  metaData: Metadata;
}

export interface HttpErrorResponse {
  error: {
    message: string;
    errorCode: string;
  };
  statusCode: HttpStatusCode;
  metaData: Metadata;
}

export type HttpResponse = HttpSuccessResponse<any> | HttpErrorResponse;
