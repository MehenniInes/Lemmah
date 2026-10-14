import { notFound } from "next/navigation";
import { getPreviewData } from "@/lib/invitation";
import { getTemplate } from "@/templates";

export default async function InvitationPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await getPreviewData(slug);
  if (!invitation) notFound();

  const template = getTemplate(invitation.templateKey);
  if (!template) notFound();

  const isLive = invitation.status === "PUBLISHED";
  const { Component } = template;

  return (
    <div>
      <div className="bg-[#c6a15b] text-[#1c1b29] text-center text-sm py-2 px-4">
        {isLive
          ? "This invitation is live and shareable."
          : "Preview — this invitation is not live yet. Confirm payment via WhatsApp to activate it."}
      </div>
      <Component invitation={invitation} />
    </div>
  );
}