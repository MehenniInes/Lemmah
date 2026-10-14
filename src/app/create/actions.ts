"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { computeExpiry } from "@/lib/expiry";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeAlgerianWhatsapp(raw: string): string | null {
  const cleaned = raw.replace(/[\s-]/g, "").replace(/^\+/, "");
  const match = cleaned.match(/^(?:213|0)?([567]\d{8})$/);
  if (!match) return null;
  return "213" + match[1];
}

async function uploadToCloudinary(file: File, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: `lemmah/${folder}` }, (error, result) => {
        if (error || !result) {
          reject(error);
          return;
        }
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}

export async function createInvitation(formData: FormData) {
  const groomName = formData.get("groomName") as string;
  const brideName = formData.get("brideName") as string;
  const weddingDate = formData.get("weddingDate") as string;
  const weddingTime = formData.get("weddingTime") as string;
  const venueName = formData.get("venueName") as string;
  const venueCity = formData.get("venueCity") as string;
  const venueAddress = formData.get("venueAddress") as string;
  const invitationText = formData.get("invitationText") as string;
  const duaText = formData.get("duaText") as string;
  const closingText = formData.get("closingText") as string;
  const contactName = formData.get("contactName") as string;
  const contactWhatsapp = formData.get("contactWhatsapp") as string;
  const dressCodeIntro = formData.get("dressCodeIntro") as string;
  const dressCodeForHer = formData.get("dressCodeForHer") as string;
  const dressCodeForHim = formData.get("dressCodeForHim") as string;
  const adultsOnlyEnabled = formData.get("adultsOnlyEnabled") === "on";

  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const customerWhatsapp = formData.get("customerWhatsapp") as string;

  const normalizedCustomerWhatsapp = normalizeAlgerianWhatsapp(customerWhatsapp);
  if (!normalizedCustomerWhatsapp) {
    throw new Error("Please enter a valid Algerian WhatsApp number (e.g. 0555123456)");
  }

  const normalizedContactWhatsapp = contactWhatsapp
    ? normalizeAlgerianWhatsapp(contactWhatsapp)
    : null;
  if (contactWhatsapp && !normalizedContactWhatsapp) {
    throw new Error("Please enter a valid Algerian WhatsApp number for the RSVP contact");
  }

  if (!customerName || !customerEmail || !normalizedCustomerWhatsapp) {
    throw new Error("Missing required fields");
  }

  const programRaw = (formData.get("programItems") as string) || "";
  const programLines = programRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [time, title] = line.split("|").map((s) => s.trim());
      return { time: time || "", title: title || "", order: i };
    });

  const notesRaw = (formData.get("notes") as string) || "";
  const noteLines = notesRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((text, i) => ({ text, order: i }));

  const storyRaw = (formData.get("storyMilestones") as string) || "";
  const storyLines = storyRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [year, title, description] = line.split("|").map((s) => s.trim());
      return { year: year || "", title: title || "", description: description || null, order: i };
    });

  // Upload images — couple photo (single) and memory gallery (multiple)
  const couplePhotoFile = formData.get("couplePhoto") as File;
  const couplePhotoUrl = await uploadToCloudinary(couplePhotoFile, "couple");

  const memoryFiles = formData.getAll("memoryPhotos") as File[];
  const memoryUrls: string[] = [];
  for (const file of memoryFiles) {
    const url = await uploadToCloudinary(file, "memories");
    if (url) memoryUrls.push(url);
  }

  const photoRecords = [
    ...(couplePhotoUrl ? [{ url: couplePhotoUrl, role: "COUPLE" as const, position: 0 }] : []),
    ...memoryUrls.map((url, i) => ({ url, role: "MEMORY" as const, position: i })),
  ];

  const customer = await prisma.customer.create({
    data: { name: customerName, email: customerEmail, whatsapp: normalizedCustomerWhatsapp },
  });

  const baseSlug = slugify(`${brideName || "bride"}-${groomName || "groom"}`);
  const slug = `${baseSlug}-${crypto.randomBytes(2).toString("hex")}`;

  const manageToken = crypto.randomBytes(24).toString("hex");
  const manageTokenHash = crypto.createHash("sha256").update(manageToken).digest("hex");

   const eventDateValue = weddingDate
    ? new Date(weddingDate)
    : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  const { publicExpiry: expiresAt } = computeExpiry(eventDateValue);

  const invitation = await prisma.invitation.create({
    data: {
      slug,
      customerId: customer.id,
      manageTokenHash,
      templateKey: "elegant",
      groomName: groomName || "TBD",
      brideName: brideName || "TBD",
      eventDate: eventDateValue,
      weddingTime: weddingTime || null,
      venueName: venueName || "TBD",
      venueCity: venueCity || null,
      venueAddress: venueAddress || null,
      invitationText: invitationText || null,
      duaText: duaText || null,
      closingText: closingText || null,
      contactName: contactName || null,
      contactWhatsapp: normalizedContactWhatsapp,
      dressCodeIntro: dressCodeIntro || null,
      dressCodeForHer: dressCodeForHer || null,
      dressCodeForHim: dressCodeForHim || null,
      adultsOnlyEnabled,
      status: "DRAFT",
      expiresAt,
      programItems: { create: programLines },
      notes: { create: noteLines },
      storyMilestones: { create: storyLines },
      photos: { create: photoRecords },
    },
  });

  redirect(`/i/${invitation.slug}/preview`);
}