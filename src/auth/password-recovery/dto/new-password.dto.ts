import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsString({ message: 'Пароль должен быть строкой.' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов.' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым.' })
  password: string;
}
