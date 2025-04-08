import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @IsBoolean({ message: 'Status must be a boolean' })
  isTwoFactorEnabled: boolean;
}
