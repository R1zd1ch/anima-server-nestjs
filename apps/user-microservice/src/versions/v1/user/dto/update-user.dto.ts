import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { UserGender } from '@prisma/__generated__';

export class UpdateUserDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  displayName: string;

  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email: string;

  @IsBoolean({ message: 'Статус должен быть булевым значением' })
  isTwoFactorEnabled: boolean;

  @IsOptional()
  @IsString({ message: 'Био должно быть строкой' })
  bio?: string;

  @IsOptional()
  @IsEnum(UserGender, { message: 'Некорректное значение для пола' })
  gender?: UserGender;

  @IsOptional()
  @IsString({ message: 'Страна должна быть строкой' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Город должен быть строкой' })
  city?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Дата рождения должна быть в формате ISO' })
  birthday?: string;

  @IsOptional()
  @IsString({ message: 'URL изображения должен быть строкой' })
  picture?: string;

  @IsOptional()
  @IsString({ message: 'URL баннера должен быть строкой' })
  banner?: string;
}
