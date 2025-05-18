import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { NewPasswordDto } from './dto/new-password.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({ path: 'auth/password-recovery', version: '1' })
export class PasswordRecoveryController {
  public constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Recaptcha()
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Восстановление пароля' })
  @ApiResponse({
    status: 200,
    description: 'Пароль успешно восстановлен',
  })
  @ApiBody({ type: ResetPasswordDto })
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordRecoveryService.resetPassword(dto);
  }

  @Recaptcha()
  @Post('new/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Установка нового пароля' })
  @ApiResponse({
    status: 200,
    description: 'Пароль успешно изменён',
  })
  @ApiBody({ type: NewPasswordDto })
  @ApiParam({ name: 'token', description: 'Токен для сброса пароля' })
  public async newPassword(
    @Body() dto: NewPasswordDto,
    @Param('token') token: string,
  ) {
    return this.passwordRecoveryService.newPassword(dto, token);
  }
}
