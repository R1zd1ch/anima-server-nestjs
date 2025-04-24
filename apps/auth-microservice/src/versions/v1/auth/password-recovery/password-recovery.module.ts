import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';

import { MailService } from 'apps/auth-microservice/src/libs/mail/mail.service';

@Module({
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, MailService],
})
export class PasswordRecoveryModule {}
