import { Prisma } from '@prisma/__generated__';

export const COLLECTION_COMMON_USER_INCLUDE = {
  id: true,
  username: true,
  displayName: true,
  picture: true,
} satisfies Prisma.UserSelect;

export const COLLECTION_COMMON_ANIME_INCLUDE = {
  id: true,
  name: true,
  russian: true,
  airedOn: true,
  rating: true,
  description: true,
  kind: true,
  theme: true,
  demographic: true,
  genres: true,
  poster: {
    select: {
      originalUrl: true,
      mainUrl: true,
    },
  },
} satisfies Prisma.AnimeSelect;

export const COMMON_COLLECTION_INCLUDE = {
  _count: { select: { likes: true, items: true } },
  user: { select: COLLECTION_COMMON_USER_INCLUDE },
  items: { include: { anime: { select: COLLECTION_COMMON_ANIME_INCLUDE } } },
} satisfies Prisma.AnimeCollectionSelect;
