import { notFound } from "next/navigation";
import { getInvitationData } from "@/lib/invitation";
import { getTemplate } from "@/templates";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await getInvitationData(slug);
  if (!invitation) notFound();

  const template = getTemplate(invitation.templateKey);
  if (!template) notFound();

  const { Component } = template;
  return <Component invitation={invitation} />;
}