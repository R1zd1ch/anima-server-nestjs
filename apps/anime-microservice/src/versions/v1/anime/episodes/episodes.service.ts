import { Injectable, Logger } from '@nestjs/common';
import { KodikService } from './kodik/kodik.service';
import { AnilibriaService } from './anilibria/anilibiria.service';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { shikimoriScoreNotNull } from 'apps/anime-microservice/src/constants';

@Injectable()
export class EpisodesService {
  private readonly logger = new Logger(EpisodesService.name);
  public constructor(
    private readonly kodikService: KodikService,
    private readonly anilibriaService: AnilibriaService,
    private readonly prismaService: PrismaService,
  ) {}

  async getEpisodes(alias: string, shikimoriId: number) {
    try {
      let formattedAlias: string | null = alias;
      let formattedShikimoriId: string | null = shikimoriId
        ? shikimoriId.toString()
        : null;

      if (!alias && !shikimoriId) return { kodik: [], anilibiria: [] };

      if (!shikimoriId) {
        const animeByAlias = await this.prismaService.anime.findFirst({
          where: { alias, ...shikimoriScoreNotNull },
          select: { shikimoriId: true },
        });
        if (!animeByAlias) {
          return { kodik: [], anilibiria: [] };
        }
        formattedShikimoriId = animeByAlias.shikimoriId;
      }

      if (!alias) {
        const animeByShikiId = await this.prismaService.anime.findFirst({
          where: {
            shikimoriId: shikimoriId.toString(),
            ...shikimoriScoreNotNull,
          },
          select: { alias: true },
        });
        if (!animeByShikiId) {
          return { kodik: [], anilibiria: [] };
        }
        formattedAlias = animeByShikiId.alias;
      }

      if (!formattedAlias && !formattedShikimoriId)
        return { kodik: [], anilibiria: [] };

      const kodik = await this.kodikService.getEpisodesByShikimoriId(
        Number(formattedShikimoriId || 0),
      );
      const anilibiria = await this.anilibriaService.getEpisodesByAlias(
        formattedAlias,
        Number(formattedShikimoriId || 0),
      );
      return { ...kodik, anilibiria };
    } catch (e) {
      this.logger.error(
        `Ошибка получения эпизодов: ${e instanceof Error ? e.stack : e}`,
      );
      return { kodik: [], anilibiria: [] };
    }
  }
}
