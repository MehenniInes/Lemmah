import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ElegantTemplate from "../../../components/invitations/ElegantTemplate";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
         include: { programItems: true, storyMilestones: true, notes: true, guests: true, photos: true },
  });

  if (!invitation || !invitation.isPublished) {
    notFound();
  }

  return (
        <ElegantTemplate
      invitation={{
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        weddingDate: invitation.weddingDate,
        weddingTime: invitation.weddingTime,
        venue: invitation.venueName,
        address: invitation.venueAddress,
        message: invitation.invitationText,
        programItems: invitation.programItems,
        storyMilestones: invitation.storyMilestones,
        notes: invitation.notes,
        venueCity: invitation.venueCity,
        venueAddress: invitation.venueAddress,
        dressCodeIntro: invitation.dressCodeIntro,
        dressCodeForHer: invitation.dressCodeForHer,
        dressCodeForHim: invitation.dressCodeForHim,
        duaText: invitation.duaText,
        groomFamilyLabel: invitation.groomFamilyLabel,
        groomFamilyNames: invitation.groomFamilyNames,
        brideFamilyLabel: invitation.brideFamilyLabel,
        brideFamilyNames: invitation.brideFamilyNames,
        closingText: invitation.closingText,
        contactButtonText: invitation.contactButtonText,
        contactName: invitation.contactName,
        contactWhatsapp: invitation.contactWhatsapp,
        adultsOnlyEnabled: invitation.adultsOnlyEnabled,
        id: invitation.id,
        guests: invitation.guests,
        photos: invitation.photos,
       
    }}

    />
  );
}