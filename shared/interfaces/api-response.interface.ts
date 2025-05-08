export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string | number | null;
  details: Record<string, any> | string | number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta?: (ApiMeta & Record<string, any>) | null;
}
