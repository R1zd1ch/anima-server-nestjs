import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { UpdateAnimeMicroserviceModule } from './update-anime-microservice.module';

async function bootstrap() {
  const logger = new Logger('UpdateAnimeMicroservice');

  const app = await NestFactory.create(UpdateAnimeMicroserviceModule);
  const config = app.get(ConfigService);

  await app.listen(config.get('APPLICATION_UPDATE_ANIME_PORT'));

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  logger.log(
    `UpdateAnimeMicroservice is listening on port ${config.get(
      'APPLICATION_UPDATE_ANIME_PORT',
    )}`,
  );
}
bootstrap();
