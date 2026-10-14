"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/templates";
import { generateOrderRef } from "@/lib/order";
import { rateLimit } from "@/lib/rate-limit";

const Schema = z.object({
  templateKey: z.string().min(1).max(64),
  packageTier: z.enum(["BASIC", "COMPLETE", "ROYAL"]),
  firstName: z.string().trim().min(1).max(60),
  whatsapp: z.string().trim().max(30),
});

async function getClientIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function createOrder(formData: FormData) {
  const raw = {
    templateKey: formData.get("templateKey"),
    packageTier: formData.get("packageTier"),
    firstName: formData.get("firstName"),
    whatsapp: formData.get("whatsapp") ?? "",
  };

  const safeKey =
    typeof raw.templateKey === "string" ? raw.templateKey : "";

  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/buy/${safeKey}?error=invalid`);
  }

  const { templateKey, packageTier, firstName, whatsapp } = parsed.data;

  const ip = await getClientIp();
  const rl = rateLimit(`order:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    redirect(`/buy/${templateKey}?error=rate`);
  }

  const template = getTemplate(templateKey);
  if (!template) redirect("/templates");

  const occasion =
    template.occasion === "ANY" ? "WEDDING" : template.occasion;

  // Collision-safe ref generation, up to 5 attempts
  let ref = "";
  let created = false;

  for (let attempt = 0; attempt < 5; attempt++) {
    ref = generateOrderRef();
    try {
      await prisma.order.create({
        data: {
          ref,
          templateKey,
          packageTier,
          occasionType: occasion,
          status: "PENDING_PAYMENT",
          draftData: {
            firstName,
            whatsapp: whatsapp.length > 0 ? whatsapp : null,
          },
        },
        select: { id: true },
      });
      created = true;
      break;
    } catch (e: unknown) {
      const code =
        typeof e === "object" && e !== null && "code" in e
          ? (e as { code: string }).code
          : null;
      if (code === "P2002") continue; // ref collision — retry
      throw e;
    }
  }

  if (!created) {
    redirect(`/buy/${templateKey}?error=collision`);
  }

  redirect(`/order/${ref}?created=1`);
}