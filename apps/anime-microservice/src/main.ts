import { NestFactory } from '@nestjs/core';
import { AnimeMicroserviceModule } from './anime-microservice.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AnimeMicroserviceModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const app2 = await NestFactory.createMicroservice<MicroserviceOptions>(
    AnimeMicroserviceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.getOrThrow<string>('RABBIT_MQ_URI')],
        queue: 'anime_queue',
        queueOptions: { durable: false },
      },
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  await app2.listen();

  await app.listen(config.getOrThrow('ANIME_MICROSERVICE_PORT') ?? 3001);
}
bootstrap();
