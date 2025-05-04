import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  userId: string;

  @IsString()
  episodeId: string;

  @IsString()
  animeId: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
