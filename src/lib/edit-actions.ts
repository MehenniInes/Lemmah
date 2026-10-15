"use server";

import { headers } from "next/headers";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { hashEditCode, normalizeEditCodeInput } from "@/lib/edit-code";
import { rateLimit } from "@/lib/rate-limit";
import { invitationFormSchema } from "@/lib/invitation-schema";

export type SaveDraftResult =
  | { ok: true }
  | { ok: false; error: string };

async function getIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

/**
 * Draft autosave. Does NOT consume an edit — drafts are unlimited.
 * Every call re-checks the code hash and order status server-side.
 */
export async function saveDraft(
  code: string,
  data: unknown
): Promise<SaveDraftResult> {
  const ip = await getIp();
  const rl = rateLimit(`draft:${ip}`, 60, 60_000);
  if (!rl.allowed) return { ok: false, error: "rate" };

  const parsed = invitationFormSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const normalized = normalizeEditCodeInput(code);
  if (normalized.length !== 14) return { ok: false, error: "invalid" };
  const hash = hashEditCode(normalized);

  const order = await prisma.order.findUnique({
    where: { editCodeHash: hash },
    select: {
      id: true,
      status: true,
      editsRemaining: true,
      invitation: { select: { expiresAt: true } },
    },
  });

  if (!order) return { ok: false, error: "notfound" };
  if (order.status !== "PAID") return { ok: false, error: "unpaid" };
  if (order.editsRemaining <= 0) return { ok: false, error: "readonly" };
  if (
    order.invitation?.expiresAt &&
    order.invitation.expiresAt.getTime() < Date.now()
  ) {
    return { ok: false, error: "expired" };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { draftData: parsed.data as object },
  });

  return { ok: true };
}

// ─── Photo upload ────────────────────────────────────────
const MAX_FILES_PER_REQUEST = 10;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export type UploadPhotosResult =
  | { ok: true; photos: { url: string }[] }
  | { ok: false; error: string };

export async function uploadPhotos(
  code: string,
  formData: FormData
): Promise<UploadPhotosResult> {
  const ip = await getIp();
  const rl = rateLimit(`upload:${ip}`, 20, 60_000);
  if (!rl.allowed) return { ok: false, error: "rate" };

  const normalized = normalizeEditCodeInput(code);
  if (normalized.length !== 14) return { ok: false, error: "invalid" };
  const hash = hashEditCode(normalized);

  const order = await prisma.order.findUnique({
    where: { editCodeHash: hash },
    select: { status: true, editsRemaining: true },
  });
  if (!order) return { ok: false, error: "notfound" };
  if (order.status !== "PAID") return { ok: false, error: "unpaid" };
  if (order.editsRemaining <= 0) return { ok: false, error: "readonly" };

  const files = formData.getAll("file") as File[];
  if (files.length === 0) return { ok: false, error: "no_files" };
  if (files.length > MAX_FILES_PER_REQUEST) {
    return { ok: false, error: "too_many" };
  }

  const uploaded: { url: string }[] = [];
  const prefix = normalized.slice(0, 4).toLowerCase();

  for (const file of files) {
    if (!ACCEPTED_MIME.has(file.type)) {
      return { ok: false, error: "not_image" };
    }
    if (file.size > MAX_FILE_BYTES) {
      return { ok: false, error: "too_large" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const url = await new Promise<string | null>((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `lemmah/${prefix}`,
            resource_type: "image",
          },
          (err, result) => {
            if (err || !result) resolve(null);
            else resolve(result.secure_url);
          }
        )
        .end(buffer);
    });

    if (!url) return { ok: false, error: "upload_failed" };
    uploaded.push({ url });
  }

  return { ok: true, photos: uploaded };
}