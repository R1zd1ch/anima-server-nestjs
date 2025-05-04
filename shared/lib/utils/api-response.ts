import { ApiResponse } from 'shared/interfaces/api-response.interface';

export abstract class ApiResponseUtil {
  static success<T>(
    data: T,
    meta: ApiResponse<T>['meta'] = null,
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      error: null,
      meta,
    };
  }

  static error<T>(error: ApiResponse<T>['error']): ApiResponse<T> {
    return {
      success: false,
      data: null,
      error,
      meta: null,
    };
  }

  static withMeta<T>(
    data: T[],
    meta: ApiResponse<T[]>['meta'],
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      error: null,
      meta,
    };
  }
}
