export interface AnimeData {
  name: {
    main: string;
    english?: string;
    alternative?: string;
  };
  year: number;
  episodes_total: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  name: string;
  ordinal: number;
  opening?: {
    start: number;
    stop: number;
  };
  ending?: {
    start: number;
    stop: number;
  };
  preview?: {
    src: string;
    thumbnail: string;
    optmized?: {
      src: string;
      thumbnail: string;
    };
  };
  hls_480?: string;
  hls_720?: string;
  hls_1080?: string;
  duration: number;
  rutube_id?: string;
  youtube_id?: string;
  updated_at: string;
  sort_order?: number;
  name_english?: string;
}
