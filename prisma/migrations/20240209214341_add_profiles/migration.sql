-- DropForeignKey
ALTER TABLE "DiscordAccount" DROP CONSTRAINT "DiscordAccount_ownerId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publicAnonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicProfile" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "DiscordAccount" ADD CONSTRAINT "DiscordAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
