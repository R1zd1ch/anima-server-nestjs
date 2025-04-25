import { ConfigService } from '@nestjs/config';
import { getMicroserviceUrl } from './get-microservice-url';

export const getMicroservices = (configService: ConfigService) => [
  {
    name: 'user-microservice',
    url: getMicroserviceUrl(
      'USER_MICROSERVICE_HOST',
      'USER_MICROSERVICE_PORT',
      configService,
    ),
  },
  {
    name: 'auth-microservice',
    url: getMicroserviceUrl(
      'AUTH_MICROSERVICE_HOST',
      'AUTH_MICROSERVICE_PORT',
      configService,
    ),
  },
  {
    name: 'update-anime-microservice',
    url: getMicroserviceUrl(
      'UPDATE_ANIME_MICROSERVICE_HOST',
      'UPDATE_ANIME_MICROSERVICE_PORT',
      configService,
    ),
  },
  {
    name: 'anime-microservice',
    url: getMicroserviceUrl(
      'ANIME_MICROSERVICE_HOST',
      'ANIME_MICROSERVICE_PORT',
      configService,
    ),
  },
];
