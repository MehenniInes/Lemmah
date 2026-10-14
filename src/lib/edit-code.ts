import crypto from "node:crypto";

/**
 * Edit-code system.
 *
 * Format:  xxxx-xxxx-xxxx (lowercase)
 * Alphabet: excludes ambiguous characters (i, l, o, 0, 1)
 * Storage:  only the SHA-256 hash is persisted. Plaintext shown ONCE.
 */

const SAFE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

function randomGroup(): string {
  const bytes = crypto.randomBytes(4);
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += SAFE_ALPHABET[bytes[i] % SAFE_ALPHABET.length];
  }
  return out;
}

export function generateEditCode(): string {
  return `${randomGroup()}-${randomGroup()}-${randomGroup()}`;
}

export function hashEditCode(code: string): string {
  const normalized = code.toLowerCase().replace(/-/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export function normalizeEditCodeInput(raw: string): string {
  const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12);
  return [clean.slice(0, 4), clean.slice(4, 8), clean.slice(8, 12)]
    .filter(Boolean)
    .join("-");
}