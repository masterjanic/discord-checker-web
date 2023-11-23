-- AlterTable
ALTER TABLE "DiscordAccount" ADD COLUMN     "notes" VARCHAR(1024),
ADD COLUMN     "rating" INTEGER DEFAULT 0;
