import { Prisma } from '@prisma/__generated__';

export const WHERE_TEXT_NOT_NULL = {
  AND: [{ content: { not: null } }, { title: { not: null } }],
} satisfies Prisma.ReviewWhereInput;
