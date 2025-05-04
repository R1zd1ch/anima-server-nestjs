import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TranslationInfoDto {
  @IsString()
  title: string;

  @IsString()
  type: string;
}

export class OpeningDto {
  @IsOptional()
  @IsNumber()
  stop: number | null;

  @IsOptional()
  @IsNumber()
  start: number | null;
}

export class PreviewDto {
  @IsOptional()
  @IsString()
  src: string | null;

  @IsOptional()
  @IsString()
  thumbnail: string | null;

  @ValidateNested()
  @Type(() => PreviewDto)
  @IsOptional()
  optimized: PreviewDto;
}

export class EpisodeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  ordinal: number;

  @ValidateNested()
  @Type(() => OpeningDto)
  opening: OpeningDto;

  @ValidateNested()
  @Type(() => OpeningDto)
  ending: OpeningDto;

  @ValidateNested()
  @Type(() => PreviewDto)
  preview: PreviewDto;

  @IsOptional()
  @IsString()
  hls_480: string | null;

  @IsOptional()
  @IsString()
  hls_720: string | null;

  @IsOptional()
  @IsString()
  hls_1080: string | null;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  rutube_id: string | null;

  @IsOptional()
  @IsString()
  youtube_id: string | null;

  @IsString()
  updated_at: string;

  @IsNumber()
  sort_order: number;

  @IsOptional()
  @IsString()
  name_english: string | null;
}

export class SeasonDto {
  @IsNumber()
  season: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EpisodeDto)
  episodes: EpisodeDto[];
}

export class TranslationDto {
  @ValidateNested()
  @Type(() => TranslationInfoDto)
  translation: TranslationInfoDto;

  @IsNumber()
  lastEpisode: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeasonDto)
  seasons: SeasonDto[];
}

export class AnilibriaNormalizedDto {
  @IsString()
  russian: string;

  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsString()
  shikimoriId: string;

  @IsNumber()
  episodesCount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
