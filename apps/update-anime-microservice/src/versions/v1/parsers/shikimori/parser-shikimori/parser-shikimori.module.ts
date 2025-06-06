import { Module } from '@nestjs/common';
import { ParseShikimoriService } from './parser-shikimori.service';
import { ParseShikimoriController } from './parser-shikimori.controller';
import { ShikimoriModule } from '../shikimori-api/shikimori.module';
import { ProgressModule } from '../../progress/progress.module';
import { UpdateDbModule } from '../../../update-db/update-db.module';
import { CheckCdnModule } from '../../../check-cdn/check-cdn.module';

@Module({
  imports: [ShikimoriModule, ProgressModule, UpdateDbModule, CheckCdnModule],
  controllers: [ParseShikimoriController],
  providers: [ParseShikimoriService],
  exports: [ParseShikimoriService],
})
export class ParseShikimoriModule {}
