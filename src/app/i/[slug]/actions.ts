"use server";

import { prisma } from "@/lib/prisma";

export async function submitRsvp(formData: FormData) {
  const invitationId = formData.get("invitationId") as string;
  const name = formData.get("name") as string;
  const attendance = formData.get("attendance") as "COMING" | "NOT_COMING" | "MAYBE";
  const companions = Number(formData.get("companions") || 0);
  const message = formData.get("message") as string;

  if (!invitationId || !name || !attendance) {
    throw new Error("Missing required RSVP fields");
  }

  await prisma.guest.create({
    data: {
      invitationId,
      name,
      attendance,
      companions,
      message: message || null,
    },
  });
}