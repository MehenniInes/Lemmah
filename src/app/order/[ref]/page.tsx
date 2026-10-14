import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/templates";
import { getPackage } from "@/lib/packages";
import { buildOrderWhatsAppText, buildWhatsAppUrl } from "@/lib/order";
import AutoRedirect from "@/components/AutoRedirect";

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? "";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { ref } = await params;
  const { created } = await searchParams;

  const order = await prisma.order.findUnique({ where: { ref } });
  if (!order) notFound();

  const template = getTemplate(order.templateKey);
  const pkg = getPackage(order.packageTier);

  const draft = (order.draftData ?? {}) as { firstName?: unknown };
  const firstName =
    typeof draft.firstName === "string" ? draft.firstName : "—";

  const waText =
    template && pkg
      ? buildOrderWhatsAppText({
          ref: order.ref,
          templateName: template.name,
          packageName: pkg.name,
          firstName,
        })
      : `مرحبًا، أرغب في تأكيد دفع دعوة رقمية. المرجع: ${order.ref}`;

  const waUrl = WHATSAPP_NUMBER
    ? buildWhatsAppUrl(WHATSAPP_NUMBER, waText)
    : "#";

  const justCreated = created === "1";

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF7F9] text-[#231F20]">
      {justCreated && WHATSAPP_NUMBER && <AutoRedirect href={waUrl} />}

      <div className="mx-auto max-w-xl px-6 py-12 sm:py-16">
        <header className="text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#9A7B1C]">
            طلبك محفوظ
          </p>
          <h1 className="mt-3 font-display text-3xl text-[#231F20] sm:text-4xl">
            المرجع: <span dir="ltr">{order.ref}</span>
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#6b5b66]">
            سنؤكد دفعكم عبر واتساب خلال دقائق، ثم نصدر لكم رابط التعديل الخاص
            بدعوتكم.
          </p>
        </header>

        <dl className="mt-10 space-y-3 rounded-2xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm">
          <Row label="القالب" value={template?.name ?? order.templateKey} />
          <Row label="الباقة" value={pkg?.name ?? order.packageTier} />
          <Row label="الاسم" value={firstName} />
          <Row label="الحالة" value="في انتظار الدفع" accent />
        </dl>

        {WHATSAPP_NUMBER ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#6e2a3d] px-8 text-base text-[#FFF7F9] transition hover:brightness-110"
          >
            فتح واتساب مرة أخرى
          </a>
        ) : (
          <p className="mt-8 text-center text-sm text-[#6e2a3d]">
            رقم واتساب غير مهيأ في هذه البيئة.
          </p>
        )}

        <p className="mt-6 text-center text-xs text-[#6b5b66]">
          احتفظوا بهذا الرابط للرجوع إليه لاحقًا.{" "}
          <Link
            href="/"
            className="text-[#9A7B1C] underline-offset-4 hover:underline"
          >
            الصفحة الرئيسية
          </Link>
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-sm text-[#6b5b66]">{label}</dt>
      <dd
        className={`font-display text-base ${accent ? "text-[#9A7B1C]" : "text-[#231F20]"}`}
      >
        {value}
      </dd>
    </div>
  );
}