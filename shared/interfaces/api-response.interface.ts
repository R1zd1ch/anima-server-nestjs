export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code?: string;
    message?: string;
    [key: string]: any;
  } | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}
