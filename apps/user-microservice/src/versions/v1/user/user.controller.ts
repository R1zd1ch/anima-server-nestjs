import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from 'shared/decorators/authorized.decorator';
import { Authorization } from 'shared/decorators/auth.decorator';
import { UserRole } from '@prisma/__generated__';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';

@ApiTags('User')
@ApiCookieAuth()
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя успешно получен',
  })
  public async findProfile(@Authorized('id') userId: string) {
    const result = await this.userService.findById(userId);
    return wrapApiResponse(result);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  @ApiOperation({ summary: 'Обновить профиль текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя успешно обновлён',
  })
  public async updateProfile(
    @Authorized('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    const result = await this.userService.update(userId, dto);
    return wrapApiResponse(result);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('profile')
  @ApiOperation({ summary: 'Удалить профиль текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя успешно удалён',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  public async deleteProfile(@Authorized('id') userId: string) {
    const result = await this.userService.delete(userId);
    return wrapApiResponse(result);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile-public/:id')
  @ApiOperation({ summary: 'Получить публичный профиль пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Публичный профиль пользователя успешно получен',
  })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  public async getPublicProfile(@Param('id') userId: string) {
    const result = await this.userService.getPublicProfile(userId);
    return wrapApiResponse(result);
  }

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить настройки текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Настройки пользователя успешно получены',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  public async getSettings(@Authorized('id') userId: string) {
    const result = await this.userService.getUserWithSettings(userId);
    return wrapApiResponse(result);
  }

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  @ApiOperation({
    summary: 'Получить пользователя по ID (только для администратора)',
  })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе успешно получена',
  })
  public async findById(@Param('id') userId: string) {
    const result = await this.userService.findById(userId);
    return wrapApiResponse(result);
  }
}
