import { AnimeCollectionType } from '@prisma/__generated__';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsEnum(AnimeCollectionType)
  @IsOptional()
  type?: AnimeCollectionType;
}
