import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { ProgressUpdateDto } from './dto/response-progress.dto';
import { handleError } from 'shared/lib/utils/handle-error';
import {
  getUserCacheKey,
  getUserCacheTTL,
  UserCacheKey,
  WATCH_PROGRESS_COMMON_INCLUDE,
} from 'apps/anime-microservice/src/constants';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class WatchProgressService {
  private readonly logger = new Logger(WatchProgressService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async updateProgress(
    userId: string,
    animeId: string,
    dto: ProgressUpdateDto,
  ) {
    try {
      const anime = await this.existsAnime(animeId);
      await this.existsUser(userId);

      if (dto.episode !== undefined) {
        await this.validateEpisode(animeId, dto.episode);
      }

      if (dto.episode >= anime.episodes) {
        dto.isWatched = true;
      }

      const singleCacheKey = getUserCacheKey(
        UserCacheKey.WATCH_PROGRESS,
        `${userId}-${animeId}`,
      );
      const cacheKey = getUserCacheKey(UserCacheKey.WATCH_PROGRESS, userId);

      const cachedData = await this.cacheManager.get<{
        any;
      }>(cacheKey);
      const singleCachedData = await this.cacheManager.get<{
        any;
      }>(singleCacheKey);
      if (cachedData) await this.cacheManager.del(cacheKey);
      if (singleCachedData) await this.cacheManager.del(singleCacheKey);

      const existingProgress =
        await this.prismaService.animeEpisodeProgress.findUnique({
          where: { userId_animeId: { userId, animeId } },
        });

      if (existingProgress) {
        const result = await this.prismaService.animeEpisodeProgress.update({
          where: { userId_animeId: { userId, animeId } },
          include: WATCH_PROGRESS_COMMON_INCLUDE,
          data: { ...dto, updatedAt: new Date() },
        });
        return {
          data: { ...result },
        };
      }

      const result = await this.prismaService.animeEpisodeProgress.create({
        data: {
          userId,
          animeId,
          timestamp: dto.timestamp ?? 0,
          episode: dto.episode ?? 0,
          isWatched: dto.isWatched ?? false,
        },
        include: WATCH_PROGRESS_COMMON_INCLUDE,
      });

      return result;
    } catch (e) {
      handleError(
        e,
        'Ошибка при создании или обновлении прогресса',
        this.logger,
      );
    }
  }

  public async getUserProgress(userId: string, viewerId?: string, limit = 20) {
    try {
      const access = await this.checkAccess(viewerId, userId);
      if (access?.data) return access;

      const cacheKey = getUserCacheKey(UserCacheKey.WATCH_PROGRESS, userId);

      const cachedData = await this.cacheManager.get<{
        any;
      }>(cacheKey);
      if (cachedData) return cachedData;

      const response = await this.prismaService.animeEpisodeProgress.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: WATCH_PROGRESS_COMMON_INCLUDE,
        take: limit,
      });

      await this.cacheManager.set(
        cacheKey,
        response,
        getUserCacheTTL(UserCacheKey.WATCH_PROGRESS),
      );

      return response;
    } catch (e) {
      handleError(
        e,
        'Ошибка при получении недавнего прогресса пользователя',
        this.logger,
      );
    }
  }

  public async markWatched(userId: string, animeId: string) {
    try {
      const anime = await this.existsAnime(animeId);
      await this.existsUser(userId);
      const singleCacheKey = getUserCacheKey(
        UserCacheKey.WATCH_PROGRESS,
        `${userId}-${animeId}`,
      );
      const cacheKey = getUserCacheKey(UserCacheKey.WATCH_PROGRESS, userId);
      const cachedData = await this.cacheManager.get<{
        any;
      }>(cacheKey);
      if (cachedData) await this.cacheManager.del(cacheKey);
      if (cachedData) await this.cacheManager.del(singleCacheKey);

      const response = await this.prismaService.animeEpisodeProgress.update({
        where: { userId_animeId: { userId, animeId } },
        data: {
          isWatched: true,
          episode: anime.episodesAired || anime.episodes,
        },
      });

      return response;
    } catch (e) {
      handleError(e, 'Ошибка при отметке аниме как просмотренное', this.logger);
    }
  }

  public async getProgressForAnime(userId: string, animeId: string) {
    try {
      await Promise.all([this.existsUser(userId), this.existsAnime(animeId)]);
      const cacheKey = getUserCacheKey(
        UserCacheKey.WATCH_PROGRESS,
        `${userId}-${animeId}`,
      );
      const cachedData = await this.cacheManager.get<{
        any;
      }>(cacheKey);

      if (cachedData) return cachedData;

      const response = await this.prismaService.animeEpisodeProgress.findUnique(
        {
          where: { userId_animeId: { userId, animeId } },
          include: WATCH_PROGRESS_COMMON_INCLUDE,
        },
      );

      await this.cacheManager.set(
        cacheKey,
        response,
        getUserCacheTTL(UserCacheKey.WATCH_PROGRESS),
      );

      return response;
    } catch (e) {
      handleError(e, 'Ошибка при получении прогресса по аниме', this.logger);
    }
  }

  public async deleteProgress(userId: string, animeId: string) {
    try {
      await Promise.all([this.existsUser(userId), this.existsAnime(animeId)]);

      const singleCacheKey = getUserCacheKey(
        UserCacheKey.WATCH_PROGRESS,
        `${userId}-${animeId}`,
      );
      const cacheKey = getUserCacheKey(UserCacheKey.WATCH_PROGRESS, userId);
      const cachedData = await this.cacheManager.get<{
        any;
      }>(cacheKey);
      if (cachedData) await this.cacheManager.del(cacheKey);
      if (cachedData) await this.cacheManager.del(singleCacheKey);

      const progress = await this.prismaService.animeEpisodeProgress.findUnique(
        { where: { userId_animeId: { userId, animeId } } },
      );

      if (!progress) throw new NotFoundException('Прогресса не было');

      return this.prismaService.animeEpisodeProgress.delete({
        where: { userId_animeId: { userId, animeId } },
      });
    } catch (e) {
      handleError(e, 'Ошибка при удалении прогресса', this.logger);
    }
  }

  private async checkAccess(viewerId: string | null, userId: string) {
    const isOwner = viewerId && viewerId === userId;
    if (!isOwner) {
      const targetUser = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { settings: { select: { showLatestWatched: true } } },
      });
      if (!targetUser) throw new NotFoundException('Пользователь не найден');

      if (!targetUser?.settings?.showLatestWatched) {
        return {
          data: [],
        };
      }
    }
  }

  private async existsUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  private async existsAnime(animeId: string) {
    const anime = await this.prismaService.anime.findUnique({
      where: { id: animeId },
    });
    if (!anime) throw new NotFoundException('Аниме не найдено');
    return anime;
  }

  private async validateEpisode(animeId: string, episode: number) {
    const anime = await this.prismaService.anime.findUnique({
      where: { id: animeId },
      select: { episodes: true },
    });

    if (episode > anime.episodes) {
      throw new BadRequestException('Эпизод превышает общее количество');
    }
  }
}
