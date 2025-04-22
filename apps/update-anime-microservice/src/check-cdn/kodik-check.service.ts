import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Client } from 'kodikwrapper';

type Task = {
  shikimoriId: number;
  resolve: (value: boolean) => void;
  reject: (reason?: any) => void;
};

@Injectable()
export class KodikCheckService implements OnModuleInit {
  private readonly logger = new Logger(KodikCheckService.name);
  private client: Client;
  private queue: Task[] = [];
  private isProcessing = false;
  private readonly delay = 200;

  constructor(private readonly httpService: HttpService) {}

  async onModuleInit() {
    this.client = new Client({ token: await this.getToken() });
    this.logger.log('KodikCheckService initialized');
  }

  async getToken() {
    const scriptUrl = 'https://kodik-add.com/add-players.min.js?v=2';
    const data = await this.httpService.axiosRef.get(scriptUrl);
    const responseData = data.data as string;
    const tokenIndex = responseData.indexOf('token=') + 7;
    const tokenSubstring = responseData.substring(tokenIndex);
    const token = tokenSubstring.split('"')[0];
    return token;
  }

  public checkByShikimoriId(shikimoriId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.queue.push({ shikimoriId, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { shikimoriId, resolve } = this.queue.shift();

    try {
      const response = await this.client.search({
        shikimori_id: shikimoriId,
        limit: 1,
      });

      const result = response.results.shift();

      if (result) {
        this.logger.log(`✅ Найдено на Kodik: Shikimori ID ${shikimoriId}`);
        resolve(true);
      } else {
        this.logger.warn(`⚠️ Не найдено на Kodik: Shikimori ID ${shikimoriId}`);
        resolve(false);
      }
    } catch {
      this.logger.error(
        `🔥 Ошибка при поиске Kodik для Shikimori ID ${shikimoriId}`,
      );
      resolve(false);
    }

    setTimeout(() => {
      this.isProcessing = false;
      this.processQueue();
    }, this.delay);
  }
}
