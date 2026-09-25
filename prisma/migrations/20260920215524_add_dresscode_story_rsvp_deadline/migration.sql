-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "adultsOnlyEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dressCodeForHer" TEXT,
ADD COLUMN     "dressCodeForHim" TEXT,
ADD COLUMN     "dressCodeIntro" TEXT,
ADD COLUMN     "hashtag" TEXT,
ADD COLUMN     "rsvpDeadline" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "StoryMilestone" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StoryMilestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StoryMilestone" ADD CONSTRAINT "StoryMilestone_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
