import { NestFactory } from '@nestjs/core';
import { AnimeMicroserviceModule } from './anime-microservice.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Express } from 'express';

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

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBIT_MQ_URI')],
      queue: 'anime_queue',
      queueOptions: { durable: false },
    },
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const configDoc = new DocumentBuilder()
    .setTitle('Anime microservice')
    .build();

  const document = SwaggerModule.createDocument(app, configDoc);

  const httpAdapterInstance = app.getHttpAdapter().getInstance() as Express;
  httpAdapterInstance.get('/swagger-json', (req, res) => {
    res.json(document);
  });

  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();

  await app.listen(config.getOrThrow('ANIME_MICROSERVICE_PORT') ?? 3001);
}
bootstrap();
