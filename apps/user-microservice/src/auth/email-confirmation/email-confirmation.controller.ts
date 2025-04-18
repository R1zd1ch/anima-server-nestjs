import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { Request } from 'express';
import { ConfirmationDto } from './dto/confirmation.dro';

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async newVerification(@Req() req: Request, @Body() dto: ConfirmationDto) {
    return this.emailConfirmationService.newVerificationToken(req, dto);
  }
}
