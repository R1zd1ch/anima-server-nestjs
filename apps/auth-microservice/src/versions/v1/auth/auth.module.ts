import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRecaptchaConfig } from 'apps/auth-microservice/src/config/recaptcha.config';
import { ProviderModule } from '../provider/provider.module';
import { getProvidersConfig } from 'apps/auth-microservice/src/config/providers.config';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { MailService } from 'apps/auth-microservice/src/libs/mail/mail.service';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';
import { RabbitMQModule } from 'shared/lib/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
    RabbitMQModule.forRoot({
      name: 'USER_SERVICE',
      queue: 'auth_queue',
    }),
    forwardRef(() => EmailConfirmationModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    EmailConfirmationService,
    TwoFactorAuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
