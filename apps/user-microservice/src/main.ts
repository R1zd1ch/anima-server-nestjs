import { NestFactory } from '@nestjs/core';
import { UserMicroserviceModule } from './user-microservice.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { parseBoolean } from 'shared/lib/utils/parse-boolean.util';
import { ms, StringValue } from 'shared/lib/utils/ms.util';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session';
import IORedis from 'ioredis';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Express } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(UserMicroserviceModule);
  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow('REDIS_URI'));

  app.use(
    ((cookieParser as (secret: string) => void) ?? (() => {}))(
      config.getOrThrow<string>('COOKIES_SECRET'),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

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

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBIT_MQ_URI')],
      queue: 'auth_queue',
      queueOptions: { durable: false },
    },
  });

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

  const configDoc = new DocumentBuilder().setTitle('User microservice').build();

  const document = SwaggerModule.createDocument(app, configDoc);

  const httpAdapterInstance = app.getHttpAdapter().getInstance() as Express;
  httpAdapterInstance.get('/swagger-json', (req, res) => {
    res.json(document);
  });

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: false,

    swaggerOptions: {
      operationsSorter: 'method',
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.getOrThrow<string>('USER_MICROSERVICE_PORT') ?? 3005);
}
bootstrap();
