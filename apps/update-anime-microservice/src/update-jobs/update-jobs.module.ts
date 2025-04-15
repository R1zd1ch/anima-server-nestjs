import { Module } from '@nestjs/common';
import { UpdateJobsService } from './update-jobs.service';
import { ParseShikimoriModule } from '../parsers/shikimori/parser-shikimori/parser-shikimori.module';
import { ProgressModule } from '../parsers/progress/progress.module';
import { ParseShikimoriService } from '../parsers/shikimori/parser-shikimori/parser-shikimori.service';

@Module({
  imports: [ParseShikimoriModule, ProgressModule],
  providers: [UpdateJobsService],
})
export class UpdateJobsModule {}
