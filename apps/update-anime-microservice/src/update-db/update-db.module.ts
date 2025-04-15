import { Module } from '@nestjs/common';
import { UpdateDbService } from './update-db.service';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UpdateDbService],
  exports: [UpdateDbService],
})
export class UpdateDbModule {}
