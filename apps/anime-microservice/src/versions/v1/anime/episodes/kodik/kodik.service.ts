import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Client, SearchResponse } from 'kodikwrapper';

@Injectable()
export class KodikService implements OnModuleInit {
  private readonly logger = new Logger(KodikService.name);
  private client: Client;

  public constructor(private readonly httpService: HttpService) {}

  async onModuleInit() {
    this.client = Client.fromToken(await this.getToken());
  }

  public async getEpisodesByShikimoriId(shikimoriId: number) {
    try {
      const response = await this.client.search({
        shikimori_id: shikimoriId,
        with_episodes: true,
        with_episodes_data: true,
        with_page_links: true,
        with_material_data: true,
      });

      return this.normalizeResponse(response);
    } catch (e) {
      this.logger.error(
        `Ошибка получения эпизодов с Kodik ${e instanceof Error ? e.stack : e}`,
      );
      return null;
    }
  }

  private normalizeResponse(response: SearchResponse) {
    const mainData = {
      russian: response.results[0].title,
      name: response.results[0].title_orig,
      year: response.results[0].year,
      shikimoriId: response.results[0].shikimori_id.toString(),
      episodesCount: response.results[0].episodes_count,
    };

    const translations = response.results.map((result) => {
      const seasonsMap = new Map<
        number,
        {
          number: number;
          link: string;
          screenshots: string[];
        }[]
      >();

      if (result.seasons) {
        for (const [seasonStr, seasonData] of Object.entries(result.seasons)) {
          const season = parseInt(seasonStr, 10);

          for (const [episodeStr, episodeData] of Object.entries(
            seasonData.episodes,
          )) {
            const episode = {
              number: parseInt(episodeStr, 10),
              link:
                typeof episodeData.link === 'function'
                  ? episodeData.link('')
                  : episodeData.link,
              screenshots:
                typeof episodeData !== 'string'
                  ? episodeData.screenshots || []
                  : [],
            };

            if (!seasonsMap.has(season)) {
              seasonsMap.set(season, []);
            }

            seasonsMap.get(season)?.push(episode);
          }
        }
      }

      const seasons = Array.from(seasonsMap.entries())
        .map(([season, episodes]) => ({
          season,
          episodes: episodes.sort((a, b) => a.number - b.number),
        }))
        .sort((a, b) => a.season - b.season);

      return {
        translation: result.translation as {
          id: number;
          title: string;
          type: string;
        },
        lastEpisode: result.last_episode,
        seasons,
      };
    });

    return {
      ...mainData,
      translations,
    };
  }

  private async getToken() {
    const scriptUrl = 'https://kodik-add.com/add-players.min.js?v=2';
    const data = await this.httpService.axiosRef.get(scriptUrl);
    const responseData = data.data as string;
    const tokenIndex = responseData.indexOf('token=') + 7;
    const tokenSubstring = responseData.substring(tokenIndex);
    const token = tokenSubstring.split('"')[0];
    return token;
  }
}
