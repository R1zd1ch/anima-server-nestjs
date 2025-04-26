import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { UpdateAnimeMicroserviceModule } from './update-anime-microservice.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Express } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(UpdateAnimeMicroserviceModule);
  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const configDoc = new DocumentBuilder()
    .setTitle('Update Anime microservice')
    .build();

  const document = SwaggerModule.createDocument(app, configDoc);

  const httpAdapterInstance = app.getHttpAdapter().getInstance() as Express;
  httpAdapterInstance.get('/swagger-json', (req, res) => {
    res.json(document);
  });

  SwaggerModule.setup('/docs', app, document);

  await app.listen(config.get('UPDATE_ANIME_MICROSERVICE_PORT'));
}
bootstrap();
