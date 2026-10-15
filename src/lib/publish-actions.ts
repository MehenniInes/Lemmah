"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashEditCode, normalizeEditCodeInput } from "@/lib/edit-code";
import { rateLimit } from "@/lib/rate-limit";
import { invitationFormSchema, getPublishIssues } from "@/lib/invitation-schema";
import { computeExpiry } from "@/lib/expiry";

export type PublishResult =
  | {
      ok: true;
      slug: string;
      publicUrl: string;
      manageUrl?: string;
      editsRemaining: number;
    }
  | { ok: false; error: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function publishOrder(
  code: string,
  formData: unknown
): Promise<PublishResult> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  const ip = xff ? xff.split(",")[0].trim() : h.get("x-real-ip") ?? "unknown";
  const rl = rateLimit(`publish:${ip}`, 10, 60_000);
  if (!rl.allowed) return { ok: false, error: "rate" };

  const parsed = invitationFormSchema.safeParse(formData);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const issues = getPublishIssues(parsed.data);
  if (issues.length > 0) return { ok: false, error: issues[0] };

  const normalized = normalizeEditCodeInput(code);
  if (normalized.length !== 14) return { ok: false, error: "invalid" };
  const hash = hashEditCode(normalized);

  const order = await prisma.order.findUnique({
    where: { editCodeHash: hash },
    include: { invitation: true },
  });

  if (!order) return { ok: false, error: "notfound" };
  if (order.status !== "PAID") return { ok: false, error: "unpaid" };
  if (order.editsRemaining <= 0) return { ok: false, error: "exhausted" };
  if (!order.customerId) return { ok: false, error: "notfound" };
  if (
    order.invitation?.expiresAt &&
    order.invitation.expiresAt.getTime() < Date.now()
  ) {
    return { ok: false, error: "expired" };
  }

  const eventDate = new Date(parsed.data.eventDate);
  const { publicExpiry } = computeExpiry(eventDate);

  const isFirstPublish = !order.invitation;
  const baseSlug = slugify(
    `${parsed.data.brideName || "bride"}-${parsed.data.groomName || "groom"}`
  );
  let slug =
    order.invitation?.slug ?? `${baseSlug}-${crypto.randomBytes(2).toString("hex")}`;

  if (isFirstPublish) {
    for (let i = 0; i < 5; i++) {
      const clash = await prisma.invitation.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!clash) break;
      slug = `${baseSlug}-${crypto.randomBytes(2).toString("hex")}`;
    }
  }

  let plainManageToken: string | undefined;
  let manageTokenHash: string | undefined;
  if (isFirstPublish) {
    plainManageToken = crypto.randomBytes(32).toString("hex");
    manageTokenHash = crypto
      .createHash("sha256")
      .update(plainManageToken)
      .digest("hex");
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

  const result = await prisma.$transaction(async (tx) => {
    const decremented = await tx.order.updateMany({
      where: { id: order.id, editsRemaining: { gt: 0 } },
      data: {
        editsRemaining: { decrement: 1 },
        editCodeUsedAt: order.editCodeUsedAt ?? new Date(),
      },
    });
    if (decremented.count === 0) {
      throw new Error("exhausted");
    }

    if (isFirstPublish) {
      const inv = await tx.invitation.create({
        data: {
          slug,
          customerId: order.customerId!,
          manageTokenHash: manageTokenHash!,
          templateKey: order.templateKey,
          packageTier: order.packageTier,
          occasionType: order.occasionType,
          language: "ar",
          groomName: parsed.data.groomName,
          brideName: parsed.data.brideName,
          nameOrder: parsed.data.nameOrder,
          tagline: parsed.data.tagline,
          eventDate,
          weddingTime: parsed.data.weddingTime,
          invitationText: parsed.data.message,
          duaText: parsed.data.duaText,
          closingText: parsed.data.closingText,
          groomFamilyLabel: parsed.data.groomFamilyLabel,
          groomFamilyNames: parsed.data.groomFamilyNames,
          brideFamilyLabel: parsed.data.brideFamilyLabel,
          brideFamilyNames: parsed.data.brideFamilyNames,
          venueName: parsed.data.venue,
          venueCity: parsed.data.venueCity,
          venueAddress: parsed.data.venueAddress,
          dressCodeIntro: parsed.data.dressCodeIntro,
          dressCodeForHer: parsed.data.dressCodeForHer,
          dressCodeForHim: parsed.data.dressCodeForHim,
          adultsOnlyEnabled: parsed.data.adultsOnlyEnabled,
          contactButtonText: parsed.data.contactButtonText,
          contactName: parsed.data.contactName,
          contactWhatsapp: parsed.data.contactWhatsapp,
          musicSource: parsed.data.musicSource,
          musicUrl: parsed.data.musicUrl,
          status: "PUBLISHED",
          publishedAt: new Date(),
          expiresAt: publicExpiry,
          programItems: {
            create: parsed.data.programItems.map((p, i) => ({
              time: p.time,
              title: p.title,
              order: i,
            })),
          },
          storyMilestones: {
            create: parsed.data.storyMilestones.map((s, i) => ({
              year: s.year,
              title: s.title,
              description: s.description ?? null,
              order: i,
            })),
          },
          notes: {
            create: parsed.data.notes.map((n, i) => ({
              text: n.text,
              isFeatured: n.isFeatured,
              order: i,
            })),
          },
          photos: {
            create: parsed.data.photos.map((p, i) => ({
              url: p.url,
              role: p.role,
              position: i,
            })),
          },
        },
        select: { id: true, slug: true },
      });

      await tx.order.update({
        where: { id: order.id },
        data: { invitationId: inv.id },
      });

      return { slug: inv.slug };
    }

    await tx.invitation.update({
      where: { id: order.invitation!.id },
      data: {
        groomName: parsed.data.groomName,
        brideName: parsed.data.brideName,
        nameOrder: parsed.data.nameOrder,
        tagline: parsed.data.tagline,
        eventDate,
        weddingTime: parsed.data.weddingTime,
        invitationText: parsed.data.message,
        duaText: parsed.data.duaText,
        closingText: parsed.data.closingText,
        groomFamilyLabel: parsed.data.groomFamilyLabel,
        groomFamilyNames: parsed.data.groomFamilyNames,
        brideFamilyLabel: parsed.data.brideFamilyLabel,
        brideFamilyNames: parsed.data.brideFamilyNames,
        venueName: parsed.data.venue,
        venueCity: parsed.data.venueCity,
        venueAddress: parsed.data.venueAddress,
        dressCodeIntro: parsed.data.dressCodeIntro,
        dressCodeForHer: parsed.data.dressCodeForHer,
        dressCodeForHim: parsed.data.dressCodeForHim,
        adultsOnlyEnabled: parsed.data.adultsOnlyEnabled,
        contactButtonText: parsed.data.contactButtonText,
        contactName: parsed.data.contactName,
        contactWhatsapp: parsed.data.contactWhatsapp,
        musicSource: parsed.data.musicSource,
        musicUrl: parsed.data.musicUrl,
        status: "PUBLISHED",
        publishedAt: new Date(),
        expiresAt: publicExpiry,
        programItems: {
          deleteMany: {},
          create: parsed.data.programItems.map((p, i) => ({
            time: p.time,
            title: p.title,
            order: i,
          })),
        },
        storyMilestones: {
          deleteMany: {},
          create: parsed.data.storyMilestones.map((s, i) => ({
            year: s.year,
            title: s.title,
            description: s.description ?? null,
            order: i,
          })),
        },
        notes: {
          deleteMany: {},
          create: parsed.data.notes.map((n, i) => ({
            text: n.text,
            isFeatured: n.isFeatured,
            order: i,
          })),
        },
        photos: {
          deleteMany: {},
          create: parsed.data.photos.map((p, i) => ({
            url: p.url,
            role: p.role,
            position: i,
          })),
        },
      },
    });

    return { slug: order.invitation!.slug };
  });

  return {
    ok: true,
    slug: result.slug,
    publicUrl: `${siteUrl}/i/${result.slug}`,
    manageUrl: plainManageToken
      ? `${siteUrl}/manage/${plainManageToken}`
      : undefined,
    editsRemaining: order.editsRemaining - 1,
  };
}