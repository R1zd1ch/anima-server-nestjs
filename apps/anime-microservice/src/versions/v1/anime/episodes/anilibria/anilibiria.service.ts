import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { AnilibriaNormalizedDto } from './dto/anilibria-normalized-response.dto';
import { AnimeData } from './type/anime-data';

@Injectable()
export class AnilibriaService {
  private readonly logger = new Logger(AnilibriaService.name);
  private baseUrl = 'https://anilibria.top/api/v1';

  public constructor(private readonly httpService: HttpService) {}

  public async getEpisodesByAlias(alias: string, shikimoriId: number) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/anime/releases/${alias}`,
      );

      return this.normalizeResponse(response.data as AnimeData, shikimoriId);
    } catch (e) {
      if (
        e instanceof Error &&
        'response' in e &&
        (e.response as { status?: number })?.status === 404
      ) {
        this.logger.warn(`⚠️ Не найдено на Anilibria: ${alias} (404)`);
        return null;
      }
      this.logger.error(
        `Ошибка получения эпизодов с Anilibria: ${e instanceof Error ? e.stack : e}`,
      );
      return null;
    }
  }

  private async normalizeResponse(data: AnimeData, shikimoriId: number) {
    const mainData = {
      russian: data.name.main,
      name: data.name.english,
      year: data.year,
      shikimoriId: shikimoriId.toString(),
      episodesCount: data.episodes_total,
      translations: [
        {
          translation: { title: 'Anilibria', type: 'voice' },
          lastEpisode: data.episodes.length,
          seasons: [
            {
              season: 1,
              episodes: data.episodes.map((ep, index) => ({
                id: ep.id?.toString() ?? String(index),
                name: ep.name ?? `Episode ${index + 1}`,
                ordinal:
                  'episode' in ep && typeof ep.episode === 'number'
                    ? ep.episode
                    : index + 1,
                opening: { start: null, stop: null },
                ending: { start: null, stop: null },
                preview: {
                  src: null,
                  thumbnail: null,
                  optimized: { src: null, thumbnail: null, optimized: null },
                },
                hls_480: null,
                hls_720: null,
                hls_1080: null,
                duration: 0,
                rutube_id: null,
                youtube_id: null,
                updated_at: new Date().toISOString(),
                sort_order: index,
                name_english: null,
              })),
            },
          ],
        },
      ],
    };

    const dtoInstance = plainToInstance(AnilibriaNormalizedDto, mainData);

    try {
      await validateOrReject(dtoInstance);
    } catch (errors) {
      this.logger.error('Ошибка валидации DTO', errors);
      throw new Error('Invalid Anilibria response structure');
    }

    return dtoInstance;
  }
}
