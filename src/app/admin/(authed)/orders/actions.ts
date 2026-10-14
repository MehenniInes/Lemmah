"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-session";
import { generateEditCode, hashEditCode } from "@/lib/edit-code";

async function requireAuthed() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
}

// ─── Payment received ────────────────────────────────────
export async function markOrderPaid(formData: FormData) {
  await requireAuthed();

  const ref = formData.get("ref");
  const customerName = formData.get("customerName");
  const customerWhatsapp = formData.get("customerWhatsapp");

  if (
    typeof ref !== "string" ||
    typeof customerName !== "string" ||
    customerName.trim().length === 0
  ) {
    redirect("/admin/orders?err=invalid");
  }

  const whatsapp =
    typeof customerWhatsapp === "string" && customerWhatsapp.trim().length > 0
      ? customerWhatsapp.trim()
      : null;

  const order = await prisma.order.findUnique({ where: { ref } });
  if (!order) redirect("/admin/orders?err=notfound");
  if (order.status === "PAID") redirect("/admin/orders?err=already");

  // Generate a unique code (retry on hash collision).
  let plaintext = "";
  let hash = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    plaintext = generateEditCode();
    hash = hashEditCode(plaintext);
    const clash = await prisma.order.findUnique({
      where: { editCodeHash: hash },
      select: { id: true },
    });
    if (!clash) break;
    plaintext = "";
  }
  if (!plaintext) redirect("/admin/orders?err=collision");

  // Placeholder email — schema requires it.
  const placeholderEmail = whatsapp
    ? `${whatsapp.replace(/\D/g, "")}@placeholder.lemmah`
    : `${ref.toLowerCase()}@placeholder.lemmah`;

  await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        name: customerName.trim(),
        email: placeholderEmail,
        whatsapp,
      },
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        customerId: customer.id,
        editCodeHash: hash,
        editCodeUsedAt: null,
        status: "PAID",
        paidAt: new Date(),
      },
    });
  });

  // Reveal once via short-lived cookie.
  const jar = await cookies();
  jar.set(
    "lm_reveal",
    JSON.stringify({ ref, code: plaintext }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 300,
      path: "/",
    }
  );

  redirect(`/admin/orders?reveal=${ref}`);
}

// ─── Regenerate edit code ────────────────────────────────
export async function regenerateEditCode(formData: FormData) {
  await requireAuthed();

  const ref = formData.get("ref");
  if (typeof ref !== "string") redirect("/admin/orders");

  const order = await prisma.order.findUnique({ where: { ref } });
  if (!order) redirect("/admin/orders?err=notfound");
  if (order.editCodeUsedAt) redirect("/admin/orders?err=codeused");

  let plaintext = "";
  let hash = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    plaintext = generateEditCode();
    hash = hashEditCode(plaintext);
    const clash = await prisma.order.findUnique({
      where: { editCodeHash: hash },
      select: { id: true },
    });
    if (!clash) break;
    plaintext = "";
  }
  if (!plaintext) redirect("/admin/orders?err=collision");

  await prisma.order.update({
    where: { id: order.id },
    data: { editCodeHash: hash, editCodeUsedAt: null },
  });

  const jar = await cookies();
  jar.set(
    "lm_reveal",
    JSON.stringify({ ref, code: plaintext }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 300,
      path: "/",
    }
  );

  redirect(`/admin/orders?reveal=${ref}`);
}

// ─── Regenerate manage link ──────────────────────────────
export async function regenerateManageToken(formData: FormData) {
  await requireAuthed();

  const ref = formData.get("ref");
  if (typeof ref !== "string") redirect("/admin/orders");

  const order = await prisma.order.findUnique({
    where: { ref },
    include: { invitation: true },
  });
  if (!order || !order.invitation) redirect("/admin/orders?err=noinvitation");

  const token = crypto.randomBytes(24).toString("base64url");
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  await prisma.invitation.update({
    where: { id: order.invitation.id },
    data: { manageTokenHash: hash },
  });

  const jar = await cookies();
  jar.set(
    "lm_reveal_manage",
    JSON.stringify({ ref, token }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 300,
      path: "/",
    }
  );

  redirect(`/admin/orders?revealManage=${ref}`);
}