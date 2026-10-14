import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashEditCode, normalizeEditCodeInput } from "@/lib/edit-code";
import { getTemplate } from "@/templates";
import { getPackage } from "@/lib/packages";

export default async function EditPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = normalizeEditCodeInput(code);
  const hash = hashEditCode(normalized);

  const order = await prisma.order.findUnique({
    where: { editCodeHash: hash },
  });

  if (!order) notFound();
  if (order.status !== "PAID") notFound();

  const template = getTemplate(order.templateKey);
  const pkg = getPackage(order.packageTier);
  const draft = (order.draftData ?? {}) as { firstName?: unknown };
  const firstName = typeof draft.firstName === "string" ? draft.firstName : "";

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF7F9] text-[#231F20]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <header className="text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#9A7B1C]">
            مرحبًا{firstName ? ` ${firstName}` : ""}
          </p>
          <h1 className="mt-3 font-display text-3xl text-[#231F20] sm:text-4xl">
            تعديل دعوتكم
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#6b5b66]">
            نموذج التعديل سيظهر هنا في المرحلة القادمة. حتى ذلك الحين، يمكنكم
            التحقق من تفاصيل طلبكم أدناه.
          </p>
        </header>

        <dl className="mt-10 space-y-3 rounded-2xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm">
          <Row label="المرجع" value={order.ref} ltr />
          <Row label="القالب" value={template?.name ?? order.templateKey} />
          <Row label="الباقة" value={pkg?.name ?? order.packageTier} />
          <Row
            label="عدد النشرات المتبقية"
            value={String(order.publishesRemaining)}
          />
        </dl>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-sm text-[#6b5b66]">{label}</dt>
      <dd
        dir={ltr ? "ltr" : undefined}
        className="font-display text-base text-[#231F20]"
      >
        {value}
      </dd>
    </div>
  );
}