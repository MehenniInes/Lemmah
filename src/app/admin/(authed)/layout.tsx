import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin-session";
import { logoutAction } from "@/app/admin/login/actions";

export default async function AdminAuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  return (
    <div dir="rtl" className="min-h-screen bg-[#1c1b29] text-[#f6efe6]">
      <header className="border-b border-[#c6a15b]/20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/admin/orders"
            className="font-display text-lg text-[#c6a15b]"
          >
            لوحة الإدارة
          </Link>
          <form action={logoutAction}>
            <button className="text-xs text-[#f6efe6]/60 underline-offset-4 hover:underline">
              خروج
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}