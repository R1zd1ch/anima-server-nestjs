// libs/shared/rabbitmq/rabbitmq.module.ts
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

const AnimeServiceClient = ClientsModule.registerAsync([
  {
    name: 'ANIME_SERVICE',
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      transport: Transport.RMQ,
      options: {
        urls: [config.get<string>('RABBIT_MQ_URI')],
        queue: 'anime_queue',
        queueOptions: { durable: false },
      },
    }),
    inject: [ConfigService],
  },
]);

@Global()
@Module({
  imports: [ConfigModule, AnimeServiceClient],
  exports: [AnimeServiceClient],
})
export class RabbitMQModule {}
