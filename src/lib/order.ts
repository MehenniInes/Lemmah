import crypto from "node:crypto";

/**
 * Order reference generator.
 * Alphabet excludes 0/O/1/I to avoid ambiguity when read aloud or copied by hand.
 */
const SAFE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSuffix(): string {
  const bytes = crypto.randomBytes(4);
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += SAFE_ALPHABET[bytes[i] % SAFE_ALPHABET.length];
  }
  return out;
}

export function generateOrderRef(): string {
  return "LM-" + randomSuffix();
}

export interface OrderWhatsAppInput {
  ref: string;
  templateName: string;
  packageName: string;
  firstName: string;
}

export function buildOrderWhatsAppText(input: OrderWhatsAppInput): string {
  return [
    "مرحبًا، أرغب في تأكيد دفع دعوة رقمية على فرحة.",
    "",
    `📋 المرجع: ${input.ref}`,
    `🎨 القالب: ${input.templateName}`,
    `📦 الباقة: ${input.packageName}`,
    `👤 الاسم: ${input.firstName}`,
    "",
    "أرجو موافاتي برابط التعديل بعد تأكيد الدفع. شكرًا!",
  ].join("\n");
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}