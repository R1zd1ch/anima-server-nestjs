import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getMicroservices } from './utils/get-microservices';
import { HttpService } from '@nestjs/axios';
import { SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  private readonly logger = new Logger(SwaggerService.name);
  private readonly httpService = new HttpService();
  public constructor(private readonly configService: ConfigService) {}
  private services = getMicroservices(this.configService);

  public async setup(app: INestApplication) {
    const docs = [];
    console.log(this.services);
    for (const service of this.services) {
      try {
        const res = await this.httpService.axiosRef.get(service.url);
        console.log(service.url);
        docs.push(res.data);
        this.logger.log(`Подключен к ${service.name}`);
      } catch {
        this.logger.warn(`Не удалось подключиться к ${service.name}`);
      }
    }
    const mergedDocument = this.mergeSwaggerDocs(docs);

    SwaggerModule.setup('docs', app, mergedDocument);
  }

  private mergeSwaggerDocs(docs: any[]) {
    const mergedDoc = {
      openapi: '3.0.0',
      info: {
        title: 'Anima API Documentation',
        description: 'API documentation for Anima',
        version: '1.0',
      },
      servers: [
        {
          url: `http://${this.configService.getOrThrow<string>('APPLICATION_HOST')}:${this.configService.getOrThrow<string>('APPLICATION_PORT')}/api`,
        },
      ],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {
          CookieAuth: {
            type: 'apiKey' as const,
            in: 'cookie' as const,
            name: this.configService.getOrThrow<string>('SESSION_NAME'),
          },
        },
        security: [
          {
            CookieAuth: [],
          },
        ],
      },
    };

    docs.forEach((doc) => {
      // Объединяем paths, если они есть
      if (doc.paths) {
        Object.assign(mergedDoc.paths, doc.paths);
      }

      // Объединяем schemas, если они есть
      if (doc.components && doc.components.schemas) {
        Object.assign(mergedDoc.components.schemas, doc.components.schemas);
      }
    });

    return mergedDoc;
  }
}
