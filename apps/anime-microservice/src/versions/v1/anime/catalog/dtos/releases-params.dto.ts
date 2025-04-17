import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum AnimeType {
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

export enum AnimeAgeRatings {
  none = 'none',
  g = 'g',
  pg = 'pg',
  pg_13 = 'pg_13',
  r = 'r',
  r_plus = 'r_plus',
  rx = 'rx',
}

export enum AnimeSeason {
  spring = 'spring',
  summer = 'summer',
  fall = 'fall',
  winter = 'winter',
}

export enum AnimeStatus {
  anons = 'anons',
  ongoing = 'ongoing',
  released = 'released',
}

export enum SortParams {
  year_asc = 'year_asc',
  year_desc = 'year_desc',
  scrore_asc = 'score_asc',
  score_desc = 'score_desc',
  name_asc = 'name_asc',
  name_desc = 'name_desc',
  id_asc = 'id_asc',
  id_desc = 'id_desc',
}

export class ReleasesParamsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v) => parseInt(v, 10))
      : value,
  )
  genres?: number[];

  @IsOptional()
  @IsEnum(AnimeType, { each: true })
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  types?: AnimeType[];

  @IsOptional()
  @IsEnum(AnimeSeason, { each: true })
  season?: AnimeSeason;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  min_year?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  max_year?: number;

  @IsOptional()
  @IsString()
  @IsEnum(SortParams)
  sort?: string;

  @IsOptional()
  @IsEnum(AnimeAgeRatings, { each: true })
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  age_ratings?: AnimeAgeRatings[];

  @IsOptional()
  @IsEnum(AnimeStatus)
  status?: AnimeStatus;
}
