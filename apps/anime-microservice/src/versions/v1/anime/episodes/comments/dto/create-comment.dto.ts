import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsNumber()
  episode: number;

  @IsString()
  animeId: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
