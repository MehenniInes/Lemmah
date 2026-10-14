"use client";

import { useEffect } from "react";

/**
 * Fires window.location.href once on mount, after a short delay
 * so the page has a chance to paint first.
 * If the browser blocks it, the parent page still shows a fallback button.
 */
export default function AutoRedirect({ href }: { href: string }) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      window.location.href = href;
    }, 500);
    return () => window.clearTimeout(t);
  }, [href]);

  return null;
}