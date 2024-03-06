/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `ApiKey` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `rateLimit` on the `ApiKey` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to drop the column `updatedAt` on the `DiscordAccount` table. All the data in the column will be lost.
  - You are about to alter the column `premium_type` on the `DiscordAccount` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `rating` on the `DiscordAccount` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to drop the column `updatedAt` on the `DiscordAccountHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `DiscordToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "updatedAt",
ALTER COLUMN "value" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "rateLimit" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "DiscordAccount" DROP COLUMN "updatedAt",
ALTER COLUMN "premium_type" SET DATA TYPE SMALLINT,
ALTER COLUMN "rating" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "DiscordAccountHistory" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "DiscordToken" DROP COLUMN "updatedAt";

-- CreateIndex
CREATE INDEX "DiscordAccount_username_idx" ON "DiscordAccount"("username");
