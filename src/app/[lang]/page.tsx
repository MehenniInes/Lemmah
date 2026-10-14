import Link from "next/link";
import { notFound } from "next/navigation";
import { LANGS, LANG_LABEL, dict, isLang, type OccasionKey } from "@/lib/i18n";

const WHATSAPP = "213555000000"; // ← your real number

const ACCENT: Record<OccasionKey, string> = {
  wedding:    "var(--color-wedding)",
  engagement: "var(--color-engagement)",
  henna:      "var(--color-henna)",
  birthday:   "var(--color-birthday)",
  baby:       "var(--color-baby)",
  business:   "var(--color-business)",
  eid:        "var(--color-eid)",
};

const HERO_CARDS = [
  { accent: ACCENT.engagement, dx: -120, rotate: -9, scale: 0.88, front: false },
  { accent: ACCENT.baby,       dx:  120, rotate:  9, scale: 0.88, front: false },
  { accent: ACCENT.wedding,    dx:    0, rotate:  0, scale: 1,    front: true  },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict[lang];
  const isFr = lang === "fr";
  const isAr = lang === "ar";

  const heroSize   = isFr ? "text-7xl md:text-8xl" : "text-6xl md:text-8xl";
  const h2Size     = isFr ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl";
  const logoSize   = isFr ? "text-4xl" : "text-3xl";
  const cardNameSize = isFr ? "text-4xl" : "text-2xl";

  return (
    <div className="pb-28 md:pb-0">
      {/* ── NAV ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-pink-soft/60 bg-bg/85 px-6 py-4 backdrop-blur md:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href={`/${lang}`}
            className={`font-display ${logoSize} text-pink`}
          >
            {t.brand}
          </Link>

          <nav className="hidden gap-7 text-sm text-text-soft md:flex">
            <a href="#designs"  className="hover:text-pink">{t.nav.designs}</a>
            <a href="#how"      className="hover:text-pink">{t.nav.how}</a>
            <a href="#packages" className="hover:text-pink">{t.nav.packages}</a>
            <a href="#faq"      className="hover:text-pink">{t.nav.faq}</a>
            <a href="#contact"  className="hover:text-pink">{t.nav.contact}</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 text-xs tracking-widest">
              {LANGS.map((l) => (
                <Link
                  key={l}
                  href={`/${l}`}
                  className={`rounded-full border px-3 py-1 transition ${
                    l === lang
                      ? "border-pink bg-pink-soft/60 text-pink-deep"
                      : "border-transparent text-text-soft hover:text-pink"
                  }`}
                >
                  {LANG_LABEL[l]}
                </Link>
              ))}
            </div>
            <Link
              href="/create"
              className="hidden rounded-full bg-pink px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-pink-deep hover:-translate-y-0.5 sm:inline-block"
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="dot-grid relative overflow-hidden">
        {/* floating pastel dots — decorative */}
        <span aria-hidden className="pointer-events-none absolute right-[12%] top-24 h-3 w-3 rounded-full bg-mint/70" />
        <span aria-hidden className="pointer-events-none absolute left-[8%]  top-40 h-4 w-4 rounded-full bg-pink-soft" />
        <span aria-hidden className="pointer-events-none absolute right-[6%] bottom-40 h-3 w-3 rounded-full bg-lilac/70" />
        <span aria-hidden className="pointer-events-none absolute left-[16%] bottom-24 h-2.5 w-2.5 rounded-full bg-gold/70" />

        <div className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center md:px-12">
          <p className="mx-auto inline-block rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-sm text-text-soft shadow-soft">
            {t.hero.promo}
          </p>

          <h1 className={`font-display ${heroSize} mt-8 text-text`}>
            {t.brand}
          </h1>

          <p className="mt-6 text-xl text-pink md:text-2xl">{t.hero.tagline}</p>
          <p className="mx-auto mt-4 max-w-xl text-text-soft">{t.hero.sub}</p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/templates"
              className="rounded-full bg-pink px-7 py-3 font-medium text-white shadow-lift transition hover:bg-pink-deep hover:-translate-y-0.5"
            >
              ✨ {t.hero.ctaDesigns}
            </Link>
            <Link
              href="/create"
              className="rounded-full border border-pink bg-white px-7 py-3 font-medium text-pink transition hover:bg-pink-soft/50"
            >
              {t.hero.ctaOrder}
            </Link>
          </div>

          {/* Invitation stack */}
          <div className="relative mx-auto mt-16 h-80 w-full max-w-lg" aria-hidden="true">
            {HERO_CARDS.map((c, i) => (
              <div
                key={i}
                className={`absolute left-1/2 top-0 h-72 w-56 overflow-hidden rounded-[1.5rem] bg-surface shadow-lift ring-1 ring-pink-soft/60 ${
                  c.front ? "z-10" : "z-0"
                }`}
                style={{
                  transform: `translateX(calc(-50% + ${
                    isAr ? -c.dx : c.dx
                  }px)) rotate(${isAr ? -c.rotate : c.rotate}deg) scale(${c.scale})`,
                }}
              >
                <div className="h-2" style={{ background: c.accent }} />
                {c.front ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 px-4 pb-10 text-center">
                    <span className={`font-display ${cardNameSize} text-text`}>
                      {t.hero.sample.names}
                    </span>
                    <span className="text-xs text-text-soft">{t.hero.sample.date}</span>
                    <span
                      className="mt-2 rounded-full border px-4 py-1.5 text-xs"
                      style={{ borderColor: c.accent, color: c.accent }}
                    >
                      {t.hero.sample.rsvp}
                    </span>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 pb-10">
                    <span className="h-2 w-24 rounded-full bg-pink-soft" />
                    <span className="h-2 w-16 rounded-full bg-pink-soft/70" />
                    <span
                      className="mt-3 h-6 w-20 rounded-full"
                      style={{ background: `${c.accent}` , opacity: 0.35 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE STRIP ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ul className="grid grid-cols-1 divide-y divide-pink-soft rounded-3xl bg-surface text-center shadow-soft md:grid-cols-3 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse">
          {t.strip.map((s) => (
            <li key={s} className="px-6 py-6 text-text-soft">
              <span className="mr-2 text-pink rtl:ml-2 rtl:mr-0">♡</span>
              {s}
            </li>
          ))}
        </ul>
      </section>

      {/* ── OCCASIONS ───────────────────────────────────── */}
      <section className="bg-bg-soft/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className={`font-display ${h2Size} mb-12 text-center text-text`}>
            {t.occasions.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {t.occasions.items.map((o) => (
              <Link
                key={o.key}
                href="/templates"
                className="rounded-3xl border-t-4 bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
                style={{ borderTopColor: ACCENT[o.key] }}
              >
                <span
                  className="mb-4 block h-2.5 w-2.5 rounded-full"
                  style={{ background: ACCENT[o.key] }}
                />
                <span className="text-lg text-text">{o.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DESIGNS ────────────────────────────── */}
      <section id="designs" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <h2 className={`font-display ${h2Size} mb-12 text-center text-text`}>
          {t.featured.title}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col overflow-hidden rounded-3xl bg-surface shadow-lift ring-1 ring-pink-soft/60">
            <Link
              href="/templates/elegant"
              className="flex h-56 items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-wedding), var(--color-engagement) 70%)",
              }}
            >
              <span className={`font-display ${cardNameSize} text-white drop-shadow`}>
                {t.featured.demoName}
              </span>
            </Link>
            <div className="flex items-center justify-between gap-3 p-5">
              <Link
                href="/templates/elegant"
                className="text-sm text-pink hover:underline"
              >
                {t.featured.demoHint}
              </Link>
              <Link
                href="/create"
                className="rounded-full bg-pink px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-pink-deep"
              >
                {t.featured.order}
              </Link>
            </div>
          </div>

          {[ACCENT.henna, ACCENT.eid].map((accent) => (
            <div
              key={accent}
              className="flex min-h-64 items-end rounded-3xl border-2 border-dashed border-pink-soft p-6 text-sm text-text-soft"
              style={{ background: `linear-gradient(160deg, ${accent}22, transparent 60%)` }}
            >
              {t.featured.soon}
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section id="how" className="scroll-mt-24 bg-bg-soft/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className={`font-display ${h2Size} mb-12 text-center text-text`}>
            {t.how.title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {t.how.steps.map((s, i) => (
              <div
                key={i}
                className="rounded-3xl bg-surface p-6 shadow-soft"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-soft text-sm font-semibold text-pink-deep">
                  0{i + 1}
                </div>
                <div className="mb-2 text-lg text-text">{s.title}</div>
                <p className="text-sm text-text-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className={`font-display ${h2Size} mb-12 text-center text-text`}>
          {t.features.title}
        </h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {t.features.items.map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-soft text-pink-deep">
                ♡
              </span>
              <div>
                <div className="text-lg text-text">{f.title}</div>
                <p className="mt-1 text-sm text-text-soft">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────────────────── */}
      <section id="packages" className="scroll-mt-24 bg-bg-soft/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className={`font-display ${h2Size} mb-3 text-center text-text`}>
            {t.packages.title}
          </h2>
          <p className="mb-12 text-center text-sm text-text-soft">{t.packages.note}</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.packages.tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-3xl bg-surface p-8 transition hover:-translate-y-1 ${
                  tier.highlight
                    ? "shadow-lift ring-2 ring-pink"
                    : "shadow-soft ring-1 ring-pink-soft/60"
                }`}
              >
                {tier.highlight && (
                  <span className="mb-4 inline-block self-start rounded-full bg-pink-soft px-3 py-1 text-xs text-pink-deep">
                    ★ {isAr ? "الأكثر اختيارًا" : isFr ? "Le plus choisi" : "Most popular"}
                  </span>
                )}
                <div className="text-xl text-pink-deep">{tier.name}</div>
                <div className="my-4 text-3xl text-text">{tier.price}</div>
                <ul className="mb-8 space-y-2 text-sm text-text-soft">
                  {tier.features.map((f) => (
                    <li key={f}>
                      <span className="mr-2 text-gold rtl:ml-2 rtl:mr-0">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/create"
                  className={`mt-auto rounded-full px-6 py-2.5 text-center text-sm font-medium transition ${
                    tier.highlight
                      ? "bg-pink text-white shadow-soft hover:bg-pink-deep"
                      : "border border-pink text-pink hover:bg-pink-soft/50"
                  }`}
                >
                  {t.packages.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-24">
        <h2 className={`font-display ${h2Size} mb-10 text-center text-text`}>
          {t.faq.title}
        </h2>
        <div>
          {t.faq.items.map((item) => (
            <details
              key={item.q}
              className="group border-b border-pink-soft py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg text-text [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-2xl text-pink transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-text-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer
        id="contact"
        className="border-t border-pink-soft px-6 py-14 text-center md:px-12"
      >
        <div className={`font-display ${logoSize} mb-4 text-pink`}>{t.brand}</div>
        <p className="mb-6 text-sm text-text-soft">{t.footer.line}</p>
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-pink px-6 py-2.5 text-sm text-white shadow-soft transition hover:bg-pink-deep hover:-translate-y-0.5"
        >
          {t.footer.whatsapp}
        </a>
        <p className="mt-8 text-xs text-text-soft/70">
          © {new Date().getFullYear()} · {t.footer.rights}
        </p>
      </footer>

      {/* ── MOBILE STICKY CTA ──────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-pink-soft bg-bg/90 p-3 backdrop-blur md:hidden">
        <Link
          href="/create"
          className="block rounded-full bg-pink py-3 text-center font-medium text-white shadow-lift"
        >
          {t.hero.ctaOrder}
        </Link>
      </div>
    </div>
  );
  {/* ── Decorative background flowers ───────────────── */}
<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
  <span className="absolute left-[6%]  top-[12%] text-6xl opacity-30 select-none">🌸</span>
  <span className="absolute right-[8%] top-[20%] text-7xl opacity-25 select-none">🌺</span>
  <span className="absolute left-[14%] top-[42%] text-5xl opacity-20 select-none">🌷</span>
  <span className="absolute right-[12%] top-[55%] text-6xl opacity-25 select-none">🌸</span>
  <span className="absolute left-[22%] top-[72%] text-7xl opacity-20 select-none">💮</span>
  <span className="absolute right-[18%] top-[82%] text-5xl opacity-30 select-none">🌺</span>
  <span className="absolute left-[48%] top-[30%] text-4xl opacity-20 select-none">🌸</span>
  <span className="absolute right-[42%] top-[66%] text-6xl opacity-25 select-none">🌷</span>
</div>
}