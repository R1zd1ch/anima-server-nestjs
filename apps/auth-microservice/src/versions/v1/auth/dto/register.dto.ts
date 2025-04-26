import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Импорт аннотации из @nestjs/swagger
import { IsPasswordsMatchingConstraint } from 'apps/auth-microservice/src/libs/common/decorators/is-password-matching-constraint.decorator';

export class RegisterDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
  })
  @IsString({ message: 'Имя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения.' })
  name: string;

  @ApiProperty({
    description: 'Username пользователя',
    example: 'ivan123',
  })
  @IsString({ message: 'Username должен быть строкой' })
  @IsNotEmpty({ message: 'Username обязателен для заполнения.' })
  username: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'ivan@example.com',
  })
  @IsString({ message: 'Email должен быть строкой.' })
  @IsEmail({}, { message: 'Некорректный формат email.' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения.' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
  })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
  @MinLength(6, {
    message: 'Пароль должен содержать минимум 6 символов.',
  })
  password: string;

  @ApiProperty({
    description: 'Повторный пароль для проверки совпадения',
    example: 'password123',
  })
  @IsString({ message: 'Пароль подтверждения должен быть строкой.' })
  @IsNotEmpty({ message: 'Поле подтверждения пароля не может быть пустым.' })
  @MinLength(6, {
    message: 'Пароль подтверждения должен содержать не менее 6 символов.',
  })
  @Validate(IsPasswordsMatchingConstraint, {
    message: 'Пароли не совпадают.',
  })
  passwordRepeat: string;
}
