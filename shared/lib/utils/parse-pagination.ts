export function parsePagination(page?: number, limit?: number) {
  return {
    pageNumber: Number(page) || 1,
    limitNumber: Math.min(Number(limit) || 10, 50),
  };
}
