import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User, AuthMethod } from '@prisma/__generated__';
import { Request } from 'express-session';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from '../provider/provider.service';
import { PrismaService } from '../../../../../../shared/lib/prisma/prisma.service';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  public constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}
  public async register(dto: RegisterDto) {
    const isExists = await firstValueFrom<User>(
      this.userClient.send({ cmd: 'find-user-by-email' }, dto.email),
    );

    if (isExists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const newUser = await firstValueFrom<User>(
      this.userClient.send(
        {
          cmd: 'create-user',
        },
        {
          email: dto.email,
          password: dto.password,
          username: dto.username,
          displayName: dto.name,
          picture: '',
          method: AuthMethod.CREDENTIALS,
          isVerified: false,
        },
      ),
    );
    await this.emailConfirmationService.sendVerificationToken(newUser.email);

    return {
      message:
        'Пользователь успешно зарегистрирован. Проверьте свою почту, чтобы подтвердить регистрацию.',
    };
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await firstValueFrom<User>(
      this.userClient.send({ cmd: 'find-user-by-email' }, dto.email),
    );

    if (!user || !user.password) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль');
    }

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user.email);
      throw new UnauthorizedException(
        'Пользователь не подтвержден. Проверьте свою почту, чтобы подтвердить регистрацию.',
      );
    }

    if (user.isTwoFactorEnabled) {
      if (!dto.code) {
        await this.twoFactorAuthService.sendTwoFactorToken(user.email);

        return {
          message: 'На вашу почту отправлен код двухфакторной аутентификации.',
        };
      }

      await this.twoFactorAuthService.validateTwoFactorToken(
        user.email,
        dto.code,
      );
    }

    return this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);

    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    let user = account?.userId
      ? await firstValueFrom<User>(
          this.userClient.send({ cmd: 'find-user-by-id' }, account.userId),
        )
      : null;

    if (user) {
      if (!account) {
        await this.prismaService.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: profile.provider,
            accessToken: profile.access_token,
            refreshToken: profile.refresh_token,
            expiresAt: profile.expires_at,
          },
        });
      }
      return this.saveSession(req, user);
    }

    user = await firstValueFrom<User>(
      this.userClient.send(
        {
          cmd: 'create-user',
        },
        {
          email: profile.email,
          password: '',
          username: profile.email.split('@')[0],
          displayName: profile.name,
          picture: profile.picture,
          method: AuthMethod[profile.provider.toUpperCase()],
          isVerified: true,
        },
      ),
    );

    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at,
        },
      });
    }

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user.email);
      throw new UnauthorizedException(
        'Пользователь успешно зарегистрирован. Проверьте свою почту, чтобы подтвердить регистрацию.',
      );
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось удалить сессию пользователя.',
            ),
          );
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

        resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      // req.session.user = user;
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохрнанить сессию пользователя.',
            ),
          );
        }

        resolve({
          user,
        });
      });
    });
  }
}
