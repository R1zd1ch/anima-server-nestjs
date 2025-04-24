import { MailService } from 'apps/auth-microservice/src/libs/mail/mail.service';
import { PrismaService } from '../../../../../../../shared/lib/prisma/prisma.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenType, User } from '@prisma/__generated__';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { hash } from 'argon2';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async resetPassword(dto: ResetPasswordDto) {
    const existingUser = await firstValueFrom<User>(
      this.userClient.send({ cmd: 'find-user-by-email' }, dto.email),
    );

    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const passwordResetToken = await this.generatePasswordResetToken(
      existingUser.email,
    );

    await this.mailService.sendPasswordResetEmail(
      existingUser.email,
      passwordResetToken.token,
    );

    return true;
  }

  public async newPassword(dto: NewPasswordDto, token: string) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Токен сброса пароля не найден');
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException('Токен сброса пароля устарел');
    }

    const existingUser = await firstValueFrom<User>(
      this.userClient.send({ cmd: 'find-user-by-email' }, existingToken.email),
    );

    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: await hash(dto.password),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return true;
  }

  private async generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.PASSWORD_RESET,
        },
      });
    }

    const passwordResetToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn: expiresIn,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return passwordResetToken;
  }
}
