import { NestFactory } from '@nestjs/core';
import { UserMicroserviceModule } from './user-microservice.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserMicroserviceModule);
  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBIT_MQ_URI')],
      queue: 'user_queue',
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.getOrThrow<string>('USER_MICROSERVICE_PORT') ?? 3005);
}
bootstrap();
