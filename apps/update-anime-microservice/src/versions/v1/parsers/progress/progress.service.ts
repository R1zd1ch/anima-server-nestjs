import { Injectable, Logger } from '@nestjs/common';
import {
  ParsingSession,
  ParsingSessionStatus,
  ParsingSessionType,
} from '@prisma/__generated__';
import { PrismaService } from 'shared/lib/prisma/prisma.service';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async initializeSession(
    parserName: string,
    type: ParsingSessionType,
  ): Promise<ParsingSession> {
    try {
      const session = await this.prismaService.parsingSession.create({
        data: {
          name: parserName,
          status: ParsingSessionStatus.CREATED,
          type,
          lastProcessedPage: 0,
          processedPages: 0,
          processedItems: 0,
        },
      });

      this.logger.log('Сессия парсинга инициализирована');
      return session;
    } catch (e) {
      this.logger.error(
        'Ошибка инициализации сессии парсинга',
        e instanceof Error ? e.stack : undefined,
      );
      throw new Error('Ошибка инициализации сессии парсинга');
    }
  }

  async getLatestSession(type: ParsingSessionType): Promise<ParsingSession> {
    try {
      return this.prismaService.parsingSession.findFirst({
        where: { type },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      this.logger.error(
        'Ошибка получения последней сессии парсинга',
        e instanceof Error ? e.stack : undefined,
      );
      throw new Error('Ошибка получения последней сессии парсинга');
    }
  }
  async getCurrentPage(sessionId: number): Promise<number> {
    try {
      const session = await this.prismaService.parsingSession.findUnique({
        where: {
          id: sessionId,
        },
      });

      return session.lastProcessedPage;
    } catch (e) {
      this.logger.error(
        'Ошибка получения текущей страницы парсинга',
        e instanceof Error ? e.stack : undefined,
      );
      throw new Error('Ошибка получения текущей страницы парсинга');
    }
  }

  async getSessionStatus(sessionId: number): Promise<ParsingSessionStatus> {
    try {
      const session = await this.prismaService.parsingSession.findUnique({
        where: {
          id: sessionId,
        },
      });
      if (!session) throw new Error('Сессия парсинга не найдена');

      return session.status as ParsingSessionStatus;
    } catch (e) {
      this.logger.error(
        'Ошибка получения статуса сессии парсинга',
        e instanceof Error ? e.stack : undefined,
      );
      throw new Error('Ошибка получения статуса сессии парсинга');
    }
  }

  async getCurrentStatus(name: string) {
    const session = await this.prismaService.parsingSession.findFirst({
      where: {
        name: name.toLocaleUpperCase(),
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!session) {
      return null;
    }

    return {
      status: session.status,
      lastProcessedPage: session.lastProcessedPage,
      processedPages: session.processedPages,
      processedItems: session.processedItems,
      started: session.createdAt,
    };
  }

  async updateProgress(
    sessionId: number,
    currentPage: number,
    itemsCount: number,
  ) {
    await this.prismaService.parsingSession.update({
      where: { id: sessionId },
      data: {
        lastProcessedPage: currentPage,
        processedPages: { increment: 1 },
        processedItems: { increment: itemsCount },
      },
    });
  }

  async updateStatus(sessionId: number, status: ParsingSessionStatus) {
    await this.prismaService.parsingSession.update({
      where: { id: sessionId },
      data: { status },
    });
  }

  async completeSession(sessionId: number): Promise<void> {
    await this.prismaService.parsingSession.update({
      where: { id: sessionId },
      data: { status: ParsingSessionStatus.COMPLETED },
    });
  }

  async markAsCompletedOldRunningSessions(time: Date) {
    await this.prismaService.parsingSession.updateMany({
      where: {
        status: ParsingSessionStatus.RUNNING,
        updatedAt: {
          lt: time,
        },
      },
      data: {
        status: ParsingSessionStatus.COMPLETED,
      },
    });
  }
}
