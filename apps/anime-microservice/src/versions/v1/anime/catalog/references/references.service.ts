import { Injectable } from '@nestjs/common';
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
    return this.prismaService.genre.findMany();
  }

  public async getDemographics() {
    return this.prismaService.demographic.findMany();
  }

  public async getThemes() {
    return this.prismaService.theme.findMany();
  }
  public async getRatings() {
    return new Promise((r) => r(ageRatings));
  }

  public async getSeasons() {
    return new Promise((r) => r(seasons));
  }
  public async getSortings() {
    return new Promise((r) => r(sortings));
  }

  public async getTypes() {
    return new Promise((r) => r(types));
  }

  public async getYears() {
    return new Promise((r) => r(years));
  }
}
