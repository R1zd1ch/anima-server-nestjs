export enum CacheKeyPrefix {
  ANIME = 'anime',
  USER = 'user',
}

export enum AnimeCacheKey {
  THEMES = 'themes',
  GENRES = 'genres',
  DEMOGRAPHIC = 'demographic',
}

export enum UserCacheKey {
  WATCH_PROGRESS = 'watch-progress',
  COMMENTS = 'comments',
}

export const ANIME_CACHE_TTL = {
  [AnimeCacheKey.THEMES]: 60_000 * 60,
  [AnimeCacheKey.GENRES]: 60_000 * 60,
  [AnimeCacheKey.DEMOGRAPHIC]: 60_000 * 60,
} as const;

export const USER_CACHE_TTL = {
  [UserCacheKey.WATCH_PROGRESS]: 60_000 * 60,
  [UserCacheKey.COMMENTS]: 60_000 * 60,
} as const;

export const getAnimeCacheKey = (key: AnimeCacheKey, item: string) => {
  return `${CacheKeyPrefix.ANIME}:${key}:${item}`;
};

export const getAnimeCacheTTL = (key: AnimeCacheKey): number => {
  return ANIME_CACHE_TTL[key] || 60_000;
};

export const getUserCacheKey = (key: UserCacheKey, item: string) => {
  return `${CacheKeyPrefix.USER}:${key}:${item}`;
};

export const getUserCacheTTL = (key: UserCacheKey): number => {
  return USER_CACHE_TTL[key] || 60_000;
};
