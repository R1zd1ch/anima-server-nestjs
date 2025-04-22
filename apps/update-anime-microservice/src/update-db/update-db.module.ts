import { Module } from '@nestjs/common';
import { UpdateDbService } from './update-db.service';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { CheckCdnModule } from '../check-cdn/check-cdn.module';

@Module({
  imports: [PrismaModule, CheckCdnModule],
  providers: [UpdateDbService],
  exports: [UpdateDbService],
})
export class UpdateDbModule {}
