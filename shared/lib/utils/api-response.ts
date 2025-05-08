import { ApiMeta, ApiResponse } from 'shared/interfaces/api-response.interface';

export abstract class ApiResponseUtil {
  static success<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
    return {
      success: true,
      data,
      error: null,
      meta: meta ? { ...meta } : null,
    };
  }

  static withMeta<T>(data: T, meta: ApiMeta): ApiResponse<T> {
    return this.success(data, meta);
  }

  static empty(): ApiResponse<null> {
    return {
      success: true,
      data: null,
      error: null,
    };
  }

  static message(message: string): ApiResponse<{ message: string }> {
    return this.success({ message });
  }

  static error(
    message: string,
    code: string | number | null = null,
    details: Record<string, any> | string | number | null = null,
  ): ApiResponse<null> {
    return {
      success: false,
      data: null,
      error: { message, code, details },
    };
  }

  static fromException(
    e: unknown,
    fallbackMessage: string = 'Internal server error',
  ): ApiResponse<null> {
    if (e instanceof Error) {
      return this.error(e.message, null, null);
    }

    return this.error(fallbackMessage, undefined, e);
  }
}
