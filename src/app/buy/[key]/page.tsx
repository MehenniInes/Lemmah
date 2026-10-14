import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate } from "@/templates";
import { PACKAGES, formatDZD } from "@/lib/packages";
import { createOrder } from "./actions";

export default async function BuyPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key } = await params;
  const { error } = await searchParams;

  const template = getTemplate(key);
  if (!template) notFound();

  const errorMessage =
    error === "invalid"
      ? "يرجى التحقق من البيانات المدخلة."
      : error === "rate"
        ? "لقد تجاوزت الحد المسموح من الطلبات. حاول لاحقًا."
        : error === "collision"
          ? "حدث خطأ غير متوقع. حاول مرة أخرى."
          : null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF7F9] text-[#231F20]">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <Link
          href={`/templates/${key}`}
          className="text-xs text-[#9A7B1C] underline-offset-4 hover:underline"
        >
          ← رجوع إلى المعاينة
        </Link>

        <header className="mt-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#9A7B1C]">
            طلب دعوة رقمية
          </p>
          <h1 className="mt-3 font-display text-3xl text-[#231F20] sm:text-4xl">
            {template.name}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6b5b66]">
            {template.description}
          </p>
        </header>

        {errorMessage && (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-[#6e2a3d]/30 bg-[#FCE7F0] px-4 py-3 text-sm text-[#6e2a3d]"
          >
            {errorMessage}
          </div>
        )}

        <form action={createOrder} className="mt-10 space-y-8">
          <input type="hidden" name="templateKey" value={key} />

          {/* Package selection */}
          <fieldset>
            <legend className="font-display text-lg text-[#231F20]">
              اختاروا الباقة
            </legend>
            <div className="mt-4 space-y-3">
              {PACKAGES.map((pkg) => (
                <label
                  key={pkg.key}
                  className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#D4AF37]/30 bg-white p-4 shadow-sm transition has-[:checked]:border-[#6e2a3d] has-[:checked]:bg-[#FCE7F0]"
                >
                  <input
                    type="radio"
                    name="packageTier"
                    value={pkg.key}
                    defaultChecked={pkg.highlighted}
                    required
                    className="mt-1 h-4 w-4 accent-[#6e2a3d]"
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-lg text-[#231F20]">
                        {pkg.name}
                      </span>
                      <span className="font-display text-lg text-[#9A7B1C]">
                        {formatDZD(pkg.priceDZD)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6b5b66]">
                      {pkg.tagline}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Customer info */}
          <fieldset className="space-y-5">
            <legend className="font-display text-lg text-[#231F20]">
              معلوماتكم
            </legend>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm text-[#6b5b66]"
              >
                الاسم الأول <span className="text-[#6e2a3d]">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                maxLength={60}
                autoComplete="given-name"
                className="mt-2 w-full rounded-xl border border-[#D4AF37]/40 bg-white px-4 py-3 text-base outline-none focus:border-[#6e2a3d]"
              />
            </div>

            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm text-[#6b5b66]"
              >
                رقم واتساب{" "}
                <span className="text-[#6b5b66]/60">(اختياري)</span>
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                maxLength={30}
                placeholder="+213 555 00 00 00"
                autoComplete="tel"
                dir="ltr"
                className="mt-2 w-full rounded-xl border border-[#D4AF37]/40 bg-white px-4 py-3 text-base outline-none focus:border-[#6e2a3d]"
              />
              <p className="mt-2 text-xs text-[#6b5b66]/80">
                اختياري — يساعدنا على التواصل معكم بخصوص الطلب.
              </p>
            </div>
          </fieldset>

          <button
            type="submit"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#6e2a3d] px-8 text-base text-[#FFF7F9] transition hover:brightness-110"
          >
            احجز وادفع عبر واتساب
          </button>

          <p className="text-center text-xs text-[#6b5b66]">
            بعد الضغط، سيتم تحويلكم إلى واتساب لتأكيد الدفع مع فريقنا.
          </p>
        </form>
      </div>
    </div>
  );
}