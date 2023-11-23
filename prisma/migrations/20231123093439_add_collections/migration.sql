-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "DiscordAccountCollection" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordAccountCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DiscordAccountToDiscordAccountCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DiscordAccountToDiscordAccountCollection_AB_unique" ON "_DiscordAccountToDiscordAccountCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscordAccountToDiscordAccountCollection_B_index" ON "_DiscordAccountToDiscordAccountCollection"("B");

-- AddForeignKey
ALTER TABLE "DiscordAccountCollection" ADD CONSTRAINT "DiscordAccountCollection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscordAccountToDiscordAccountCollection" ADD CONSTRAINT "_DiscordAccountToDiscordAccountCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscordAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscordAccountToDiscordAccountCollection" ADD CONSTRAINT "_DiscordAccountToDiscordAccountCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "DiscordAccountCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
