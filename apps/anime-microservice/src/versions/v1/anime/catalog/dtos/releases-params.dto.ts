import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  year_asc = 'airedOn_asc',
  year_desc = 'airedOn_desc',
  score_asc = 'score_asc',
  score_desc = 'score_desc',
  name_asc = 'name_asc',
  name_desc = 'name_desc',
  id_asc = 'id_asc',
  id_desc = 'id_desc',
  shikimoriScore_asc = 'shikimoriScore_asc',
  shikimoriScore_desc = 'shikimoriScore_desc',
}

export class ReleasesParamsDto {
  @ApiProperty({
    description: 'Номер страницы',
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Поиск по русскому названию аниме',
    required: false,
  })
  @IsOptional()
  @IsString()
  russian?: string;

  @ApiProperty({
    description: 'Количество элементов на странице',
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({
    description: 'Список жанров',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v: string): number => parseInt(v, 10))
      : (value as number[]),
  )
  genres?: number[];

  @ApiProperty({
    description: 'Список демографических категорий',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v: string): number => parseInt(v, 10))
      : (value as number[]),
  )
  demographics?: number[];

  @ApiProperty({
    description: 'Список тем',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v: string): number => parseInt(v, 10))
      : (value as number[]),
  )
  themes?: number[];

  @ApiProperty({
    description: 'Типы аниме (tv, movie, ova и т.д.)',
    required: false,
    type: [String],
    enum: AnimeType,
  })
  @IsOptional()
  @IsEnum(AnimeType, { each: true })
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  types?: AnimeType[];

  @ApiProperty({
    description: 'Сезоны аниме (spring, summer, fall, winter)',
    required: false,
    type: [String],
    enum: AnimeSeason,
  })
  @IsOptional()
  @IsEnum(AnimeSeason, { each: true })
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  seasons?: AnimeSeason[];

  @ApiProperty({
    description: 'Минимальный год выпуска аниме',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  min_year?: number;

  @ApiProperty({
    description: 'Максимальный год выпуска аниме',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  max_year?: number;

  @ApiProperty({
    description: 'Параметры сортировки (например, по году, по оценке)',
    required: false,
    enum: SortParams,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortParams)
  sort?: string;

  @ApiProperty({
    description: 'Возрастные рейтинги аниме',
    required: false,
    type: [String],
    enum: AnimeAgeRatings,
  })
  @IsOptional()
  @IsEnum(AnimeAgeRatings, { each: true })
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  age_ratings?: AnimeAgeRatings[];

  @ApiProperty({
    description: 'Статус аниме (анонс, продолжается, выпущено)',
    required: false,
    enum: AnimeStatus,
  })
  @IsOptional()
  @IsEnum(AnimeStatus)
  status?: AnimeStatus;
}
