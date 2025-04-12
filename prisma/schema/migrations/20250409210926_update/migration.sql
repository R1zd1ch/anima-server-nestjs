-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('REGULAR', 'ADMIN');

-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('CREDENTIALS', 'GOOGLE', 'YANDEX');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('VERIFICATION', 'TWO_FACTOR', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "russian" TEXT,
    "image" JSONB NOT NULL,
    "url" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "episodes" INTEGER NOT NULL,
    "aired_on" TIMESTAMP(3),
    "released_on" TIMESTAMP(3),
    "rating" TEXT NOT NULL,
    "english" TEXT[],
    "synonyms" TEXT[],
    "thread_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "myanimelist_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fansubbers" TEXT[],
    "fandubbers" TEXT[],
    "licensors" TEXT[],
    "genres" TEXT[],
    "studios" TEXT[],
    "videos" TEXT[],
    "screenshots" TEXT[],

    CONSTRAINT "anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_draft" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "russian" TEXT,
    "image" JSONB NOT NULL,
    "url" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "episodes" INTEGER NOT NULL,
    "aired_on" TIMESTAMP(3),
    "released_on" TIMESTAMP(3),
    "rating" TEXT NOT NULL,
    "english" TEXT[],
    "synonyms" TEXT[],
    "thread_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "myanimelist_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fansubbers" TEXT[],
    "fandubbers" TEXT[],
    "licensors" TEXT[],
    "genres" TEXT[],
    "studios" TEXT[],
    "videos" TEXT[],
    "screenshots" TEXT[],

    CONSTRAINT "anime_draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires_in" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "picture" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'REGULAR',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "method" "AuthMethod" NOT NULL DEFAULT 'CREDENTIALS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
