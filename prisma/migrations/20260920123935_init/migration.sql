-- CreateEnum
CREATE TYPE "Attendance" AS ENUM ('COMING', 'NOT_COMING', 'MAYBE', 'PENDING');

-- CreateEnum
CREATE TYPE "OccasionType" AS ENUM ('WEDDING', 'HENNA', 'NIKAH', 'ENGAGEMENT', 'BIRTHDAY', 'NEW_BABY');

-- CreateEnum
CREATE TYPE "PackageTier" AS ENUM ('BASIC', 'COMPLETE', 'ROYAL');

-- CreateEnum
CREATE TYPE "MusicSource" AS ENUM ('UPLOAD', 'YOUTUBE');

-- CreateEnum
CREATE TYPE "PhotoRole" AS ENUM ('COUPLE', 'VENUE', 'BACKGROUND', 'MEMORY');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "countryCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "controlTokenHash" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "packageTier" "PackageTier" NOT NULL DEFAULT 'BASIC',
    "occasionType" "OccasionType" NOT NULL DEFAULT 'WEDDING',
    "language" TEXT NOT NULL DEFAULT 'ar',
    "groomName" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "nameOrder" TEXT NOT NULL DEFAULT 'groom-top',
    "tagline" TEXT,
    "weddingDate" TIMESTAMP(3) NOT NULL,
    "weddingTime" TEXT,
    "invitationText" TEXT,
    "duaText" TEXT,
    "showSaveDateCard" BOOLEAN NOT NULL DEFAULT true,
    "groomFamilyLabel" TEXT,
    "groomFamilyNames" TEXT,
    "brideFamilyLabel" TEXT,
    "brideFamilyNames" TEXT,
    "venueName" TEXT NOT NULL,
    "venueCity" TEXT,
    "venueAddress" TEXT,
    "closingText" TEXT,
    "contactButtonText" TEXT,
    "contactName" TEXT,
    "contactWhatsapp" TEXT,
    "monogramLetters" TEXT,
    "monogramStyle" TEXT,
    "monogramColor" TEXT,
    "monogramSize" TEXT,
    "monogramShowAtStart" BOOLEAN NOT NULL DEFAULT false,
    "musicSource" "MusicSource",
    "musicUrl" TEXT,
    "autoScrollIntro" BOOLEAN NOT NULL DEFAULT false,
    "rsvpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "qrCheckInEnabled" BOOLEAN NOT NULL DEFAULT false,
    "guestPhotoAlbumEnabled" BOOLEAN NOT NULL DEFAULT false,
    "colorSchemeOverride" TEXT,
    "fontOverride" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramItem" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProgramItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attendance" "Attendance" NOT NULL DEFAULT 'PENDING',
    "companions" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "guestSlug" TEXT,
    "headcount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationPhoto" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "role" "PhotoRole" NOT NULL DEFAULT 'MEMORY',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvitationPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_slug_key" ON "Invitation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_controlTokenHash_key" ON "Invitation"("controlTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_guestSlug_key" ON "Guest"("guestSlug");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramItem" ADD CONSTRAINT "ProgramItem_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationPhoto" ADD CONSTRAINT "InvitationPhoto_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
