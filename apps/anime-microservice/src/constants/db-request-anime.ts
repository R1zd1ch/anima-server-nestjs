export const includeSmall = {
  genres: {
    include: {
      genre: true,
    },
  },

  theme: {
    include: {
      theme: true,
    },
  },

  demographic: {
    include: {
      demographic: true,
    },
  },

  studios: {
    include: {
      studio: true,
    },
  },

  poster: true,
};

export const includeAll = {
  ...includeSmall,

  screenshots: {
    include: {
      screenshot: true,
    },
  },

  videos: {
    include: {
      video: true,
    },
  },
};

export const shikimoriScoreNotNull = {
  AND: [{ shikimoriScore: { not: null } }, { shikimoriScore: { not: 0 } }],
};
