import { ApiError, ApiMeta } from 'shared/interfaces/api-response.interface';
import { isApiErrorResponse } from './is-api-error-response';
import { ApiResponseUtil } from './api-response';

export function wrapApiResponse<T extends object>(
  result: T | ApiError,
  withMeta: boolean = false,
) {
  if (isApiErrorResponse(result)) return result;
  if (result && withMeta && 'meta' in result && 'data' in result) {
    return ApiResponseUtil.withMeta(result.data, result.meta as ApiMeta);
  }
  return ApiResponseUtil.success(result);
}
