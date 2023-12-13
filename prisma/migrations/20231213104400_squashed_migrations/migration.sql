-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateTable
CREATE TABLE "DiscordAccount" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "discriminator" VARCHAR(4) NOT NULL,
    "global_name" VARCHAR(32),
    "avatar" TEXT,
    "avatar_decoration" TEXT,
    "email" VARCHAR(254),
    "verified" BOOLEAN,
    "accent_color" INTEGER,
    "banner" TEXT,
    "bot" BOOLEAN,
    "flags" BIGINT,
    "locale" VARCHAR(5),
    "mfa_enabled" BOOLEAN,
    "premium_type" INTEGER,
    "public_flags" BIGINT,
    "system" BOOLEAN,
    "phone" VARCHAR(32),
    "nsfw_allowed" BOOLEAN,
    "bio" VARCHAR(190),
    "banner_color" TEXT,
    "password" VARCHAR(256),
    "rating" INTEGER,
    "notes" VARCHAR(1024),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "DiscordAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordAccountHistory" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "discordAccountId" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordAccountHistory_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "DiscordToken" (
    "id" TEXT NOT NULL,
    "discordAccountId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "origin" VARCHAR(64),
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellixEvent" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "SellixEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "userId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "allowedIps" VARCHAR(64)[],
    "rateLimit" INTEGER NOT NULL DEFAULT 10,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "subscribedTill" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "_DiscordAccountToDiscordAccountCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordAccount_id_key" ON "DiscordAccount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordToken_value_key" ON "DiscordToken"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_value_key" ON "ApiKey"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscordAccountToDiscordAccountCollection_AB_unique" ON "_DiscordAccountToDiscordAccountCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscordAccountToDiscordAccountCollection_B_index" ON "_DiscordAccountToDiscordAccountCollection"("B");

-- AddForeignKey
ALTER TABLE "DiscordAccount" ADD CONSTRAINT "DiscordAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordAccountHistory" ADD CONSTRAINT "DiscordAccountHistory_discordAccountId_fkey" FOREIGN KEY ("discordAccountId") REFERENCES "DiscordAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordAccountCollection" ADD CONSTRAINT "DiscordAccountCollection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordToken" ADD CONSTRAINT "DiscordToken_discordAccountId_fkey" FOREIGN KEY ("discordAccountId") REFERENCES "DiscordAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscordAccountToDiscordAccountCollection" ADD CONSTRAINT "_DiscordAccountToDiscordAccountCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscordAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscordAccountToDiscordAccountCollection" ADD CONSTRAINT "_DiscordAccountToDiscordAccountCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "DiscordAccountCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
