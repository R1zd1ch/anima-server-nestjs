import { IsString } from 'class-validator';

export class UpdateAnimeNoteDto {
  @IsString()
  animeId: string;

  @IsString()
  note: string;
}
