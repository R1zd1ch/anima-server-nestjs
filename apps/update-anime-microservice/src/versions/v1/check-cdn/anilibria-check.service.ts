import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AxiosError } from 'axios';

type Task = {
  alias: string;
  resolve: (value: boolean) => void;
  reject: (reason?: any) => void;
};

@Injectable()
export class AnilibriaCheckService implements OnModuleInit {
  private readonly logger = new Logger(AnilibriaCheckService.name);
  private readonly baseUrl = 'https://anilibria.top/api';
  private readonly delay = 200; //
  private queue: Task[] = [];
  private isProcessing = false;

  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.logger.log('AnilibriaCheckService initialized');
  }

  public checkByAlias(alias: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.queue.push({ alias, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { alias, resolve } = this.queue.shift();

    try {
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/anime/releases/${alias}`,
      );

      if (response.status === 200) {
        this.logger.log(`✅ Найдено на Anilibria: ${alias}`);
        resolve(true);
      } else {
        this.logger.warn(
          `❌ Не найдено на Anilibria: ${alias}, статус: ${response.status}`,
        );
        resolve(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const message = axiosError.message;

      if (status === 404) {
        this.logger.warn(`⚠️ Не найдено на Anilibria: ${alias} (404)`);
      } else {
        this.logger.error(`🔥 Ошибка при проверке ${alias}: ${message}`);
      }

      resolve(false);
    }

    setTimeout(() => {
      this.isProcessing = false;
      this.processQueue();
    }, this.delay);
  }
}
