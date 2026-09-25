import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ElegantTemplate from "@/components/invitations/ElegantTemplate";

export default async function InvitationPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: { programItems: true, storyMilestones: true, notes: true, guests: true, photos: true },
  });

  if (!invitation) {
    notFound();
  }

  return (
    <div>
      <div className="bg-[#c6a15b] text-[#1c1b29] text-center text-sm py-2 px-4">
        {invitation.isPublished
          ? "This invitation is live and shareable."
          : "Preview — this invitation is not live yet. Confirm payment via WhatsApp to activate it."}
      </div>
      <ElegantTemplate
        invitation={{
          id: invitation.id,
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
          guests: invitation.guests,
          photos: invitation.photos,
        }}
      />
    </div>
  );
}