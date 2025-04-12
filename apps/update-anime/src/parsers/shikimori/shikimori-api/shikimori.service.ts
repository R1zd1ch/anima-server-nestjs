import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShikimoriAnime } from './dto/anime-id.dto';

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

  public async getAnimeById(id: number): Promise<ShikimoriAnime> {
    return this.queueRequest<ShikimoriAnime>(async () => {
      try {
        const { data }: { data: ShikimoriAnime } =
          await this.httpService.axiosRef.get(`${this.baseURL}/animes/${id}`);
        return data;
      } catch {
        this.logger.error(`Ошибка получения аниме ${id}`);
        throw new Error(`Ошибка получения аниме ${id}`);
      }
    });
  }

  public async getAnimeList(params: {
    page?: number;
    limit?: number;
    order?: string;
    kind?: string;
    status?: string;
    season?: string;
    genre?: number[];
  }): Promise<ShikimoriAnime[]> {
    return this.queueRequest<ShikimoriAnime[]>(async () => {
      try {
        const { data }: { data: ShikimoriAnime[] } =
          await this.httpService.axiosRef.get(`${this.baseURL}/animes`, {
            params,
          });
        return data;
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
