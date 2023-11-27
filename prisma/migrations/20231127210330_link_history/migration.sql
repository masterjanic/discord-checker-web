/*
  Warnings:

  - You are about to drop the column `accountId` on the `DiscordAccountHistory` table. All the data in the column will be lost.
  - Added the required column `discordAccountId` to the `DiscordAccountHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordAccountHistory" DROP COLUMN "accountId",
ADD COLUMN     "discordAccountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscordAccountHistory" ADD CONSTRAINT "DiscordAccountHistory_discordAccountId_fkey" FOREIGN KEY ("discordAccountId") REFERENCES "DiscordAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
