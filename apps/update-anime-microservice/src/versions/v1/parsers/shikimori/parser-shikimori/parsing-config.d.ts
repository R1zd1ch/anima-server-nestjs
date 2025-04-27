import { ParsingSessionType } from '@prisma/__generated__';
import SearchAnimeParamsDto from '../shikimori-api/dto/search-anime-params.dto';

export type ParsingConfig = {
  type: ParsingSessionType;
  searchParams: SearchAnimeParamsDto;
  successMessage: string;
};
