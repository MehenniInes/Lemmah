import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate } from "@/templates";
import { HOMEPAGE } from "@/lib/content";

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? "";
const WHATSAPP_HREF = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : "#";

export default async function TemplateDemoPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const template = getTemplate(key);
  if (!template) notFound();

  const { Component, demoData, name } = template;
  const demo = HOMEPAGE.demoPage;

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF7F9] text-[#231F20]">
      {/* Banner */}
      <div className="bg-[#D4AF37] px-4 py-3 text-center text-xs text-[#231F20] sm:text-sm">
        <span aria-hidden="true">✦</span> {demo.banner}
      </div>

      {/* Template preview */}
      <Component invitation={demoData} />

      {/* How it works mini-section */}
      <section className="border-t border-[#D4AF37]/25 bg-[#FDF0F4] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-2xl text-[#231F20] sm:text-3xl">
            {demo.howTitle}
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-3">
            {demo.howSteps.map((step) => (
              <li
                key={step.n}
                className="rounded-2xl border border-[#D4AF37]/30 bg-white p-5 text-center shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/70 font-display text-lg text-[#9A7B1C]"
                >
                  {step.n}
                </span>
                <p className="mt-4 text-sm leading-7 text-[#6b5b66]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sticky buy bar */}
      <div
        role="region"
        aria-label="اطلب هذا القالب"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D4AF37]/30 bg-[#FFF7F9]/95 px-4 py-3 backdrop-blur-md"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p className="hidden font-display text-lg text-[#231F20] sm:block">
            {name}
          </p>
          <Link
            href={`/buy/${key}`}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#6e2a3d] px-6 text-sm text-[#FFF7F9] transition hover:brightness-110 sm:flex-none sm:px-10"
          >
            {demo.buySticky}
          </Link>
        </div>
      </div>

      {/* Spacer so sticky bar doesn't cover the last section on mobile */}
      <div aria-hidden="true" className="h-20" />
    </div>
  );
}