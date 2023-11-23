/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `StripeEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerId";

-- DropTable
DROP TABLE "StripeEvent";

-- CreateTable
CREATE TABLE "SellixEvent" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "SellixEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellixEvent_id_key" ON "SellixEvent"("id");
