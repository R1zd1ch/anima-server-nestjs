import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

interface RabbitMQModuleOptions {
  name: string;
  queue: string;
}

@Global()
@Module({})
export class RabbitMQModule {
  static forRoot(options: RabbitMQModuleOptions): DynamicModule {
    const clientModule = ClientsModule.registerAsync([
      {
        name: options.name,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBIT_MQ_URI')],
            queue: options.queue,
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]);

    return {
      module: RabbitMQModule,
      imports: [ConfigModule, clientModule],
      exports: [clientModule],
    };
  }
}
