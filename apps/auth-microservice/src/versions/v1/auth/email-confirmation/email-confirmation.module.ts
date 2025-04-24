import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { MailModule } from 'apps/auth-microservice/src/libs/mail/mail.module';
import { AuthModule } from '../auth.module';
import { MailService } from 'apps/auth-microservice/src/libs/mail/mail.service';

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, MailService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
