import { Module } from '@nestjs/common';
import { UpdateDbService } from './update-db.service';
import { UpdateDbController } from './update-db.controller';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [UpdateDbController],
  providers: [UpdateDbService],
  exports: [UpdateDbService],
})
export class UpdateDbModule {}
