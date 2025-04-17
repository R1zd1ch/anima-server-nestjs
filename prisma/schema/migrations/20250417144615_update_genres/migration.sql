/*
  Warnings:

  - A unique constraint covering the columns `[requestId]` on the table `genres` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "genres" ADD COLUMN     "requestId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "genres_requestId_key" ON "genres"("requestId");
