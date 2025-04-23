import { AnimeCollectionType } from '@prisma/__generated__';
import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(AnimeCollectionType, { message: 'Invalid collection type' })
  type?: AnimeCollectionType;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
