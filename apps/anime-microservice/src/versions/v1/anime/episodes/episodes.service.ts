import { Injectable } from '@nestjs/common';
import { KodikService } from './kodik/kodik.service';
import { AnilibriaService } from './anilibria/anilibiria.service';

@Injectable()
export class EpisodesService {
  public constructor(
    private readonly kodikService: KodikService,
    private readonly anilibriaService: AnilibriaService,
  ) {}

  async getEpisodes(alias: string, shikimoriId: number) {
    const kodik = await this.kodikService.getEpisodesByShikimoriId(shikimoriId);
    const anilibiria = await this.anilibriaService.getEpisodesByAlias(
      alias,
      shikimoriId,
    );
    return {
      kodik,
      anilibiria,
    };
  }
}
