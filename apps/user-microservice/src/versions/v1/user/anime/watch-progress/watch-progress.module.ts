import { forwardRef, Module } from '@nestjs/common';
import { WatchProgressService } from './watch-progress.service';
import { WatchProgressController } from './watch-progress.controller';
import { UserModule } from '../../user.module';
import { RabbitMQModule } from 'shared/lib/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    RabbitMQModule.forRoot({
      name: 'ANIME_WATCH_PROGRESS',
      queue: 'anime_queue',
    }),
  ],
  controllers: [WatchProgressController],
  providers: [WatchProgressService],
})
export class WatchProgressModule {}
