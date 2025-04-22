export enum AnimeKindEnum {
  tv = 'tv',
  movie = 'movie',
  ova = 'ova',
  ona = 'ona',
  special = 'special',
  tv_special = 'tv_special',
  music = 'music',
  pv = 'pv',
  cm = 'cm',
}

export enum AnimeRatingEnum {
  none = 'none',
  g = 'g',
  pg = 'pg',
  pg_13 = 'pg_13',
  r = 'r',
  r_plus = 'r_plus',
  rx = 'rx',
}

export enum AnimeStatusEnum {
  anons = 'anons',
  ongoing = 'ongoing',
  released = 'released',
}

export enum GenreKindEnum {
  demographic = 'demographic',
  genre = 'genre',
  theme = 'theme',
}

export enum ExternalLinkKindEnum {
  official_site = 'official_site',
  wikipedia = 'wikipedia',
  anime_news_network = 'anime_news_network',
  myanimelist = 'myanimelist',
  anime_db = 'anime_db',
  world_art = 'world_art',
  kinopoisk = 'kinopoisk',
  kage_project = 'kage_project',
  twitter = 'twitter',
  smotret_anime = 'smotret_anime',
  crunchyroll = 'crunchyroll',
  amazon = 'amazon',
  hidive = 'hidive',
  hulu = 'hulu',
  ivi = 'ivi',
  kinopoisk_hd = 'kinopoisk_hd',
  wink = 'wink',
  netflix = 'netflix',
  okko = 'okko',
  youtube = 'youtube',
  readmanga = 'readmanga',
  mangalib = 'mangalib',
  remanga = 'remanga',
  mangaupdates = 'mangaupdates',
  mangadex = 'mangadex',
  mangafox = 'mangafox',
  mangachan = 'mangachan',
  mangahub = 'mangahub',
  novel_tl = 'novel_tl',
  ruranobe = 'ruranobe',
  ranobelib = 'ranobelib',
  novelupdates = 'novelupdates',
}

export enum RelationKindEnum {
  adaptation = 'adaptation',
  alternative_setting = 'alternative_setting',
  alternative_version = 'alternative_version',
  character = 'character',
  full_story = 'full_story',
  other = 'other',
  parent_story = 'parent_story',
  prequel = 'prequel',
  sequel = 'sequel',
  side_story = 'side_story',
  spin_off = 'spin_off',
  summary = 'summary',
}

export enum VideoKindEnum {
  pv = 'pv',
  character_trailer = 'character_trailer',
  cm = 'cm',
  op = 'op',
  ed = 'ed',
  op_ed_clip = 'op_ed_clip',
  clip = 'clip',
  other = 'other',
  episode_preview = 'episode_preview',
}

export enum UserRateStatusEnum {
  planned = 'planned',
  watching = 'watching',
  rewatching = 'rewatching',
  completed = 'completed',
  on_hold = 'on_hold',
  dropped = 'dropped',
}

export interface IncompleteDate {
  year?: number | null;
  month?: number | null;
  day?: number | null;
  date?: string | null;
}

export interface Poster {
  id: string;
  originalUrl: string;
  mainUrl: string;
}

export interface Genre {
  id: string;
  name: string;
  russian: string;
  kind: GenreKindEnum;
}

export interface Studio {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface ExternalLink {
  id?: string | null;
  kind: ExternalLinkKindEnum;
  url: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface RelatedAnime {
  id: string;
  name: string;
  season: string | null;
}

export interface Related {
  id: string;
  anime?: RelatedAnime | null;
  relationKind: RelationKindEnum;
  relationText: string;
}

export interface Video {
  id: string;
  url: string;
  name?: string | null;
  kind: VideoKindEnum;
  playerUrl: string;
  imageUrl: string;
}

export interface Screenshot {
  id: string;
  originalUrl: string;
  x332Url: string;
}

export interface ScoreStat {
  score: number;
  count: number;
}

export interface StatusStat {
  status: UserRateStatusEnum;
  count: number;
}

export interface AnimeFromShikimori {
  id: string;
  malId?: string | null;
  name: string;
  russian: string;
  licenseNameRu?: string | null;
  english?: string | null;
  japanese?: string | null;
  synonyms: string[];
  kind?: AnimeKindEnum | null;
  rating?: AnimeRatingEnum | null;
  score?: number | null;
  status: AnimeStatusEnum;
  episodes: number;
  episodesAired: number;
  duration?: number | null;
  airedOn: IncompleteDate;
  releasedOn: IncompleteDate;
  url: string;
  season?: string | null;
  poster?: Poster | null;
  nextEpisodeAt?: string | null;
  isCensored?: boolean | null;
  genres: Genre[];
  studios: Studio[];
  externalLinks: ExternalLink[];
  related: Related[];
  videos: Video[];
  screenshots: Screenshot[];
  scoresStats: ScoreStat[];
  statusesStats: StatusStat[];
  description?: string | null;
}

export interface AnimeFromShikimoriResponse {
  animes: AnimeFromShikimori[];
}
