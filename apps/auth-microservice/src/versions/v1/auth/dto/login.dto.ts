import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsString({ message: 'Email должен быть строкой.' })
  @IsEmail({}, { message: 'Некорректный формат email.' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения.' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя (не менее 6 символов)',
    example: 'qwerty123',
    minLength: 6,
  })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Поле пароль не может быть пустым.' })
  @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов.' })
  password: string;

  @ApiPropertyOptional({
    description: 'Код двухфакторной аутентификации (если требуется)',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  code?: string;
}
