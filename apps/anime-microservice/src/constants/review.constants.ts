import { Prisma } from '@prisma/__generated__';

export const COMMON_USER_INCLUDE = {
  id: true,
  username: true,
  picture: true,
} satisfies Prisma.UserSelect;

export const COMMON_ANIME_INCLUDE = {
  id: true,
  russian: true,
  name: true,
  poster: {
    select: {
      originalUrl: true,
      mainUrl: true,
    },
  },
} satisfies Prisma.AnimeSelect;

export const COMMON_REVIEW_INCLUDE = {
  _count: { select: { reviewLikes: true } },
  user: { select: COMMON_USER_INCLUDE },
  anime: { select: COMMON_ANIME_INCLUDE },
} satisfies Prisma.ReviewInclude;

export const WHERE_TEXT_NOT_NULL = {
  AND: [{ content: { not: null } }, { title: { not: null } }],
} satisfies Prisma.ReviewWhereInput;
