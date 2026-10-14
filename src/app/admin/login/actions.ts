"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/admin-session";
import { rateLimit } from "@/lib/rate-limit";

async function getIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string") redirect("/admin/login?err=bad");

  const ip = await getIp();
  const rl = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!rl.allowed) redirect("/admin/login?err=rate");

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    redirect("/admin/login?err=bad");
  }

  await setSessionCookie();
  redirect("/admin/orders");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}