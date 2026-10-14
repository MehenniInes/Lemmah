import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-session";
import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  if (await isAdminAuthed()) redirect("/admin/orders");
  const { err } = await searchParams;

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#1c1b29] px-4 text-[#f6efe6]"
    >
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-2xl border border-[#c6a15b]/30 bg-[#2c2a3d] p-8"
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#c6a15b]">
          لوحة الإدارة
        </p>
        <h1 className="mt-3 font-display text-2xl">دخول</h1>

        {err && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-[#6e2a3d]/60 bg-[#6e2a3d]/25 px-3 py-2 text-sm text-[#e3c383]"
          >
            {err === "rate"
              ? "محاولات كثيرة. حاول لاحقًا."
              : "كلمة المرور غير صحيحة."}
          </p>
        )}

        <label
          className="mt-6 block text-sm text-[#f6efe6]/70"
          htmlFor="password"
        >
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-[#c6a15b]/40 bg-[#1c1b29] px-4 py-3 text-base text-[#f6efe6] outline-none focus:border-[#c6a15b]"
        />
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-[#6e2a3d] px-6 py-3 text-sm text-[#f6efe6] transition hover:brightness-110"
        >
          دخول
        </button>
      </form>
    </div>
  );
}