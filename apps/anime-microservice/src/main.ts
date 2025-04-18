import { NestFactory } from '@nestjs/core';
import { AnimeMicroserviceModule } from './anime-microservice.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
// import IORedis from 'ioredis';
// import { RedisStore } from 'connect-redis';
// import { ms, StringValue } from '../../../shared/lib/utils/ms.util';
// import { parseBoolean } from '../../../shared/lib/utils/parse-boolean.util';
// import * as session from 'express-session';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AnimeMicroserviceModule);
  const config = app.get(ConfigService);

  // const password = config.getOrThrow<string>('REDIS_PASSWORD');
  // const host = config.getOrThrow<string>('REDIS_HOST');
  // const port = config.getOrThrow<string>('REDIS_PORT');

  // const redisUri = `redis://:${password}@${host}:${port}`;
  // if (!redisUri) {
  //   throw new Error('REDIS_URI is not defined');
  // }

  // console.log(redisUri);

  // const redis = new IORedis(redisUri);

  // app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // app.use(
  //   session({
  //     secret: config.getOrThrow<string>('SESSION_SECRET'),
  //     name: config.getOrThrow<string>('SESSION_NAME'),
  //     resave: true,
  //     saveUninitialized: false,
  //     cookie: {
  //       domain: config.getOrThrow<string>('SESSION_DOMAIN'),
  //       maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
  //       httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
  //       secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
  //       samesite: 'lax',
  //     },
  //     store: new RedisStore({
  //       client: redis,
  //       prefix: config.getOrThrow<string>('SESSION_FOLDER'),
  //     }),
  //   }),
  // );
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  await app.listen(config.getOrThrow('ANIME_MICROSERVICE_PORT') ?? 3001);
}
bootstrap();
