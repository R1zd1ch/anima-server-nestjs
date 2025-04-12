import { Module } from '@nestjs/common';
import { ParseShikimoriService } from './parser-shikimori.service';
import { ParseShikimoriController } from './parser-shikimori.controller';
import { ShikimoriModule } from '../shikimori-api/shikimori.module';
import { ProgressModule } from '../../save-progress/save-progress.module';
import { UpdateDbModule } from 'apps/update-anime/src/update-db/update-db.module';

@Module({
  imports: [ShikimoriModule, ProgressModule, UpdateDbModule],
  controllers: [ParseShikimoriController],
  providers: [ParseShikimoriService],
})
export class ParseShikimoriModule {}
