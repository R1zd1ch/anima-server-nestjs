/*
  Warnings:

  - You are about to drop the `anime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anime_draft` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VideoKindEnum" AS ENUM ('pv', 'character_trailer', 'cm', 'op', 'ed', 'op_ed_clip', 'clip', 'other', 'episode_preview');

-- CreateEnum
CREATE TYPE "AnimeStatus" AS ENUM ('anons', 'ongoing', 'released');

-- CreateEnum
CREATE TYPE "AnimeKind" AS ENUM ('tv', 'movie', 'ova', 'ona', 'special', 'tv_special', 'music', 'pv', 'cm');

-- CreateEnum
CREATE TYPE "AnimeRating" AS ENUM ('none', 'g', 'pg', 'pg_13', 'r', 'r_plus', 'rx');

-- CreateEnum
CREATE TYPE "RelationKind" AS ENUM ('adaptation', 'alternative_setting', 'alternative_version', 'character', 'full_story', 'other', 'parent_story', 'prequel', 'sequel', 'side_story', 'spin_off', 'summary');

-- CreateEnum
CREATE TYPE "ParsingSessionStatus" AS ENUM ('CREATED', 'RUNNING', 'COMPLETED', 'PAUSED', 'FAILED');

-- CreateEnum
CREATE TYPE "ParsingSessionType" AS ENUM ('CREATE_DATABASE', 'UPDATE_ONGOINGS', 'UPDATE_THIS_YEAR');

-- DropTable
DROP TABLE "anime";

-- DropTable
DROP TABLE "anime_draft";

-- CreateTable
CREATE TABLE "animes" (
    "id" TEXT NOT NULL,
    "malId" TEXT,
    "shikimoriId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "russian" TEXT,
    "english" TEXT,
    "japanese" TEXT,
    "synonyms" TEXT[],
    "status" "AnimeStatus" NOT NULL DEFAULT 'anons',
    "kind" "AnimeKind",
    "episodes" INTEGER NOT NULL,
    "episodesAired" INTEGER NOT NULL,
    "duration" INTEGER,
    "score" DOUBLE PRECISION,
    "shikimoriScore" DOUBLE PRECISION,
    "releasedOn" TEXT,
    "shikimoriUrl" TEXT,
    "season" TEXT,
    "isCensored" BOOLEAN,
    "rating" "AnimeRating",
    "nextEpisodeAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "russian" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "studios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_studios" (
    "animeId" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,

    CONSTRAINT "anime_studios_pkey" PRIMARY KEY ("animeId","studioId")
);

-- CreateTable
CREATE TABLE "related_animes" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "relatedAnimeId" TEXT NOT NULL,
    "relationKind" "RelationKind" NOT NULL,

    CONSTRAINT "related_animes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_genres" (
    "animeId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "anime_genres_pkey" PRIMARY KEY ("animeId","genreId")
);

-- CreateTable
CREATE TABLE "anime_posters" (
    "id" TEXT NOT NULL,
    "shikimoriId" TEXT,
    "animeId" TEXT NOT NULL,
    "originalUrl" TEXT,
    "mainUrl" TEXT,

    CONSTRAINT "anime_posters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_videos" (
    "animeId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "anime_videos_pkey" PRIMARY KEY ("animeId","videoId")
);

-- CreateTable
CREATE TABLE "anime_screenshots" (
    "animeId" TEXT NOT NULL,
    "screenshotId" TEXT NOT NULL,

    CONSTRAINT "anime_screenshots_pkey" PRIMARY KEY ("animeId","screenshotId")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "shikimoriId" TEXT,
    "url" TEXT,
    "name" TEXT,
    "kind" "VideoKindEnum" NOT NULL,
    "playerUrl" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screenshots" (
    "id" TEXT NOT NULL,
    "shikimoriId" TEXT NOT NULL,
    "originalUrl" TEXT,
    "x332Url" TEXT,

    CONSTRAINT "screenshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsing_session" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" "ParsingSessionType" NOT NULL,
    "lastProcessedPage" INTEGER NOT NULL,
    "processedPages" INTEGER NOT NULL,
    "processedItems" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parsing_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "animes_malId_key" ON "animes"("malId");

-- CreateIndex
CREATE UNIQUE INDEX "animes_shikimoriId_key" ON "animes"("shikimoriId");

-- CreateIndex
CREATE UNIQUE INDEX "animes_name_shikimoriId_key" ON "animes"("name", "shikimoriId");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "studios_name_key" ON "studios"("name");

-- CreateIndex
CREATE UNIQUE INDEX "related_animes_animeId_relatedAnimeId_key" ON "related_animes"("animeId", "relatedAnimeId");

-- CreateIndex
CREATE UNIQUE INDEX "videos_shikimoriId_key" ON "videos"("shikimoriId");

-- CreateIndex
CREATE UNIQUE INDEX "screenshots_shikimoriId_key" ON "screenshots"("shikimoriId");

-- CreateIndex
CREATE UNIQUE INDEX "parsing_session_id_key" ON "parsing_session"("id");

-- AddForeignKey
ALTER TABLE "anime_studios" ADD CONSTRAINT "anime_studios_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_studios" ADD CONSTRAINT "anime_studios_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_animes" ADD CONSTRAINT "related_animes_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_animes" ADD CONSTRAINT "related_animes_relatedAnimeId_fkey" FOREIGN KEY ("relatedAnimeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_posters" ADD CONSTRAINT "anime_posters_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_videos" ADD CONSTRAINT "anime_videos_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_videos" ADD CONSTRAINT "anime_videos_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_screenshots" ADD CONSTRAINT "anime_screenshots_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_screenshots" ADD CONSTRAINT "anime_screenshots_screenshotId_fkey" FOREIGN KEY ("screenshotId") REFERENCES "screenshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
