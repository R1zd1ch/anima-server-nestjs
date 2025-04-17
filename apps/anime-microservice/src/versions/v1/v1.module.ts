import { Module } from '@nestjs/common';
import { AnimeModule } from './anime/anime.module';
import { CatalogModule } from './anime/catalog/catalog.module';

@Module({
  imports: [AnimeModule, CatalogModule],
})
export class V1Module {}
