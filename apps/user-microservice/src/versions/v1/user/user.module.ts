import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { UserRMQController } from './user-rmq.controller';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [forwardRef(() => SettingsModule)],
  controllers: [UserController, UserRMQController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
