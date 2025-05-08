import { ApiResponse } from 'shared/interfaces/api-response.interface';

export function isApiErrorResponse(res: unknown): res is ApiResponse<null> {
  return (
    typeof res === 'object' &&
    res !== null &&
    'success' in res &&
    res['success'] === false
  );
}
