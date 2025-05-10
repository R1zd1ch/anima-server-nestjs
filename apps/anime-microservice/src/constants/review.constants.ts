import { Prisma } from '@prisma/__generated__';

export const REVIEW_COMMON_USER_INCLUDE = {
  id: true,
  username: true,
  displayName: true,
  picture: true,
} satisfies Prisma.UserSelect;

export const REVIEW_COMMON_ANIME_INCLUDE = {
  id: true,
  russian: true,
  name: true,
  poster: {
    select: { originalUrl: true, mainUrl: true },
  },
} satisfies Prisma.AnimeSelect;

export const COMMON_REVIEW_INCLUDE = {
  _count: { select: { reviewLikes: true } },
  user: { select: REVIEW_COMMON_USER_INCLUDE },
  anime: { select: REVIEW_COMMON_ANIME_INCLUDE },
} satisfies Prisma.ReviewInclude;
