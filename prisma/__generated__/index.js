
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/library.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

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

exports.Prisma.AnimeScalarFieldEnum = {
  id: 'id',
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

exports.Prisma.TokenScalarFieldEnum = {
  id: 'id',
  email: 'email',
  token: 'token',
  type: 'type',
  expiresIn: 'expiresIn',
  createdAt: 'createdAt'
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

exports.UserRole = exports.$Enums.UserRole = {
  REGULAR: 'REGULAR',
  ADMIN: 'ADMIN'
};

exports.AuthMethod = exports.$Enums.AuthMethod = {
  CREDENTIALS: 'CREDENTIALS',
  GOOGLE: 'GOOGLE',
  YANDEX: 'YANDEX'
};

exports.TokenType = exports.$Enums.TokenType = {
  VERIFICATION: 'VERIFICATION',
  TWO_FACTOR: 'TWO_FACTOR',
  PASSWORD_RESET: 'PASSWORD_RESET'
};

exports.ParsingSessionStatus = exports.$Enums.ParsingSessionStatus = {
  CREATED: 'CREATED',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  PAUSED: 'PAUSED',
  FAILED: 'FAILED'
};

exports.ParsingSessionType = exports.$Enums.ParsingSessionType = {
  CREATE_DATABASE: 'CREATE_DATABASE',
  UPDATE_ONGOINGS: 'UPDATE_ONGOINGS',
  UPDATE_THIS_YEAR: 'UPDATE_THIS_YEAR'
};

exports.Prisma.ModelName = {
  Account: 'Account',
  Anime: 'Anime',
  Genre: 'Genre',
  Studio: 'Studio',
  AnimeStudio: 'AnimeStudio',
  RelatedAnime: 'RelatedAnime',
  AnimeGenre: 'AnimeGenre',
  AnimePoster: 'AnimePoster',
  AnimeVideo: 'AnimeVideo',
  AnimeScreenshot: 'AnimeScreenshot',
  Video: 'Video',
  Screenshots: 'Screenshots',
  ParsingSession: 'ParsingSession',
  Token: 'Token',
  User: 'User'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/evgenijcervev/Desktop/anime-website/server/prisma/__generated__",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [
      "prismaSchemaFolder"
    ],
    "sourceFilePath": "/Users/evgenijcervev/Desktop/anime-website/server/prisma/schema/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../.env"
  },
  "relativePath": "../schema",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "POSTGRES_URI",
        "value": "postgresql://root:123456@localhost:5432/anime_backend"
      }
    }
  },
  "inlineSchema": "model Account {\n  id String @id @default(uuid())\n\n  type     String\n  provider String\n\n  refreshToken String? @map(\"refresh_token\")\n  accessToken  String? @map(\"access_token\")\n  expiresAt    Int?    @map(\"expires_at\")\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n  user      User?    @relation(fields: [userId], references: [id])\n  userId    String?  @map(\"user_id\")\n\n  @@map(\"accounts\")\n}\n\nmodel Anime {\n  id             String            @id @default(uuid())\n  malId          String?           @unique\n  shikimoriId    String?           @unique\n  name           String\n  description    String?\n  russian        String?\n  english        String?\n  japanese       String?\n  synonyms       String[]\n  status         AnimeStatus       @default(anons)\n  kind           AnimeKind?\n  episodes       Int\n  episodesAired  Int\n  duration       Int?\n  score          Float?\n  shikimoriScore Float?\n  releasedOn     String?\n  shikimoriUrl   String?\n  season         String?\n  poster         AnimePoster[]\n  isCensored     Boolean?\n  rating         AnimeRating?\n  nextEpisodeAt  String?\n  // userRates      UserRate[]\n  studios        AnimeStudio[]\n  related        RelatedAnime[]    @relation(\"AnimeToRelatedAnime\")\n  videos         AnimeVideo[]\n  screenshots    AnimeScreenshot[]\n  genres         AnimeGenre[]\n\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  relatedAnime RelatedAnime[] @relation(\"RelatedAnimeToAnime\")\n\n  @@unique([name, shikimoriId])\n  @@map(\"animes\")\n}\n\nmodel Genre {\n  id      String       @id @default(uuid())\n  name    String       @unique\n  russian String\n  animes  AnimeGenre[]\n\n  @@map(\"genres\")\n}\n\nmodel Studio {\n  id          String        @id @default(uuid())\n  name        String        @unique\n  imageUrl    String?\n  AnimeStudio AnimeStudio[]\n\n  @@map(\"studios\")\n}\n\nmodel AnimeStudio {\n  animeId  String\n  studioId String\n  anime    Anime  @relation(fields: [animeId], references: [id])\n  studio   Studio @relation(fields: [studioId], references: [id])\n\n  @@id([animeId, studioId])\n  @@map(\"anime_studios\")\n}\n\nmodel RelatedAnime {\n  id             String       @id @default(uuid())\n  animeId        String\n  relatedAnimeId String\n  relationKind   RelationKind\n\n  anime   Anime @relation(\"AnimeToRelatedAnime\", fields: [animeId], references: [id])\n  related Anime @relation(\"RelatedAnimeToAnime\", fields: [relatedAnimeId], references: [id])\n\n  @@unique([animeId, relatedAnimeId])\n  @@map(\"related_animes\")\n}\n\nmodel AnimeGenre {\n  animeId String\n  genreId String\n  anime   Anime  @relation(fields: [animeId], references: [id])\n  genre   Genre  @relation(fields: [genreId], references: [id])\n\n  @@id([animeId, genreId])\n  @@map(\"anime_genres\")\n}\n\nmodel AnimePoster {\n  id          String  @id @default(uuid())\n  shikimoriId String?\n  animeId     String\n  originalUrl String?\n  mainUrl     String?\n  anime       Anime   @relation(fields: [animeId], references: [id])\n\n  @@map(\"anime_posters\")\n}\n\nmodel AnimeVideo {\n  animeId String\n  videoId String\n\n  anime Anime @relation(fields: [animeId], references: [id])\n  video Video @relation(fields: [videoId], references: [id])\n\n  @@id([animeId, videoId])\n  @@map(\"anime_videos\")\n}\n\nmodel AnimeScreenshot {\n  animeId      String\n  screenshotId String\n\n  anime      Anime       @relation(fields: [animeId], references: [id])\n  screenshot Screenshots @relation(fields: [screenshotId], references: [id])\n\n  @@id([animeId, screenshotId])\n  @@map(\"anime_screenshots\")\n}\n\nmodel Video {\n  id          String        @id @default(uuid())\n  shikimoriId String?       @unique\n  url         String?\n  name        String?\n  kind        VideoKindEnum\n  playerUrl   String?\n  imageUrl    String?\n  animeVideo  AnimeVideo[]\n\n  @@map(\"videos\")\n}\n\nmodel Screenshots {\n  id              String            @id @default(uuid())\n  shikimoriId     String            @unique\n  originalUrl     String?\n  x332Url         String?\n  animeScreenshot AnimeScreenshot[]\n\n  @@map(\"screenshots\")\n}\n\nenum VideoKindEnum {\n  pv\n  character_trailer\n  cm\n  op\n  ed\n  op_ed_clip\n  clip\n  other\n  episode_preview\n}\n\nenum AnimeStatus {\n  anons\n  ongoing\n  released\n}\n\nenum AnimeKind {\n  tv\n  movie\n  ova\n  ona\n  special\n  tv_special\n  music\n  pv\n  cm\n}\n\nenum AnimeRating {\n  none\n  g\n  pg\n  pg_13\n  r\n  r_plus\n  rx\n}\n\nenum RelationKind {\n  adaptation\n  alternative_setting\n  alternative_version\n  character\n  full_story\n  other\n  parent_story\n  prequel\n  sequel\n  side_story\n  spin_off\n  summary\n}\n\nenum UserRole {\n  REGULAR\n  ADMIN\n}\n\nenum AuthMethod {\n  CREDENTIALS\n  GOOGLE\n  YANDEX\n}\n\nenum TokenType {\n  VERIFICATION\n  TWO_FACTOR\n  PASSWORD_RESET\n}\n\nmodel ParsingSession {\n  id                Int                @id @unique @default(autoincrement())\n  name              String\n  status            String\n  type              ParsingSessionType\n  lastProcessedPage Int\n  processedPages    Int\n  processedItems    Int\n  createdAt         DateTime           @default(now())\n  updatedAt         DateTime           @updatedAt\n\n  @@map(\"parsing_session\")\n}\n\nenum ParsingSessionStatus {\n  CREATED\n  RUNNING\n  COMPLETED\n  PAUSED\n  FAILED\n}\n\nenum ParsingSessionType {\n  CREATE_DATABASE\n  UPDATE_ONGOINGS\n  UPDATE_THIS_YEAR\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../__generated__\"\n  previewFeatures = [\"prismaSchemaFolder\"]\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"POSTGRES_URI\")\n}\n\nmodel Token {\n  id String @id @default(uuid())\n\n  email     String\n  token     String    @unique\n  type      TokenType\n  expiresIn DateTime  @map(\"expires_in\")\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  @@map(\"tokens\")\n}\n\nmodel User {\n  id String @id @default(uuid())\n\n  email    String @unique\n  password String\n\n  displayName String\n  picture     String?\n\n  role               UserRole @default(REGULAR)\n  isVerified         Boolean  @default(false) @map(\"is_verified\")\n  isTwoFactorEnabled Boolean  @default(false) @map(\"is_two_factor_enabled\")\n\n  method   AuthMethod @default(CREDENTIALS)\n  accounts Account[]\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  @@map(\"users\")\n}\n",
  "inlineSchemaHash": "6223162934222c8a04bd4575c8c04b42a61f6823272b2581cfe5d9da481f5ae2",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "prisma/__generated__",
    "__generated__",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Account\":{\"dbName\":\"accounts\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refreshToken\",\"dbName\":\"refresh_token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accessToken\",\"dbName\":\"access_token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"dbName\":\"expires_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"AccountToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Anime\":{\"dbName\":\"animes\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"malId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"shikimoriId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"russian\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"english\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"japanese\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"synonyms\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AnimeStatus\",\"nativeType\":null,\"default\":\"anons\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kind\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeKind\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"episodes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"episodesAired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"shikimoriScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"releasedOn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"shikimoriUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"season\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"poster\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimePoster\",\"nativeType\":null,\"relationName\":\"AnimeToAnimePoster\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isCensored\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rating\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeRating\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nextEpisodeAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studios\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeStudio\",\"nativeType\":null,\"relationName\":\"AnimeToAnimeStudio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"related\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RelatedAnime\",\"nativeType\":null,\"relationName\":\"AnimeToRelatedAnime\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"videos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeVideo\",\"nativeType\":null,\"relationName\":\"AnimeToAnimeVideo\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"screenshots\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeScreenshot\",\"nativeType\":null,\"relationName\":\"AnimeToAnimeScreenshot\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"genres\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeGenre\",\"nativeType\":null,\"relationName\":\"AnimeToAnimeGenre\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"relatedAnime\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RelatedAnime\",\"nativeType\":null,\"relationName\":\"RelatedAnimeToAnime\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"name\",\"shikimoriId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"name\",\"shikimoriId\"]}],\"isGenerated\":false},\"Genre\":{\"dbName\":\"genres\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"russian\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"animes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeGenre\",\"nativeType\":null,\"relationName\":\"AnimeGenreToGenre\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Studio\":{\"dbName\":\"studios\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"AnimeStudio\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeStudio\",\"nativeType\":null,\"relationName\":\"AnimeStudioToStudio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AnimeStudio\":{\"dbName\":\"anime_studios\",\"schema\":null,\"fields\":[{\"name\":\"animeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anime\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Anime\",\"nativeType\":null,\"relationName\":\"AnimeToAnimeStudio\",\"relationFromFields\":[\"animeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"studio\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Studio\",\"nativeType\":null,\"relationName\":\"AnimeStudioToStudio\",\"relationFromFields\":[\"studioId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"animeId\",\"studioId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RelatedAnime\":{\"dbName\":\"related_animes\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"animeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relatedAnimeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationKind\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RelationKind\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anime\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Anime\",\"nativeType\":null,\"relationName\":\"AnimeToRelatedAnime\",\"relationFromFields\":[\"animeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"related\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Anime\",\"nativeType\":null,\"relationName\":\"RelatedAnimeToAnime\",\"relationFromFields\":[\"relatedAnimeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"animeId\",\"relatedAnimeId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"animeId\",\"relatedAnimeId\"]}],\"isGenerated\":false},\"AnimeGenre\":{\"dbName\":\"anime_genres\",\"schema\":null,\"fields\":[{\"name\":\"animeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"genreId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anime\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Anime\",\"nativeType\":null,\"relationName\":\"AnimeToAnimeGenre\",\"relationFromFields\":[\"animeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"genre\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Genre\",\"nativeType\":null,\"relationName\":\"AnimeGenreToGenre\",\"relationFromFields\":[\"genreId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"animeId\",\"genreId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AnimePoster\":{\"dbName\":\"anime_posters\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"shikimoriId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"animeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"originalUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mainUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anime\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Anime\",\"nativeType\":null,\"relationName\":\"AnimeToAnimePoster\",\"relationFromFields\":[\"animeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AnimeVideo\":{\"dbName\":\"anime_videos\",\"schema\":null,\"fields\":[{\"name\":\"animeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"videoId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anime\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Anime\",\"nativeType\":null,\"relationName\":\"AnimeToAnimeVideo\",\"relationFromFields\":[\"animeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"video\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Video\",\"nativeType\":null,\"relationName\":\"AnimeVideoToVideo\",\"relationFromFields\":[\"videoId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"animeId\",\"videoId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AnimeScreenshot\":{\"dbName\":\"anime_screenshots\",\"schema\":null,\"fields\":[{\"name\":\"animeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"screenshotId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anime\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Anime\",\"nativeType\":null,\"relationName\":\"AnimeToAnimeScreenshot\",\"relationFromFields\":[\"animeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"screenshot\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Screenshots\",\"nativeType\":null,\"relationName\":\"AnimeScreenshotToScreenshots\",\"relationFromFields\":[\"screenshotId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"animeId\",\"screenshotId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Video\":{\"dbName\":\"videos\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"shikimoriId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kind\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VideoKindEnum\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"playerUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"animeVideo\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeVideo\",\"nativeType\":null,\"relationName\":\"AnimeVideoToVideo\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Screenshots\":{\"dbName\":\"screenshots\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"shikimoriId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"originalUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"x332Url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"animeScreenshot\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnimeScreenshot\",\"nativeType\":null,\"relationName\":\"AnimeScreenshotToScreenshots\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ParsingSession\":{\"dbName\":\"parsing_session\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ParsingSessionType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastProcessedPage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedPages\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedItems\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Token\":{\"dbName\":\"tokens\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TokenType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresIn\",\"dbName\":\"expires_in\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"User\":{\"dbName\":\"users\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"picture\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserRole\",\"nativeType\":null,\"default\":\"REGULAR\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isVerified\",\"dbName\":\"is_verified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isTwoFactorEnabled\",\"dbName\":\"is_two_factor_enabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"method\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AuthMethod\",\"nativeType\":null,\"default\":\"CREDENTIALS\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accounts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Account\",\"nativeType\":null,\"relationName\":\"AccountToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"VideoKindEnum\":{\"values\":[{\"name\":\"pv\",\"dbName\":null},{\"name\":\"character_trailer\",\"dbName\":null},{\"name\":\"cm\",\"dbName\":null},{\"name\":\"op\",\"dbName\":null},{\"name\":\"ed\",\"dbName\":null},{\"name\":\"op_ed_clip\",\"dbName\":null},{\"name\":\"clip\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null},{\"name\":\"episode_preview\",\"dbName\":null}],\"dbName\":null},\"AnimeStatus\":{\"values\":[{\"name\":\"anons\",\"dbName\":null},{\"name\":\"ongoing\",\"dbName\":null},{\"name\":\"released\",\"dbName\":null}],\"dbName\":null},\"AnimeKind\":{\"values\":[{\"name\":\"tv\",\"dbName\":null},{\"name\":\"movie\",\"dbName\":null},{\"name\":\"ova\",\"dbName\":null},{\"name\":\"ona\",\"dbName\":null},{\"name\":\"special\",\"dbName\":null},{\"name\":\"tv_special\",\"dbName\":null},{\"name\":\"music\",\"dbName\":null},{\"name\":\"pv\",\"dbName\":null},{\"name\":\"cm\",\"dbName\":null}],\"dbName\":null},\"AnimeRating\":{\"values\":[{\"name\":\"none\",\"dbName\":null},{\"name\":\"g\",\"dbName\":null},{\"name\":\"pg\",\"dbName\":null},{\"name\":\"pg_13\",\"dbName\":null},{\"name\":\"r\",\"dbName\":null},{\"name\":\"r_plus\",\"dbName\":null},{\"name\":\"rx\",\"dbName\":null}],\"dbName\":null},\"RelationKind\":{\"values\":[{\"name\":\"adaptation\",\"dbName\":null},{\"name\":\"alternative_setting\",\"dbName\":null},{\"name\":\"alternative_version\",\"dbName\":null},{\"name\":\"character\",\"dbName\":null},{\"name\":\"full_story\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null},{\"name\":\"parent_story\",\"dbName\":null},{\"name\":\"prequel\",\"dbName\":null},{\"name\":\"sequel\",\"dbName\":null},{\"name\":\"side_story\",\"dbName\":null},{\"name\":\"spin_off\",\"dbName\":null},{\"name\":\"summary\",\"dbName\":null}],\"dbName\":null},\"UserRole\":{\"values\":[{\"name\":\"REGULAR\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null}],\"dbName\":null},\"AuthMethod\":{\"values\":[{\"name\":\"CREDENTIALS\",\"dbName\":null},{\"name\":\"GOOGLE\",\"dbName\":null},{\"name\":\"YANDEX\",\"dbName\":null}],\"dbName\":null},\"TokenType\":{\"values\":[{\"name\":\"VERIFICATION\",\"dbName\":null},{\"name\":\"TWO_FACTOR\",\"dbName\":null},{\"name\":\"PASSWORD_RESET\",\"dbName\":null}],\"dbName\":null},\"ParsingSessionStatus\":{\"values\":[{\"name\":\"CREATED\",\"dbName\":null},{\"name\":\"RUNNING\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"PAUSED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null},\"ParsingSessionType\":{\"values\":[{\"name\":\"CREATE_DATABASE\",\"dbName\":null},{\"name\":\"UPDATE_ONGOINGS\",\"dbName\":null},{\"name\":\"UPDATE_THIS_YEAR\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-darwin-arm64.dylib.node");
path.join(process.cwd(), "prisma/__generated__/libquery_engine-darwin-arm64.dylib.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "prisma/__generated__/schema.prisma")
