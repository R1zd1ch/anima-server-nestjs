import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { ProgressResponseDto } from './dto/update-progress.dto';
import { ProgressUpdateDto } from './dto/response-progress.dto';
import { ProgressCreateDto } from './dto/create-progress.dto';

@Injectable()
export class WatchProgressService {
  private readonly logger = new Logger(WatchProgressService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  public async createProgress(
    userId: string,
    animeId: string,
    dto: ProgressCreateDto,
  ) {
    try {
      this.validateProgress(dto);
      return this.prismaService.animeEpisodeProgress.create({
        data: {
          userId: userId,
          episode: dto.episode,
          timestamp: dto.timestamp,
          isWatched: dto.isWatched,
          animeId: animeId,
        },
      });
    } catch {
      this.logger.log(`Failed to create progress for ${userId} and ${animeId}`);
      return null;
    }
  }

  public async getProgress(
    userId: string,
    animeId: string,
  ): Promise<ProgressResponseDto[] | []> {
    try {
      const progress = await this.prismaService.animeEpisodeProgress.findMany({
        where: {
          userId: userId,
          animeId: animeId,
        },
        select: {
          episode: true,
          timestamp: true,
          isWatched: true,
          updatedAt: true,
        },
      });

      if (!progress.length) return [];

      return progress;
    } catch {
      this.logger.log(`Failed to get progress for ${userId} and ${animeId}`);
      return [];
    }
  }
  public async updateTimeCodes(
    userId: string,
    animeId: string,

    dto: ProgressUpdateDto,
  ): Promise<ProgressResponseDto> {
    try {
      this.validateProgress(dto);

      return this.prismaService.animeEpisodeProgress.upsert({
        where: {
          userId_animeId_episode: {
            userId,
            animeId,
            episode: dto.episode,
          },
        },
        create: {
          episode: dto.episode,
          timestamp: dto.timestamp,
          isWatched: dto.isWatched,
          userId,
          animeId,
        },
        update: {
          timestamp: dto.timestamp,
          isWatched: dto.isWatched,
        },
      });
    } catch {
      this.logger.log(`Failed to update progress for ${userId} and ${animeId}`);
      return null;
    }
  }

  public async deleteProgress(userId: string, animeId: string) {
    try {
      const deleted = await this.prismaService.animeEpisodeProgress.deleteMany({
        where: {
          userId: userId,
          animeId: animeId,
        },
      });

      if (deleted.count === 0) {
        this.logger.log(
          `Failed to delete progress for ${userId} and ${animeId}`,
        );
      }

      return deleted;
    } catch {
      this.logger.log(`Failed to delete progress for ${userId} and ${animeId}`);
      return null;
    }
  }

  private validateProgress(dto: ProgressCreateDto | ProgressUpdateDto): void {
    if (dto.timestamp < 0) {
      throw new Error('Timestamp cannot be negative');
    }

    if (dto.episode <= 0) {
      throw new Error('Episode number must be positive');
    }
  }
}
