
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

exports.Prisma.DemographicScalarFieldEnum = {
  id: 'id',
  requestId: 'requestId',
  name: 'name',
  russian: 'russian'
};

exports.Prisma.AnimeDemographicScalarFieldEnum = {
  animeId: 'animeId',
  demographicId: 'demographicId'
};

exports.Prisma.GenreScalarFieldEnum = {
  id: 'id',
  requestId: 'requestId',
  name: 'name',
  russian: 'russian'
};

exports.Prisma.AnimeGenreScalarFieldEnum = {
  animeId: 'animeId',
  genreId: 'genreId'
};

exports.Prisma.AnimePosterScalarFieldEnum = {
  id: 'id',
  shikimoriId: 'shikimoriId',
  animeId: 'animeId',
  originalUrl: 'originalUrl',
  mainUrl: 'mainUrl'
};

exports.Prisma.RelatedAnimeScalarFieldEnum = {
  id: 'id',
  animeId: 'animeId',
  relatedAnimeId: 'relatedAnimeId',
  relationKind: 'relationKind'
};

exports.Prisma.ScreenshotsScalarFieldEnum = {
  id: 'id',
  shikimoriId: 'shikimoriId',
  originalUrl: 'originalUrl',
  x332Url: 'x332Url'
};

exports.Prisma.AnimeScreenshotScalarFieldEnum = {
  animeId: 'animeId',
  screenshotId: 'screenshotId'
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

exports.Prisma.ThemeScalarFieldEnum = {
  id: 'id',
  requestId: 'requestId',
  name: 'name',
  russian: 'russian'
};

exports.Prisma.AnimeThemeScalarFieldEnum = {
  animeId: 'animeId',
  themeId: 'themeId'
};

exports.Prisma.AnimeVideoScalarFieldEnum = {
  animeId: 'animeId',
  videoId: 'videoId'
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

exports.Prisma.AnimeCollectionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  description: 'description',
  isPublic: 'isPublic',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnimeInCollectionScalarFieldEnum = {
  collectionId: 'collectionId',
  animeId: 'animeId',
  note: 'note',
  addedAt: 'addedAt'
};

exports.Prisma.AnimeCollectionLikeScalarFieldEnum = {
  userId: 'userId',
  collectionId: 'collectionId',
  likedAt: 'likedAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  userId: 'userId',
  animeId: 'animeId',
  likesCount: 'likesCount',
  episode: 'episode',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CommentLikeScalarFieldEnum = {
  userId: 'userId',
  commentId: 'commentId',
  likedAt: 'likedAt'
};

exports.Prisma.AnimeEpisodeProgressScalarFieldEnum = {
  userId: 'userId',
  animeId: 'animeId',
  episode: 'episode',
  timestamp: 'timestamp',
  isWatched: 'isWatched',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  animeId: 'animeId',
  rating: 'rating',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserSettingsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  theme: 'theme',
  language: 'language',
  show18plus: 'show18plus',
  showActivity: 'showActivity',
  showAnimeList: 'showAnimeList',
  showAllCommentsInProfile: 'showAllCommentsInProfile',
  notificationsOn: 'notificationsOn',
  preferredGenres: 'preferredGenres'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  password: 'password',
  displayName: 'displayName',
  picture: 'picture',
  role: 'role',
  method: 'method',
  isVerified: 'isVerified',
  isTwoFactorEnabled: 'isTwoFactorEnabled',
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

exports.AnimeCollectionType = exports.$Enums.AnimeCollectionType = {
  PLANNED: 'PLANNED',
  WATCHING: 'WATCHING',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED',
  FAVORITE: 'FAVORITE',
  CUSTOM: 'CUSTOM'
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
  Demographic: 'Demographic',
  AnimeDemographic: 'AnimeDemographic',
  Genre: 'Genre',
  AnimeGenre: 'AnimeGenre',
  AnimePoster: 'AnimePoster',
  RelatedAnime: 'RelatedAnime',
  Screenshots: 'Screenshots',
  AnimeScreenshot: 'AnimeScreenshot',
  Studio: 'Studio',
  AnimeStudio: 'AnimeStudio',
  Theme: 'Theme',
  AnimeTheme: 'AnimeTheme',
  AnimeVideo: 'AnimeVideo',
  Video: 'Video',
  Anime: 'Anime',
  Account: 'Account',
  Token: 'Token',
  ParsingSession: 'ParsingSession',
  AnimeCollection: 'AnimeCollection',
  AnimeInCollection: 'AnimeInCollection',
  AnimeCollectionLike: 'AnimeCollectionLike',
  Comment: 'Comment',
  CommentLike: 'CommentLike',
  AnimeEpisodeProgress: 'AnimeEpisodeProgress',
  Review: 'Review',
  UserSettings: 'UserSettings',
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
