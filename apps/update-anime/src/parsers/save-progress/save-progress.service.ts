import { Injectable } from '@nestjs/common';
import { ParsingSession, ParsingSessionStatus } from '@prisma/__generated__';
import { PrismaService } from 'shared/lib/prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prismaService: PrismaService) {}

  async initializeSession(parserName: string): Promise<ParsingSession> {
    const session = await this.prismaService.parsingSession.create({
      data: {
        name: parserName,
        status: ParsingSessionStatus.CREATED,
        lastProcessedPage: 0,
        processedPages: 0,
        processedItems: 0,
      },
    });

    return session;
  }

  async getLatestSession(): Promise<ParsingSession> {
    return this.prismaService.parsingSession.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  // TODO: чекнуть нужны ли все данные
  async getCurrentPage(sessionId: number): Promise<number> {
    const session = await this.prismaService.parsingSession.findUnique({
      where: {
        id: sessionId,
      },
    });

    return session.lastProcessedPage;
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
}
