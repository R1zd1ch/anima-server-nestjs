import { UserSettings } from '@prisma/__generated__';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto implements Partial<UserSettings> {
  @ApiProperty({
    description: 'Показывать город в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showCity?: boolean;

  @ApiProperty({
    description: 'Показывать страну в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showCountry?: boolean;

  @ApiProperty({
    description: 'Показывать дату регистрации в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showJoined?: boolean;

  @ApiProperty({
    description: 'Показывать день рождения в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showBirthday?: boolean;

  @ApiProperty({
    description: 'Показывать пол в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showGender?: boolean;

  @ApiProperty({
    description: 'Показывать статистику в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showStatistics?: boolean;

  @ApiProperty({
    description: 'Тема интерфейса',
    enum: ['system', 'light', 'dark'],
    example: 'system',
    required: false,
  })
  @IsOptional()
  @IsEnum(['system', 'light', 'dark'])
  theme?: string;

  @ApiProperty({
    description: 'Язык интерфейса',
    enum: ['ru', 'en'],
    example: 'ru',
    required: false,
  })
  @IsOptional()
  @IsEnum(['ru', 'en'])
  language?: string;

  @ApiProperty({
    description: 'Показывать био в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showBio?: boolean;

  @ApiProperty({
    description: 'Показывать избранное в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showFavorites?: boolean;

  @ApiProperty({
    description: 'Показывать email в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @ApiProperty({
    description: 'Показывать активность в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showActivity?: boolean;

  @ApiProperty({
    description: 'Показывать список аниме в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showAnimeList?: boolean;

  @ApiProperty({
    description: 'Показывать все комментарии в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showAllCommentsInProfile?: boolean;

  @ApiProperty({
    description: 'Показывать коллекции в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showCollections?: boolean;

  @ApiProperty({
    description: 'Показывать понравившиеся коллекции в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showLikedCollections?: boolean;

  @ApiProperty({
    description: 'Показывать понравившиеся отзывы в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showLikedReviews?: boolean;

  @ApiProperty({
    description: 'Показывать отзывы в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showReviews?: boolean;

  @ApiProperty({
    description: 'Показывать последние просмотренные аниме в профиле',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showLatestWatched?: boolean;

  @ApiProperty({
    description: 'Включить уведомления',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificationsOn?: boolean;
}
