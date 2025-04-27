import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import {
  ageRatings,
  seasons,
  sortings,
  types,
  years,
} from 'apps/anime-microservice/src/constants';

@Injectable()
export class ReferencesService {
  private readonly logger = new Logger(ReferencesService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  public async getRefernces() {
    const genres = await this.getGenres();
    const demographics = await this.getDemographics();
    const themes = await this.getThemes();
    const ratings = await this.getRatings();
    const seasons = await this.getSeasons();
    const sortings = await this.getSortings();
    const types = await this.getTypes();
    const years = await this.getYears();

    return {
      genres,
      demographics,
      themes,
      ratings,
      seasons,
      sortings,
      types,
      years,
    };
  }

  public async getGenres() {
    try {
      return this.prismaService.genre.findMany();
    } catch (error) {
      this.logger.log(`Ошибка получения жанров: ${error}`);
      return this.handleError('getGenres', error);
    }
  }

  public async getDemographics() {
    try {
      return this.prismaService.demographic.findMany();
    } catch (error) {
      this.logger.log(`Ошибка получения демографии: ${error}`);
      return this.handleError('getDemographics', error);
    }
  }

  public async getThemes() {
    try {
      return this.prismaService.theme.findMany();
    } catch (error) {
      this.logger.log(`Ошибка получения тем: ${error}`);
      return this.handleError('getThemes', error);
    }
  }
  public async getRatings() {
    try {
      return new Promise((r) => r(ageRatings));
    } catch (error) {
      this.logger.log(`Ошибка получения рейтингов: ${error}`);
      return this.handleError('getRatings', error);
    }
  }

  public async getSeasons() {
    try {
      return new Promise((r) => r(seasons));
    } catch (error) {
      this.logger.log(`Ошибка получения сезонов: ${error}`);
      return this.handleError('getSeasons', error);
    }
  }
  public async getSortings() {
    try {
      return new Promise((r) => r(sortings));
    } catch (error) {
      this.logger.log(`Ошибка получения сортировок: ${error}`);
      return this.handleError('getSortings', error);
    }
  }

  public async getTypes() {
    try {
      return new Promise((r) => r(types));
    } catch (error) {
      this.logger.log(`Ошибка получения типов: ${error}`);
      return this.handleError('getTypes', error);
    }
  }

  public async getYears() {
    try {
      return new Promise((r) => r(years));
    } catch (error) {
      this.logger.log(`Ошибка получения лет: ${error}`);
      return this.handleError('getYears', error);
    }
  }

  private handleError(method: string, error: any) {
    return {
      error: error instanceof Error ? error.message : 'unknown',
      method,
    };
  }
}
