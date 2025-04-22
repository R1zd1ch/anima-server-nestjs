import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnimeFromShikimori } from './dto/anime.dto';
import { animeFields } from './graphql-fields';
import SearchAnimeParamsDto from './dto/search-anime-params.dto';

@Injectable()
export class ShikimoriService {
  private readonly logger = new Logger(ShikimoriService.name);
  private readonly baseURL: string;
  private requestQueue: Promise<void> = Promise.resolve();
  private requestTimestamps: number[] = [];

  private readonly RPS_LIMIT = 5;
  private readonly RPM_LIMIT = 90;
  private readonly REQUEST_INTERVAL = 1000 / 5;

  public constructor(private readonly httpService: HttpService) {
    const configService = new ConfigService();
    this.baseURL = configService.getOrThrow<string>('SHIKIMORI_BASE_URL');
  }

  public async getAnimeById(id: string): Promise<AnimeFromShikimori> {
    return this.queueRequest<AnimeFromShikimori>(async () => {
      try {
        const response = await this.httpService.axiosRef.post<{
          data: {
            animes: AnimeFromShikimori[];
          };
        }>(`${this.baseURL}/graphql`, {
          query: `
              query {
                animes(ids: "${id}") {
                  ${animeFields}
                }
              }
            `,
        });

        return response.data.data.animes[0];
      } catch {
        this.logger.error(`Ошибка получения аниме ${id}`);
        throw new Error(`Ошибка получения аниме ${id}`);
      }
    });
  }

  public async getAnimeList(
    params: SearchAnimeParamsDto,
  ): Promise<AnimeFromShikimori[]> {
    return this.queueRequest<AnimeFromShikimori[]>(async () => {
      try {
        const response = await this.httpService.axiosRef.post<{
          data: {
            animes: AnimeFromShikimori[];
          };
        }>(`${this.baseURL}/graphql`, {
          query: `
          query {
            animes(
              limit: ${params.limit}, 
              page: ${params.page}, 
              order: ${params.order ? `"${params.order}"` : `null`}, 
              kind: ${params.kind ? `"${params.kind}"` : `null`}, 
              status: ${params.status ? `"${params.status}"` : `null`},
              season: ${params.season ? `"${params.season}"` : `"1995_2025"`}
            ) {
              ${animeFields}
            }
          }
        `,
        });

        return response.data.data.animes;
      } catch (error) {
        this.logger.error('Ошибка получения чанка аниме');
        throw error;
      }
    });
  }

  private async queueRequest<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue = this.requestQueue
        .then(async () => {
          await this.checkLimits();
          return fn().then(resolve).catch(reject);
        })
        .catch(reject);
    });
  }

  private async checkLimits(): Promise<void> {
    const now = Date.now();

    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < 60000,
    );

    if (this.requestTimestamps.length >= this.RPM_LIMIT) {
      const oldest = this.requestTimestamps[0];
      const waitTime = 60000 - (now - oldest);
      await this.delay(waitTime);
      return this.checkLimits();
    }

    const lastSecondRequests = this.requestTimestamps.filter(
      (ts) => now - ts < 1000,
    );

    if (lastSecondRequests.length >= this.RPS_LIMIT) {
      await this.delay(1000 - (now - lastSecondRequests[0]));
      return this.checkLimits();
    }

    await this.delay(this.REQUEST_INTERVAL);
    this.requestTimestamps.push(Date.now());
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
