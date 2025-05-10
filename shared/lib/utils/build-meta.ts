import { ApiMeta } from 'shared/interfaces/api-response.interface';

export function buildMeta(
  total: number,
  page: number = 1,
  limit: number = 10,
): ApiMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
