import { IsString, IsOptional } from 'class-validator';

export class AddAnimeToCollectionDto {
  @IsString()
  animeId: string;

  @IsOptional()
  @IsString()
  note?: string;
}
