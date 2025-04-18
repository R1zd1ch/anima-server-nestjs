
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AnimeScalarFieldEnum = {
  id: 'id',
  alias: 'alias',
  malId: 'malId',
  shikimoriId: 'shikimoriId',
  name: 'name',
  description: 'description',
  russian: 'russian',
  english: 'english',
  japanese: 'japanese',
  synonyms: 'synonyms',
  status: 'status',
  kind: 'kind',
  episodes: 'episodes',
  episodesAired: 'episodesAired',
  duration: 'duration',
  score: 'score',
  shikimoriScore: 'shikimoriScore',
  airedOn: 'airedOn',
  releasedOn: 'releasedOn',
  shikimoriUrl: 'shikimoriUrl',
  season: 'season',
  isCensored: 'isCensored',
  rating: 'rating',
  nextEpisodeAt: 'nextEpisodeAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GenreScalarFieldEnum = {
  id: 'id',
  requestId: 'requestId',
  name: 'name',
  russian: 'russian'
};

exports.Prisma.ThemeScalarFieldEnum = {
  id: 'id',
  requestId: 'requestId',
  name: 'name',
  russian: 'russian'
};

exports.Prisma.DemographicScalarFieldEnum = {
  id: 'id',
  requestId: 'requestId',
  name: 'name',
  russian: 'russian'
};

exports.Prisma.StudioScalarFieldEnum = {
  id: 'id',
  name: 'name',
  imageUrl: 'imageUrl'
};

exports.Prisma.AnimeStudioScalarFieldEnum = {
  animeId: 'animeId',
  studioId: 'studioId'
};

exports.Prisma.RelatedAnimeScalarFieldEnum = {
  id: 'id',
  animeId: 'animeId',
  relatedAnimeId: 'relatedAnimeId',
  relationKind: 'relationKind'
};

exports.Prisma.AnimeGenreScalarFieldEnum = {
  animeId: 'animeId',
  genreId: 'genreId'
};

exports.Prisma.AnimeThemeScalarFieldEnum = {
  animeId: 'animeId',
  themeId: 'themeId'
};

exports.Prisma.AnimeDemographicScalarFieldEnum = {
  animeId: 'animeId',
  demographicId: 'demographicId'
};

exports.Prisma.AnimePosterScalarFieldEnum = {
  id: 'id',
  shikimoriId: 'shikimoriId',
  animeId: 'animeId',
  originalUrl: 'originalUrl',
  mainUrl: 'mainUrl'
};

exports.Prisma.AnimeVideoScalarFieldEnum = {
  animeId: 'animeId',
  videoId: 'videoId'
};

exports.Prisma.AnimeScreenshotScalarFieldEnum = {
  animeId: 'animeId',
  screenshotId: 'screenshotId'
};

exports.Prisma.VideoScalarFieldEnum = {
  id: 'id',
  shikimoriId: 'shikimoriId',
  url: 'url',
  name: 'name',
  kind: 'kind',
  playerUrl: 'playerUrl',
  imageUrl: 'imageUrl'
};

exports.Prisma.ScreenshotsScalarFieldEnum = {
  id: 'id',
  shikimoriId: 'shikimoriId',
  originalUrl: 'originalUrl',
  x332Url: 'x332Url'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  type: 'type',
  provider: 'provider',
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.TokenScalarFieldEnum = {
  id: 'id',
  email: 'email',
  token: 'token',
  type: 'type',
  expiresIn: 'expiresIn',
  createdAt: 'createdAt'
};

exports.Prisma.ParsingSessionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  status: 'status',
  type: 'type',
  lastProcessedPage: 'lastProcessedPage',
  processedPages: 'processedPages',
  processedItems: 'processedItems',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  displayName: 'displayName',
  picture: 'picture',
  role: 'role',
  isVerified: 'isVerified',
  isTwoFactorEnabled: 'isTwoFactorEnabled',
  method: 'method',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.AnimeStatus = exports.$Enums.AnimeStatus = {
  anons: 'anons',
  ongoing: 'ongoing',
  released: 'released'
};

exports.AnimeKind = exports.$Enums.AnimeKind = {
  tv: 'tv',
  movie: 'movie',
  ova: 'ova',
  ona: 'ona',
  special: 'special',
  tv_special: 'tv_special',
  music: 'music',
  pv: 'pv',
  cm: 'cm'
};

exports.AnimeRating = exports.$Enums.AnimeRating = {
  none: 'none',
  g: 'g',
  pg: 'pg',
  pg_13: 'pg_13',
  r: 'r',
  r_plus: 'r_plus',
  rx: 'rx'
};

exports.RelationKind = exports.$Enums.RelationKind = {
  adaptation: 'adaptation',
  alternative_setting: 'alternative_setting',
  alternative_version: 'alternative_version',
  character: 'character',
  full_story: 'full_story',
  other: 'other',
  parent_story: 'parent_story',
  prequel: 'prequel',
  sequel: 'sequel',
  side_story: 'side_story',
  spin_off: 'spin_off',
  summary: 'summary'
};

exports.VideoKindEnum = exports.$Enums.VideoKindEnum = {
  pv: 'pv',
  character_trailer: 'character_trailer',
  cm: 'cm',
  op: 'op',
  ed: 'ed',
  op_ed_clip: 'op_ed_clip',
  clip: 'clip',
  other: 'other',
  episode_preview: 'episode_preview'
};

exports.TokenType = exports.$Enums.TokenType = {
  VERIFICATION: 'VERIFICATION',
  TWO_FACTOR: 'TWO_FACTOR',
  PASSWORD_RESET: 'PASSWORD_RESET'
};

exports.ParsingSessionType = exports.$Enums.ParsingSessionType = {
  CREATE_DATABASE: 'CREATE_DATABASE',
  UPDATE_ONGOINGS: 'UPDATE_ONGOINGS',
  UPDATE_THIS_YEAR: 'UPDATE_THIS_YEAR'
};

exports.UserRole = exports.$Enums.UserRole = {
  REGULAR: 'REGULAR',
  ADMIN: 'ADMIN'
};

exports.AuthMethod = exports.$Enums.AuthMethod = {
  CREDENTIALS: 'CREDENTIALS',
  GOOGLE: 'GOOGLE',
  YANDEX: 'YANDEX'
};

exports.Prisma.ModelName = {
  Anime: 'Anime',
  Genre: 'Genre',
  Theme: 'Theme',
  Demographic: 'Demographic',
  Studio: 'Studio',
  AnimeStudio: 'AnimeStudio',
  RelatedAnime: 'RelatedAnime',
  AnimeGenre: 'AnimeGenre',
  AnimeTheme: 'AnimeTheme',
  AnimeDemographic: 'AnimeDemographic',
  AnimePoster: 'AnimePoster',
  AnimeVideo: 'AnimeVideo',
  AnimeScreenshot: 'AnimeScreenshot',
  Video: 'Video',
  Screenshots: 'Screenshots',
  Account: 'Account',
  Token: 'Token',
  ParsingSession: 'ParsingSession',
  User: 'User'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
