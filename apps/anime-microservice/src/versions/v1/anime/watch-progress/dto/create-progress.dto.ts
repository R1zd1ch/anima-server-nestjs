import { IsBoolean, IsInt, IsNumber, Min } from 'class-validator';

export class ProgressCreateDto {
  @IsInt()
  @Min(1)
  episode: number;

  @IsNumber()
  @Min(0)
  timestamp: number;

  @IsBoolean()
  isWatched: boolean;
}
