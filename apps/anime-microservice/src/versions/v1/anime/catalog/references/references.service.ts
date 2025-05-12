import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import {
  ageRatings,
  seasons,
  sortings,
  types,
  years,
} from 'apps/anime-microservice/src/constants';
import { handleError } from 'shared/lib/utils/handle-error';

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
      handleError(error, 'Ошибка при получении жанров', this.logger);
    }
  }

  public async getDemographics() {
    try {
      return this.prismaService.demographic.findMany();
    } catch (error) {
      handleError(error, 'Ошибка при получении демографий', this.logger);
    }
  }

  public async getThemes() {
    try {
      return this.prismaService.theme.findMany();
    } catch (error) {
      handleError(error, 'Ошибка при получении тем', this.logger);
    }
  }
  public async getRatings() {
    try {
      return new Promise((r) => r(ageRatings));
    } catch (error) {
      handleError(
        error,
        'Ошибка при получении возрастных рейтингов',
        this.logger,
      );
    }
  }

  public async getSeasons() {
    try {
      return new Promise((r) => r(seasons));
    } catch (error) {
      handleError(error, 'Ошибка при получении сезонов', this.logger);
    }
  }
  public async getSortings() {
    try {
      return new Promise((r) => r(sortings));
    } catch (error) {
      handleError(error, 'Ошибка при получении сортировок', this.logger);
    }
  }

  public async getTypes() {
    try {
      return new Promise((r) => r(types));
    } catch (error) {
      handleError(error, 'Ошибка при получении типов', this.logger);
    }
  }

  public async getYears() {
    try {
      return new Promise((r) => r(years));
    } catch (error) {
      handleError(error, 'Ошибка при получении годов', this.logger);
    }
  }
}
