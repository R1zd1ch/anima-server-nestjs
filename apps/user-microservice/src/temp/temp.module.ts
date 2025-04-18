import { Module } from '@nestjs/common';
import { TempService } from './temp.service';
import { TempController } from './temp.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UPDATE_ANIME',
        transport: Transport.TCP,
        options: {
          host: process.env.APPLICATION_UPDATE_ANIME_URL,
          port: Number(process.env.APPLICATION_UPDATE_ANIME_TCP_PORT),
        },
      },
    ]),
  ],
  controllers: [TempController],
  providers: [TempService],
})
export class TempModule {}
