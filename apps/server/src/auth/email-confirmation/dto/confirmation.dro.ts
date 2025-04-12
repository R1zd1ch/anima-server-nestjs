import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationDto {
  @IsString({ message: 'Confirmation token must be a string' })
  @IsNotEmpty({ message: 'Confirmation token must not be empty' })
  token: string;
}
