import { Prisma } from '@prisma/__generated__';

export const COMMENT_COMMON_USER_INCLUDE = {
  id: true,
  username: true,
  displayName: true,
  picture: true,
} satisfies Prisma.UserSelect;

export const COMMENT_COMMON_ANIME_INCLUDE = {
  id: true,
  russian: true,
  name: true,
  poster: {
    select: { originalUrl: true, mainUrl: true },
  },
} satisfies Prisma.AnimeSelect;

export const COMMENT_COMMON_WITH_COUNTS = {
  _count: { select: { CommentLike: true, replies: true } },
} satisfies Prisma.CommentSelect;

export const COMMENT_COMMON_INCLUDE = {
  ...COMMENT_COMMON_WITH_COUNTS,
  user: { select: COMMENT_COMMON_USER_INCLUDE },
  anime: { select: COMMENT_COMMON_ANIME_INCLUDE },
} satisfies Prisma.CommentInclude;
