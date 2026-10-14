import Link from "next/link";
import { getAllTemplates } from "@/templates";
import { HOMEPAGE } from "@/lib/content";

const OCCASIONS = HOMEPAGE.occasions.items;

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string }>;
}) {
  const { occasion } = await searchParams;
  const all = getAllTemplates();

  const filtered = occasion
    ? all.filter((t) => t.occasion === occasion || t.occasion === "ANY")
    : all;

  const page = HOMEPAGE.templatesPage;
  const isAllActive = !occasion;

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF7F9] text-[#231F20]">
      {/* Header */}
      <header className="mx-auto max-w-5xl px-6 pt-12 pb-8 text-center sm:pt-16">
        <h1 className="font-display text-4xl text-[#231F20] sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-3 text-sm text-[#6b5b66] sm:text-base">
          {page.subtitle}
        </p>
      </header>

      {/* Occasion filter pills — server-side, URL-driven */}
      <nav
        aria-label="تصفية حسب المناسبة"
        className="mx-auto max-w-5xl overflow-x-auto px-6 pb-8"
      >
        <ul className="flex min-w-max justify-center gap-2">
          <li>
            <Link
              href="/templates"
              className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-xs whitespace-nowrap transition ${
                isAllActive
                  ? "border-[#6e2a3d] bg-[#6e2a3d] text-[#FFF7F9]"
                  : "border-[#D4AF37]/40 bg-white text-[#9A7B1C] hover:bg-[#FCE7F0]"
              }`}
            >
              {page.allLabel}
            </Link>
          </li>
          {OCCASIONS.map((o) => {
            const active = occasion === o.key;
            return (
              <li key={o.key}>
                <Link
                  href={`/templates?occasion=${o.key}`}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-xs whitespace-nowrap transition ${
                    active
                      ? "border-[#6e2a3d] bg-[#6e2a3d] text-[#FFF7F9]"
                      : "border-[#D4AF37]/40 bg-white text-[#9A7B1C] hover:bg-[#FCE7F0]"
                  }`}
                >
                  <span aria-hidden="true">{o.emoji}</span>
                  {o.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Grid */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="font-display text-2xl text-[#231F20]">
              {page.emptyTitle}
            </h2>
            <p className="mt-3 text-sm text-[#6b5b66]">{page.emptyText}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <article
                key={t.key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-white shadow-sm transition hover:shadow-md"
              >
                <Link
                  href={`/templates/${t.key}`}
                  className="block overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.previewImage}
                    alt={`معاينة قالب ${t.name}`}
                    width={600}
                    height={800}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-xl text-[#231F20]">
                    {t.name}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-7 text-[#6b5b66]">
                    {t.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/templates/${t.key}`}
                      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#D4AF37]/60 px-4 py-2 text-xs text-[#9A7B1C] transition hover:bg-[#FCE7F0]"
                    >
                      {page.demoCta}
                    </Link>
                    <Link
                      href={`/buy/${t.key}`}
                      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-[#6e2a3d] px-4 py-2 text-xs text-[#FFF7F9] transition hover:brightness-110"
                    >
                      {page.buyCta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}