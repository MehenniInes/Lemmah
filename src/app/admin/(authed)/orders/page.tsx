import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/templates";
import { getPackage } from "@/lib/packages";
import CopyButton from "@/components/CopyButton";
import {
  markOrderPaid,
  regenerateEditCode,
  regenerateManageToken,
} from "./actions";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

type Tab = "pending" | "paid" | "published" | "expired";

function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    q?: string;
    reveal?: string;
    revealManage?: string;
    err?: string;
  }>;
}) {
  const sp = await searchParams;
  const tab: Tab = (
    ["pending", "paid", "published", "expired"].includes(sp.tab ?? "")
      ? sp.tab
      : "pending"
  ) as Tab;
  const q = (sp.q ?? "").trim().toLowerCase();

  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      invitation: true,
      customer: true,
    },
    take: 200,
  });

  // Categorise
  const pending = allOrders.filter((o) => o.status === "PENDING_PAYMENT");
  const paid = allOrders.filter(
    (o) =>
      o.status === "PAID" &&
      (!o.invitation || o.invitation.status === "DRAFT")
  );
  const published = allOrders.filter(
    (o) => o.invitation?.status === "PUBLISHED"
  );
  const expired = allOrders.filter((o) => o.invitation?.status === "EXPIRED");

  const tabMap: Record<Tab, typeof allOrders> = {
    pending,
    paid,
    published,
    expired,
  };

  const filtered = q
    ? tabMap[tab].filter((o) => {
        const draft = (o.draftData ?? {}) as { firstName?: unknown };
        const draftName =
          typeof draft.firstName === "string" ? draft.firstName : "";
        const customerName = o.customer?.name ?? "";
        return (
          o.ref.toLowerCase().includes(q) ||
          draftName.toLowerCase().includes(q) ||
          customerName.toLowerCase().includes(q)
        );
      })
    : tabMap[tab];

  // Reveal banners from cookies
  const jar = await cookies();
  let revealed: { ref: string; code: string } | null = null;
  let revealedManage: { ref: string; token: string } | null = null;

  const rawCode = jar.get("lm_reveal")?.value;
  if (rawCode) {
    try {
      const parsed = JSON.parse(rawCode);
      if (parsed?.ref === sp.reveal && typeof parsed.code === "string") {
        revealed = { ref: parsed.ref, code: parsed.code };
      }
    } catch {
      /* ignore */
    }
  }

  const rawManage = jar.get("lm_reveal_manage")?.value;
  if (rawManage) {
    try {
      const parsed = JSON.parse(rawManage);
      if (
        parsed?.ref === sp.revealManage &&
        typeof parsed.token === "string"
      ) {
        revealedManage = { ref: parsed.ref, token: parsed.token };
      }
    } catch {
      /* ignore */
    }
  }

  const err = sp.err;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl">الطلبات</h1>

      {/* Reveal banner — edit code */}
      {revealed && (
        <section className="mt-6 rounded-2xl border border-[#c6a15b] bg-[#2c2a3d] p-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#c6a15b]">
            رمز التعديل للطلب {revealed.ref}
          </p>
          <p
            dir="ltr"
            className="mt-4 select-all font-display text-3xl tracking-[0.2em] text-[#f6efe6] sm:text-4xl"
          >
            {revealed.code}
          </p>
          <p className="mt-3 text-xs leading-6 text-[#f6efe6]/60">
            ⚠️ يظهر مرة واحدة فقط. انسخوه وأرسلوه للعميل الآن.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <CopyButton
              text={revealed.code}
              label="نسخ الرمز"
              className="rounded-full border border-[#c6a15b]/50 px-4 py-2 text-xs text-[#c6a15b] hover:bg-[#c6a15b]/10"
            />
            <CopyButton
              text={`مرحبًا، تم تأكيد دفعكم على فرحة.\n\nرابط تعديل دعوتكم:\n${SITE_URL}/edit/${revealed.code}\n\nالمرجع: ${revealed.ref}`}
              label="نسخ رسالة واتساب"
              className="rounded-full bg-[#6e2a3d] px-4 py-2 text-xs text-[#f6efe6] hover:brightness-110"
            />
            <a
              href={whatsappShareUrl(
                `مرحبًا، تم تأكيد دفعكم على فرحة.\n\nرابط تعديل دعوتكم:\n${SITE_URL}/edit/${revealed.code}\n\nالمرجع: ${revealed.ref}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#c6a15b]/50 px-4 py-2 text-xs text-[#c6a15b] hover:bg-[#c6a15b]/10"
            >
              فتح واتساب
            </a>
          </div>
        </section>
      )}

      {/* Reveal banner — manage link */}
      {revealedManage && (
        <section className="mt-6 rounded-2xl border border-[#c6a15b] bg-[#2c2a3d] p-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#c6a15b]">
            رابط الإدارة الجديد للطلب {revealedManage.ref}
          </p>
          <code
            dir="ltr"
            className="mt-3 block break-all rounded-lg bg-[#1c1b29] px-3 py-2 text-[11px] text-[#c6a15b]"
          >
            {SITE_URL}/manage/{revealedManage.token}
          </code>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton
              text={`${SITE_URL}/manage/${revealedManage.token}`}
              label="نسخ الرابط"
              className="rounded-full border border-[#c6a15b]/50 px-4 py-2 text-xs text-[#c6a15b] hover:bg-[#c6a15b]/10"
            />
          </div>
          <p className="mt-3 text-xs text-[#f6efe6]/60">
            الرابط القديم لم يعد يعمل.
          </p>
        </section>
      )}

      {err && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-[#6e2a3d]/60 bg-[#6e2a3d]/25 px-4 py-3 text-sm text-[#e3c383]"
        >
          {err === "notfound"
            ? "الطلب غير موجود."
            : err === "already"
              ? "هذا الطلب مدفوع بالفعل."
              : err === "collision"
                ? "تعذّر توليد رمز فريد."
                : err === "invalid"
                  ? "بيانات غير مكتملة."
                  : err === "codeused"
                    ? "الرمز مستخدم — لا يمكن إعادة توليده."
                    : err === "noinvitation"
                      ? "لا توجد دعوة منشورة لهذا الطلب."
                      : "حدث خطأ."}
        </div>
      )}

      {/* Tabs */}
      <nav
        aria-label="تصنيفات الطلبات"
        className="mt-8 flex flex-wrap gap-2"
      >
        {(
          [
            ["pending", "قيد الدفع", pending.length],
            ["paid", "مدفوعة", paid.length],
            ["published", "منشورة", published.length],
            ["expired", "منتهية", expired.length],
          ] as [Tab, string, number][]
        ).map(([key, label, count]) => {
          const active = tab === key;
          const params = new URLSearchParams();
          params.set("tab", key);
          if (q) params.set("q", q);
          return (
            <Link
              key={key}
              href={`/admin/orders?${params.toString()}`}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition ${
                active
                  ? "border-[#c6a15b] bg-[#c6a15b] text-[#1c1b29]"
                  : "border-[#c6a15b]/40 text-[#c6a15b] hover:bg-[#c6a15b]/10"
              }`}
            >
              {label}
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
                {count}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Search */}
      <form
        action="/admin/orders"
        method="get"
        className="mt-4 flex gap-2"
      >
        <input type="hidden" name="tab" value={tab} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="ابحث بالمرجع أو الاسم…"
          className="flex-1 rounded-xl border border-[#c6a15b]/30 bg-[#2c2a3d] px-4 py-3 text-sm text-[#f6efe6] outline-none focus:border-[#c6a15b]"
        />
        <button
          type="submit"
          className="rounded-xl border border-[#c6a15b]/50 px-5 text-sm text-[#c6a15b] hover:bg-[#c6a15b]/10"
        >
          بحث
        </button>
      </form>

      {/* List */}
      <section className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-[#f6efe6]/50">
            {q ? "لا نتائج مطابقة." : "لا طلبات في هذه القائمة."}
          </p>
        )}

        {filtered.map((o) => {
          const t = getTemplate(o.templateKey);
          const p = getPackage(o.packageTier);
          const draft = (o.draftData ?? {}) as { firstName?: unknown };
          const draftName =
            typeof draft.firstName === "string" ? draft.firstName : "";
          const displayName = o.customer?.name ?? draftName ?? "—";

          return (
            <article
              key={o.id}
              className="rounded-2xl border border-[#c6a15b]/25 bg-[#2c2a3d] p-4"
            >
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-lg text-[#e3c383]">
                  <span dir="ltr">{o.ref}</span>
                  {" — "}
                  {displayName}
                </p>
                <p className="text-xs text-[#f6efe6]/50">
                  {new Date(o.createdAt).toLocaleDateString("en-GB")}
                </p>
              </header>

              <p className="mt-1 text-xs text-[#f6efe6]/60">
                {t?.name ?? o.templateKey} · {p?.name ?? o.packageTier}
                {o.status === "PAID" && (
                  <>
                    {" · "}
                    <span className="text-[#c6a15b]">
                      publishes left: {o.editsRemaining}
                    </span>
                  </>
                )}
              </p>

              {/* Actions per tab */}
              {tab === "pending" && (
                <form
                  action={markOrderPaid}
                  className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <input type="hidden" name="ref" value={o.ref} />
                  <input
                    name="customerName"
                    required
                    placeholder="اسم العميل"
                    defaultValue={draftName}
                    className="rounded-xl border border-[#c6a15b]/30 bg-[#1c1b29] px-3 py-2 text-sm text-[#f6efe6] outline-none focus:border-[#c6a15b]"
                  />
                  <input
                    name="customerWhatsapp"
                    placeholder="واتساب (اختياري)"
                    dir="ltr"
                    defaultValue={
                      typeof (o.draftData as { whatsapp?: unknown })?.whatsapp === "string"
                        ? String((o.draftData as { whatsapp?: string }).whatsapp)
                        : ""
                    }
                    className="rounded-xl border border-[#c6a15b]/30 bg-[#1c1b29] px-3 py-2 text-sm text-[#f6efe6] outline-none focus:border-[#c6a15b]"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#6e2a3d] px-4 py-2 text-sm text-[#f6efe6] hover:brightness-110"
                  >
                    تأكيد الدفع
                  </button>
                </form>
              )}

              {tab === "paid" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={regenerateEditCode}>
                    <input type="hidden" name="ref" value={o.ref} />
                    <button
                      type="submit"
                      disabled={Boolean(o.editCodeUsedAt)}
                      className="rounded-full border border-[#c6a15b]/50 px-4 py-2 text-xs text-[#c6a15b] transition hover:bg-[#c6a15b]/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      إعادة توليد رمز التعديل
                    </button>
                  </form>
                  <Link
                    href={`/edit/${o.ref}`}
                    className="rounded-full border border-[#c6a15b]/30 px-4 py-2 text-xs text-[#f6efe6]/60"
                  >
                    معاينة
                  </Link>
                </div>
              )}

              {(tab === "published" || tab === "expired") && o.invitation && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/i/${o.invitation.slug}`}
                    target="_blank"
                    className="rounded-full border border-[#c6a15b]/50 px-4 py-2 text-xs text-[#c6a15b] hover:bg-[#c6a15b]/10"
                  >
                    عرض الدعوة
                  </Link>
                  <form action={regenerateManageToken}>
                    <input type="hidden" name="ref" value={o.ref} />
                    <button
                      type="submit"
                      className="rounded-full border border-[#c6a15b]/50 px-4 py-2 text-xs text-[#c6a15b] hover:bg-[#c6a15b]/10"
                    >
                      إعادة توليد رابط الإدارة
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}