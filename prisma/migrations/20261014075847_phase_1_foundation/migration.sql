/*
  Warnings:

  - You are about to drop the column `controlTokenHash` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `weddingDate` on the `Invitation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[manageTokenHash]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventDate` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manageTokenHash` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'CANCELLED');

-- DropIndex
DROP INDEX "Invitation_controlTokenHash_key";

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "controlTokenHash",
DROP COLUMN "isPublished",
DROP COLUMN "weddingDate",
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "manageTokenHash" TEXT NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "packageTier" "PackageTier" NOT NULL DEFAULT 'BASIC',
    "occasionType" "OccasionType" NOT NULL DEFAULT 'WEDDING',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "customerId" TEXT,
    "editCodeHash" TEXT,
    "editCodeUsedAt" TIMESTAMP(3),
    "draftData" JSONB,
    "publishesRemaining" INTEGER NOT NULL DEFAULT 3,
    "invitationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_ref_key" ON "Order"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "Order_editCodeHash_key" ON "Order"("editCodeHash");

-- CreateIndex
CREATE UNIQUE INDEX "Order_invitationId_key" ON "Order"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_manageTokenHash_key" ON "Invitation"("manageTokenHash");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
