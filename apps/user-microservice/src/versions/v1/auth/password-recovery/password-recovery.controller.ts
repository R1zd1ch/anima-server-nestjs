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

@Controller({ path: 'auth/password-recovery', version: '1' })
export class PasswordRecoveryController {
  constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Recaptcha()
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordRecoveryService.resetPassword(dto);
  }

  @Recaptcha()
  @Post('new/:token')
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Body() dto: NewPasswordDto,
    @Param('token') token: string,
  ) {
    console.log(token);
    return this.passwordRecoveryService.newPassword(dto, token);
  }
}
