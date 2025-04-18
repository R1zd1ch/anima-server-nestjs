import { Module } from '@nestjs/common';
import { ParseShikimoriService } from './parser-shikimori.service';
import { ParseShikimoriController } from './parser-shikimori.controller';
import { ShikimoriModule } from '../shikimori-api/shikimori.module';
import { ProgressModule } from '../../progress/progress.module';
import { UpdateDbModule } from 'apps/update-anime-microservice/src/update-db/update-db.module';

@Module({
  imports: [ShikimoriModule, ProgressModule, UpdateDbModule],
  controllers: [ParseShikimoriController],
  providers: [ParseShikimoriService],
  exports: [ParseShikimoriService],
})
export class ParseShikimoriModule {}
