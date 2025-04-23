import { forwardRef, Module } from '@nestjs/common';
import { RabbitMQModule } from 'shared/lib/rabbitmq/rabbitmq.module';
import { CollectionsService } from './collection.service';
import { CollectionsController } from './collection.controller';
import { UserModule } from '../../user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    RabbitMQModule.forRoot({
      name: 'ANIME_COLLECTIONS',
      queue: 'anime_queue',
    }),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
