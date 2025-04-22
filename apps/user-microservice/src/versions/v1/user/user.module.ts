import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RabbitMQModule } from 'shared/lib/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
