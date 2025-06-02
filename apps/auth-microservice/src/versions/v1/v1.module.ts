import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../../shared/lib/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProviderModule } from './provider/provider.module';
import { MailModule } from '../../libs/mail/mail.module';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProviderModule,
    MailModule,
    EmailConfirmationModule,
    PasswordRecoveryModule,
    TwoFactorAuthModule,
  ],
})
export class V1Module {}
