"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "نسخ",
  copiedLabel = "تم النسخ ✓",
  className = "",
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {copied ? copiedLabel : label}
    </button>
  );
}