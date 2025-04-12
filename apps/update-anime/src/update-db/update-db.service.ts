import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Anime } from '@prisma/__generated__';
import { PrismaService } from 'shared/lib/prisma/prisma.service';

@Injectable()
export class UpdateDbService {
  private readonly logger = new Logger(UpdateDbService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async upsertAnimes(
    animes: Omit<Anime, 'created_at' | 'updated_at'>[],
  ): Promise<Anime[]> {
    if (!animes.length) return;

    const transactions = animes.map((anime) =>
      this.prismaService.anime.upsert({
        where: { id: anime.id },
        create: anime,
        update: anime,
      }),
    );

    const result = await this.prismaService.$transaction(transactions);
    const savedCount = result.length;
    this.logger.debug(
      `Успешно сохранено ${savedCount} из ${animes.length} аниме`,
    );
  }
}
