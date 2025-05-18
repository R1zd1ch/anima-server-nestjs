import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express-session';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from '../provider/provider.service';
import { AuthProviderGuard } from './guards/provider.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from './account/account.service';
import { Authorized } from 'shared/decorators/authorized.decorator';
import { Authorization } from 'shared/decorators/auth.decorator';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly accountService: AccountService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({
    status: 200,
    description:
      'Пользователь успешно зарегистрирован. Проверьте свою почту, чтобы подтвердить регистрацию.',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует.',
  })
  @ApiBody({ type: RegisterDto })
  public async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiResponse({
    status: 200,
    description:
      'Данные пользователя или сообщение о двухфакторной аутентификации',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({
    status: 401,
    description: 'Неверный пароль или не подтвержден',
  })
  @ApiBody({ type: LoginDto })
  public async login(@Req() req: Request, @Body() dto: LoginDto) {
    return await this.authService.login(req, dto);
  }

  @Authorization()
  @Get('accounts')
  @ApiOperation({ summary: 'Получить список связанных аккаунтов' })
  @ApiResponse({ status: 200, description: 'Список аккаунтов' })
  public async getLinkedAccounts(userId: string) {
    return await this.accountService.getLinkedAccounts(userId);
  }

  @Get('/oauth/callback/:provider')
  @UseGuards(AuthProviderGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'OAuth Callback операция' })
  @ApiParam({
    name: 'provider',
    description: 'OAuth провайдер (например, google)',
  })
  @ApiQuery({ name: 'code', description: 'OAuth код авторизации' })
  public async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string,
  ) {
    if (!code) {
      throw new BadRequestException('Не был предоставлен код для авторизации');
    }

    await this.authService.extractProfileFromCode(req, provider, code);

    return res.redirect(
      `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`,
    );
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение URL для OAuth авторизации' })
  @ApiParam({
    name: 'provider',
    description: 'OAuth провайдер (например, google)',
  })
  public async connect(@Param('provider') provider: string) {
    const providerInstance = this.providerService.findByService(provider);

    return new Promise((resolve) =>
      resolve({ url: providerInstance.getAuthUrl() }),
    );
  }

  @Authorization()
  @Delete('accounts/:provider')
  @ApiOperation({ summary: 'Отвязать аккаунт' })
  @ApiParam({
    name: 'provider',
    description: 'OAuth провайдер (например, google)',
  })
  public async disconnectAccount(
    @Authorized('id') userId: string,
    @Param('provider') provider: string,
  ) {
    return await this.accountService.unlinkAccount(userId, provider);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiResponse({ status: 200 })
  public async logout(
    @Req() req: Request,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    return await this.authService.logout(req, res);
  }
}
