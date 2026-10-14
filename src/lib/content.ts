/**
 * Homepage content (Arabic).
 * ─────────────────────────────────────────────
 * Every word on the homepage lives here so you can edit
 * copy without touching JSX. Keep it short — mobile-first.
 */

import type { OccasionType } from "@/generated/prisma/client";

export interface OccasionCard {
  key: OccasionType;
  name: string;
  tagline: string;
  emoji: string;
  href: string;
}

export const HOMEPAGE = {
  // ─── Hero ───────────────────────────────────────
  hero: {
    eyebrow: "دعوات رقمية من الجزائر",
    title: "دعوة واحدة، رابط واحد، لكل ضيوفكم",
    subtitle:
      "أنشئوا دعوة زفاف أو خطوبة أو حنّة أنيقة، وشاركوها مع من تحبون عبر رابط واحد. بدون تطبيق، بدون تحميل.",
    ctaPrimary: "اكتشف التصاميم",
    ctaSecondary: "شاهدوا النموذج التجريبي",
    ctaSecondaryHref: "/templates/elegant",
  },

  // ─── Occasions ──────────────────────────────────
  occasions: {
    title: "لكل مناسبة دعوتها",
    subtitle: "اختاروا المناسبة التي تهمّكم",
    items: [
      { key: "WEDDING" as const,     name: "زفاف",        tagline: "دعوة العمر",        emoji: "💍", href: "/templates?occasion=WEDDING" },
      { key: "HENNA" as const,       name: "ليلة الحنّة",  tagline: "تراث وفرح",        emoji: "🌿", href: "/templates?occasion=HENNA" },
      { key: "NIKAH" as const,       name: "عقد القران",   tagline: "بركة وسكينة",       emoji: "📖", href: "/templates?occasion=NIKAH" },
      { key: "ENGAGEMENT" as const,  name: "خطوبة",        tagline: "بداية الحكاية",     emoji: "💐", href: "/templates?occasion=ENGAGEMENT" },
      { key: "BIRTHDAY" as const,    name: "عيد ميلاد",    tagline: "لحظات نحتفل بها",   emoji: "🎂", href: "/templates?occasion=BIRTHDAY" },
      { key: "NEW_BABY" as const,    name: "مولود جديد",   tagline: "أحلى خبر",         emoji: "🍼", href: "/templates?occasion=NEW_BABY" },
    ] satisfies OccasionCard[],
  },

  // ─── Featured templates ─────────────────────────
  featured: {
    title: "تصاميم مختارة",
    subtitle: "أكثر التصاميم طلبًا هذا الشهر",
    demoCtaText: "جرّبوا العرض التجريبي",
    orderCtaText: "اطلبوا هذا التصميم",
  },

  // ─── How it works ───────────────────────────────
  how: {
    title: "كيف تعمل؟",
    subtitle: "أربع خطوات فقط",
    steps: [
      { n: "١", title: "اختاروا تصميمكم", text: "تصفّحوا القوالب واختاروا ما يناسب مناسبتكم." },
      { n: "٢", title: "أتمّوا الدفع عبر واتساب", text: "راسلونا على واتساب، ونؤكد الدفع يدويًا خلال دقائق." },
      { n: "٣", title: "أضيفوا تفاصيلكم", text: "تصلكم رابط تعديل خاص بكم. املأوا الأسماء والتاريخ والقاعة." },
      { n: "٤", title: "شاركوا دعوتكم", text: "بضغطة واحدة، انشروا الدعوة وشاركوا الرابط مع ضيوفكم." },
    ],
  },

  // ─── FAQ ────────────────────────────────────────
  faq: {
    title: "أسئلة شائعة",
    items: [
      {
        q: "كم عدد مرات النشر المسموح بها؟",
        a: "لكل دعوة ٣ عمليات نشر. الأولى تُحتسب عند أول نشر. المسوّدات غير المكتملة غير محدودة — يمكنكم التعديل بحرية قبل النشر.",
      },
      {
        q: "ماذا يحدث بعد انتهاء الحفل؟",
        a: "تبقى الدعوة متاحة للضيوف لمدة أسبوع بعد تاريخ الحفل. بعد ذلك يمكنكم الوصول إليها عبر رابط الإدارة لمدة ٣٠ يومًا إضافية، لتتمكنوا من تصدير قائمة تأكيدات الحضور.",
      },
      {
        q: "كيف تعملون على تأكيد الدفع؟",
        a: "بعد اختيار الباقة، تراسلوننا على واتساب. نتحقق من الدفع يدويًا خلال دقائق، ثم نصدر لكم رابط التعديل الخاص بدعوتكم.",
      },
    ],
  },

  // ─── Footer ─────────────────────────────────────
  footer: {
    line: "فرحة — دعوات رقمية من الجزائر",
    whatsappCta: "تواصلوا معنا على واتساب",
    rights: "جميع الحقوق محفوظة",
  },

  // ─── Mobile sticky bar ──────────────────────────
  stickyBar: {
    buy: "شاهد التصاميم",
    buyHref: "/templates",
    whatsapp: "واتساب",
  },
};