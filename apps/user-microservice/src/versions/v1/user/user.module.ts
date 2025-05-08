import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { UserRMQController } from './user-rmq.controller';

@Module({
  controllers: [UserController, UserRMQController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
