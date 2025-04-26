import {
  Body,
  Controller,
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

@ApiTags('User')
@ApiCookieAuth()
@Controller({ path: 'user', version: '1' }) //было users если что то сломается
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
    return this.userService.findById(userId);
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
    return this.userService.findById(userId);
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
    return this.userService.update(userId, dto);
  }
}
