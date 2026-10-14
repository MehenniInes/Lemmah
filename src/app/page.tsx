import Link from "next/link";
import { HOMEPAGE } from "@/lib/content";
import { PACKAGES, formatDZD } from "@/lib/packages";
import { getAllTemplates } from "@/templates";

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? "";
const WHATSAPP_HREF = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : "#";

export default function HomePage() {
  const templates = getAllTemplates();

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF7F9] text-[#231F20]">
      {/* ─── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(212,175,55,.18), transparent 55%), radial-gradient(circle at 50% 100%, rgba(252,207,232,.55), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-[#9A7B1C]">
            {HOMEPAGE.hero.eyebrow}
          </p>
          <h1 className="font-display text-4xl leading-[1.2] text-[#231F20] sm:text-6xl">
            {HOMEPAGE.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#6b5b66] sm:text-lg">
            {HOMEPAGE.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/templates"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#6e2a3d] px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#FFF7F9] shadow-lg transition hover:brightness-110 sm:w-auto"
            >
              {HOMEPAGE.hero.ctaPrimary}
            </Link>
            <Link
              href={HOMEPAGE.hero.ctaSecondaryHref}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#D4AF37]/60 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#9A7B1C] transition hover:border-[#D4AF37] hover:bg-[#FCE7F0] sm:w-auto"
            >
              {HOMEPAGE.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Occasions ────────────────────────────── */}
      <section className="border-t border-[#D4AF37]/20 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10 text-center">
            <h2 className="font-display text-3xl text-[#231F20] sm:text-4xl">
              {HOMEPAGE.occasions.title}
            </h2>
            <p className="mt-2 text-sm text-[#6b5b66]">
              {HOMEPAGE.occasions.subtitle}
            </p>
          </header>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {HOMEPAGE.occasions.items.map((o) => (
              <Link
                key={o.key}
                href={o.href}
                className="group flex flex-col items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-white px-4 py-6 text-center shadow-sm transition hover:border-[#D4AF37]/70 hover:shadow-md"
              >
                <span aria-hidden="true" className="text-2xl">
                  {o.emoji}
                </span>
                <span className="mt-3 font-display text-lg text-[#231F20]">
                  {o.name}
                </span>
                <span className="mt-1 text-xs text-[#6b5b66]">{o.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured templates ───────────────────── */}
      {templates.length > 0 && (
        <section className="border-t border-[#D4AF37]/20 bg-[#FDF0F4] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <header className="mb-10 text-center">
              <h2 className="font-display text-3xl text-[#231F20] sm:text-4xl">
                {HOMEPAGE.featured.title}
              </h2>
              <p className="mt-2 text-sm text-[#6b5b66]">
                {HOMEPAGE.featured.subtitle}
              </p>
            </header>
            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
              {templates.map((t) => (
                <article
                  key={t.key}
                  className="overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-white shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.previewImage}
                    alt={`معاينة قالب ${t.name}`}
                    width={600}
                    height={800}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-xl text-[#231F20]">
                      {t.name}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[#6b5b66]">
                      {t.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={`/templates/${t.key}`}
                        className="inline-flex min-h-10 items-center rounded-full border border-[#D4AF37]/60 px-4 py-2 text-xs text-[#9A7B1C] transition hover:bg-[#FCE7F0]"
                      >
                        {HOMEPAGE.featured.demoCtaText}
                      </Link>
                      <Link
                        href="/templates"
                        className="inline-flex min-h-10 items-center rounded-full bg-[#6e2a3d] px-4 py-2 text-xs text-[#FFF7F9] transition hover:brightness-110"
                      >
                        {HOMEPAGE.featured.orderCtaText}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── How it works ─────────────────────────── */}
      <section className="border-t border-[#D4AF37]/20 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-10 text-center">
            <h2 className="font-display text-3xl text-[#231F20] sm:text-4xl">
              {HOMEPAGE.how.title}
            </h2>
            <p className="mt-2 text-sm text-[#6b5b66]">
              {HOMEPAGE.how.subtitle}
            </p>
          </header>
          <ol className="grid gap-4 sm:grid-cols-2">
            {HOMEPAGE.how.steps.map((step) => (
              <li
                key={step.n}
                className="rounded-2xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/70 font-display text-lg text-[#9A7B1C]"
                >
                  {step.n}
                </span>
                <h3 className="mt-4 font-display text-lg text-[#231F20]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#6b5b66]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────── */}
      <section className="border-t border-[#D4AF37]/20 bg-[#FDF0F4] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10 text-center">
            <h2 className="font-display text-3xl text-[#231F20] sm:text-4xl">
              الباقات
            </h2>
            <p className="mt-2 text-sm text-[#6b5b66]">
              اختاروا ما يناسب مناسبتكم
            </p>
          </header>
          <div className="grid gap-5 sm:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <article
                key={pkg.key}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 ${
                  pkg.highlighted
                    ? "border-[#D4AF37] shadow-xl"
                    : "border-[#D4AF37]/25 shadow-sm"
                }`}
              >
                {pkg.highlighted && (
                  <span className="absolute -top-3 right-4 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] uppercase tracking-widest text-[#231F20]">
                    الأكثر اختيارًا
                  </span>
                )}
                <h3 className="font-display text-xl text-[#231F20]">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-xs text-[#6b5b66]">{pkg.tagline}</p>
                <p className="mt-5 font-display text-3xl text-[#9A7B1C]">
                  {formatDZD(pkg.priceDZD)}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-3 text-sm leading-6 text-[#6b5b66]"
                    >
                      <span aria-hidden="true" className="text-[#D4AF37]">
                        ✦
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`${WHATSAPP_HREF}?text=${encodeURIComponent(
                    `مرحبًا، أرغب في باقة ${pkg.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm transition ${
                    pkg.highlighted
                      ? "bg-[#6e2a3d] text-[#FFF7F9] hover:brightness-110"
                      : "border border-[#D4AF37]/60 text-[#9A7B1C] hover:bg-[#FCE7F0]"
                  }`}
                >
                  {pkg.ctaText}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────── */}
      <section className="border-t border-[#D4AF37]/20 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10 text-center">
            <h2 className="font-display text-3xl text-[#231F20] sm:text-4xl">
              {HOMEPAGE.faq.title}
            </h2>
          </header>
          <div className="divide-y divide-[#D4AF37]/25 rounded-2xl border border-[#D4AF37]/30 bg-white shadow-sm">
            {HOMEPAGE.faq.items.map((item) => (
              <details key={item.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-display text-base text-[#231F20] sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[#9A7B1C] transition group-open:rotate-45"
                  >
                    ＋
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-8 text-[#6b5b66]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────── */}
      <footer className="border-t border-[#D4AF37]/20 bg-[#FDF0F4] px-6 py-12 pb-28 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-xl text-[#9A7B1C]">
            {HOMEPAGE.footer.line}
          </p>
          {WHATSAPP_NUMBER && (
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D4AF37]/60 px-6 py-3 text-sm text-[#9A7B1C] transition hover:bg-[#FCE7F0]"
            >
              {HOMEPAGE.footer.whatsappCta}
            </a>
          )}
          <p className="mt-8 text-xs text-[#6b5b66]">
            © {new Date().getFullYear()} — {HOMEPAGE.footer.rights}
          </p>
        </div>
      </footer>

      {/* ─── Mobile sticky bar ────────────────────── */}
      <div
        role="region"
        aria-label="إجراءات سريعة"
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[#D4AF37]/30 bg-[#FFF7F9]/95 px-4 py-3 backdrop-blur-md sm:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <Link
          href={HOMEPAGE.stickyBar.buyHref}
          className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#6e2a3d] text-sm text-[#FFF7F9]"
        >
          {HOMEPAGE.stickyBar.buy}
        </Link>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-[#D4AF37]/60 text-sm text-[#9A7B1C]"
        >
          {HOMEPAGE.stickyBar.whatsapp}
        </a>
      </div>
    </div>
  );
}