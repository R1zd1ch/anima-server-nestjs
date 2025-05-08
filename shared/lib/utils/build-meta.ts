import { ApiMeta } from 'shared/interfaces/api-response.interface';

export function buildMeta(total: number, page: number, limit: number): ApiMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
