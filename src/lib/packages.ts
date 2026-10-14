/**
 * Pricing tiers for Lemmah.
 * ─────────────────────────────────────────────
 * Edit prices and features HERE. The homepage reads
 * from this file — no need to touch page.tsx.
 *
 * priceDZD: number for a real price, or null for "coming soon".
 */

export type PackageKey = "BASIC" | "COMPLETE" | "ROYAL";

export interface PackageDef {
  key: PackageKey;
  name: string;
  tagline: string;
  priceDZD: number | null;
  features: string[];
  highlighted: boolean;
  ctaText: string;
}

export const PACKAGES: PackageDef[] = [
  {
    key: "BASIC",
    name: "الأساسية",
    tagline: "لبداية بسيطة وأنيقة",
    priceDZD: 3900,
    highlighted: false,
    ctaText: "اطلبوا هذه الباقة",
    features: [
      "قالب واحد من المجموعة",
      "رابط واحد لجميع الضيوف",
      "عدّاد تنازلي وخريطة القاعة",
      "حفظ الموعد في التقويم",
    ],
  },
  {
    key: "COMPLETE",
    name: "المتكاملة",
    tagline: "الأكثر اختيارًا",
    priceDZD: 6900,
    highlighted: true,
    ctaText: "اختر هذه الباقة",
    features: [
      "كل مزايا الباقة الأساسية",
      "تأكيد الحضور وقائمة الضيوف",
      "معرض الصور وقصتكم",
      "الموسيقى وقواعد اللباس",
      "٣ عمليات نشر",
    ],
  },
  {
    key: "ROYAL",
    name: "الملكية",
    tagline: "لكل التفاصيل",
    priceDZD: 11900,
    highlighted: false,
    ctaText: "اطلب الباقة الملكية",
    features: [
      "كل مزايا الباقة المتكاملة",
      "ألوان وخطوط مخصّصة",
      "روابط شخصية لكل ضيف",
      "دخول بالـ QR ودعم بالأولوية",
    ],
  },
];

export function getPackage(key: PackageKey): PackageDef | null {
  return PACKAGES.find((p) => p.key === key) ?? null;
}

/** Format a DZD price in Algerian Arabic numerals. */
export function formatDZD(price: number | null): string {
  if (price === null) return "قريبًا";
  return new Intl.NumberFormat("ar-DZ").format(price) + " دج";
}