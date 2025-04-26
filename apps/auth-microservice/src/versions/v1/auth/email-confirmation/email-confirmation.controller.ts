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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({ path: 'auth/email-confirmation', version: '1' })
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Подтверждение электронной почты' })
  @ApiResponse({
    status: 200,
    description: 'Токен для подтверждения отправлен на email',
  })
  @ApiBody({ type: ConfirmationDto })
  async newVerification(@Req() req: Request, @Body() dto: ConfirmationDto) {
    return this.emailConfirmationService.newVerificationToken(req, dto);
  }
}
