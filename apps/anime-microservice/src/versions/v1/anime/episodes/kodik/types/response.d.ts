export interface KodikTranslationInfo {
  id: number;
  title: string;
  type: string;
}

export interface KodikEpisode {
  number: number;
  link: string;
  screenshots: string[];
}

export interface KodikSeason {
  season: number;
  episodes: KodikEpisode[];
}

export interface KodikTranslation {
  translation: KodikTranslationInfo;
  lastEpisode: number;
  seasons: KodikSeason[];
}

export interface KodikResponse {
  kodik: {
    russian: string;
    name: string;
    year: number;
    shikimoriId: string;
    episodesCount: number;
    translations: KodikTranslation[];
  };
}
