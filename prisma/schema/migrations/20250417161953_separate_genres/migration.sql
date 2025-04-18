-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "requestId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "russian" TEXT NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographics" (
    "id" TEXT NOT NULL,
    "requestId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "russian" TEXT NOT NULL,

    CONSTRAINT "demographics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_themes" (
    "animeId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "anime_themes_pkey" PRIMARY KEY ("animeId","themeId")
);

-- CreateTable
CREATE TABLE "anime_demographics" (
    "animeId" TEXT NOT NULL,
    "demographicId" TEXT NOT NULL,

    CONSTRAINT "anime_demographics_pkey" PRIMARY KEY ("animeId","demographicId")
);

-- CreateIndex
CREATE UNIQUE INDEX "themes_requestId_key" ON "themes"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "themes_name_key" ON "themes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "demographics_requestId_key" ON "demographics"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "demographics_name_key" ON "demographics"("name");

-- AddForeignKey
ALTER TABLE "anime_themes" ADD CONSTRAINT "anime_themes_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_themes" ADD CONSTRAINT "anime_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_demographics" ADD CONSTRAINT "anime_demographics_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_demographics" ADD CONSTRAINT "anime_demographics_demographicId_fkey" FOREIGN KEY ("demographicId") REFERENCES "demographics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
