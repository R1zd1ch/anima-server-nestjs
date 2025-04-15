import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ParseShikimoriService } from '../parsers/shikimori/parser-shikimori/parser-shikimori.service';
import { ProgressService } from '../parsers/progress/progress.service';

@Injectable()
export class UpdateJobsService {
  private readonly logger = new Logger(UpdateJobsService.name);
  private readonly TIME_TO_UPDATE_RUNNING_SESSION = 1000 * 60 * 60;

  public constructor(
    private readonly parseShikimoriService: ParseShikimoriService,
    private readonly progressService: ProgressService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateOngoings() {
    this.logger.log('START UPDATE ONGOINGS');
    await this.parseShikimoriService.startUpdateOngoings();
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async updateYearAnime() {
    this.logger.log('START UPDATE THIS YEAR ANIMES');
    await this.parseShikimoriService.startUpdateThisYear();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async runToCompletedSession() {
    this.logger.log('MARK AS COMPLETED OLD RUNNING PARSING SESSIONS');
    await this.progressService.markAsCompletedOldRunningSessions(
      this.getDate(this.TIME_TO_UPDATE_RUNNING_SESSION),
    );
  }

  private getDate(time: number) {
    return new Date(new Date().getTime() - time);
  }
}
