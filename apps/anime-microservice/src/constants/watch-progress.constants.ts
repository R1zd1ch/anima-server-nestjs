import { Prisma } from '@prisma/__generated__';

export const WATCH_PROGRESS_COMMON_USER_INCLUDE = {
  id: true,
  username: true,
  displayName: true,
  picture: true,
} satisfies Prisma.UserSelect;

export const WATCH_PROGRESS_COMMON_ANIME_INCLUDE = {
  id: true,
  russian: true,
  name: true,
  poster: {
    select: { originalUrl: true, mainUrl: true },
  },
} satisfies Prisma.AnimeSelect;

export const WATCH_PROGRESS_COMMON_INCLUDE = {
  user: { select: WATCH_PROGRESS_COMMON_USER_INCLUDE },
  anime: { select: WATCH_PROGRESS_COMMON_ANIME_INCLUDE },
} satisfies Prisma.AnimeEpisodeProgressSelect;
