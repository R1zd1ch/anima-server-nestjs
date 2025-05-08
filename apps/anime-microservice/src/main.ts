import { NestFactory } from '@nestjs/core';
import { AnimeMicroserviceModule } from './anime-microservice.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Express } from 'express';
import * as cookieParser from 'cookie-parser';
import IORedis from 'ioredis';
import * as session from 'express-session';
import { ms, StringValue } from 'shared/lib/utils/ms.util';
import { parseBoolean } from 'shared/lib/utils/parse-boolean.util';
import { RedisStore } from 'connect-redis';
import { AllExceptionsFilter } from 'shared/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AnimeMicroserviceModule);
  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow('REDIS_URI'));

  app.use(
    ((cookieParser as (secret: string) => void) ?? (() => {}))(
      config.getOrThrow<string>('COOKIES_SECRET'),
    ),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        samesite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
      }),
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
