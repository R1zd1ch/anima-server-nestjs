import { NestFactory } from '@nestjs/core';
import { UpdateAnimeModule } from './main.module';
// import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
// import { isDev } from 'shared/lib/utils/is-dev.util';

async function bootstrap() {
  const logger = new Logger('UpdateAnimeMicroservice');

  // const app_tcp = await NestFactory.createMicroservice(UpdateAnimeModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     name: 'UPDATE_ANIME',
  //     host: isDev ? 'localhost' : process.env.APPLICATION_UPDATE_ANIME_URL,
  //     port: Number(process.env.APPLICATION_UPDATE_ANIME_TCP_PORT),
  //   },
  // });

  const app_http = await NestFactory.create(UpdateAnimeModule);
  const config = app_http.get(ConfigService);

  // await app_tcp.listen();
  await app_http.listen(config.get('APPLICATION_UPDATE_ANIME_PORT'));

  logger.log(
    `UpdateAnimeMicroservice is listening on port ${config.get(
      'APPLICATION_UPDATE_ANIME_PORT',
    )}`,
  );
  logger.log(
    `UpdateAnimeMicroservice is listening on tcp port ${process.env.APPLICATION_UPDATE_ANIME_TCP_PORT}`,
  );
}
bootstrap();
