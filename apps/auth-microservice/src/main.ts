import { NestFactory } from '@nestjs/core';
import { UserMicroserviceModule } from './auth-microservice.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Express } from 'express';
import IORedis from 'ioredis';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session';
import { ms, StringValue } from '../../../shared/lib/utils/ms.util';
import { parseBoolean } from '../../../shared/lib/utils/parse-boolean.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // app.enableCors({
  //   origin: [config.getOrThrow<string>('ALLOWED_ORIGIN')],
  //   credentials: true,
  //   exposedHeaders: ['set-cookie'],
  // });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const configDoc = new DocumentBuilder()
    .setTitle('NEST JS UPDATE ANIME MISCROSERVICE')
    .setDescription('API DOCUMENTATION')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configDoc);

  const httpAdapterInstance = app.getHttpAdapter().getInstance() as Express;
  httpAdapterInstance.get('/swagger-json', (req, res) => {
    res.json(document);
  });

  SwaggerModule.setup('docs', app, document);

  await app.listen(config.getOrThrow('AUTH_MICROSERVICE_PORT') ?? 3000);
}
bootstrap();
