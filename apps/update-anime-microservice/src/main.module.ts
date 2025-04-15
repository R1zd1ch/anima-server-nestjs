import { Module } from '@nestjs/common';
import { UpdateAnimeController } from './main.controller';
import { UpdateAnimeService } from './main.service';
import { ConfigModule } from '@nestjs/config';
import { ParseShikimoriModule } from './parsers/shikimori/parser-shikimori/parser-shikimori.module';
import { UpdateDbModule } from './update-db/update-db.module';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { ShikimoriModule } from './parsers/shikimori/shikimori-api/shikimori.module';
import { ProgressModule } from './parsers/progress/progress.module';
import { UpdateJobsModule } from './update-jobs/update-jobs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ParseShikimoriModule,
    UpdateDbModule,
    PrismaModule,
    ShikimoriModule,
    ProgressModule,
    UpdateJobsModule,
  ],
  controllers: [UpdateAnimeController],
  providers: [UpdateAnimeService],
})
export class UpdateAnimeModule {}
