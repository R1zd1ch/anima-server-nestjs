import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { UpdateAnimeMicroserviceModule } from './update-anime-microservice.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('UpdateAnimeMicroservice');

  const app = await NestFactory.create(UpdateAnimeMicroserviceModule);
  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const configDoc = new DocumentBuilder()
    .setTitle('NEST JS UPDATE ANIME MISCROSERVICE')
    .setDescription('API DOCUMENTATION')
    .setVersion('1.0')
    .build();

  logger.log(
    `UpdateAnimeMicroservice is listening on port ${config.get(
      'UPDATE_ANIME_MICROSERVICE_PORT',
    )}`,
  );
  const document = SwaggerModule.createDocument(app, configDoc);

  SwaggerModule.setup('/docs', app, document);

  await app.listen(config.get('UPDATE_ANIME_MICROSERVICE_PORT'));
}
bootstrap();
