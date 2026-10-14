/**
 * Template registry.
 *
 * Every invitation template in the app is registered here.
 * Pages look up the template by `invitation.templateKey` and render
 * its Component with the invitation data.
 *
 * To add a new template:
 *   1. Create src/components/invitations/YourTemplate.tsx
 *      (props: { invitation: InvitationData })
 *   2. Add an entry below with its key, name, and demo data
 *   3. Done — /templates gallery and /i/[slug] pick it up automatically
 */

import type { ComponentType } from "react";
import type { InvitationData } from "@/lib/invitation";
import ElegantTemplate from "@/components/invitations/ElegantTemplate";

export type TemplateOccasion =
  | "WEDDING"
  | "HENNA"
  | "NIKAH"
  | "ENGAGEMENT"
  | "BIRTHDAY"
  | "NEW_BABY"
  | "ANY";

export interface TemplateEntry {
  key: string;
  name: string;
  occasion: TemplateOccasion;
  description: string;
  previewImage: string;
  Component: ComponentType<{ invitation: InvitationData }>;
  demoData: InvitationData;
}

// ─── Elegant ──────────────────────────────────────────────
const elegantDemoData: InvitationData = {
  id: "demo",
  slug: "demo",
  status: "PUBLISHED",
  templateKey: "elegant",
  language: "ar",
  occasionType: "WEDDING",

  brideName: "سارة",
  groomName: "أحمد",
  nameOrder: "groom-top",
  tagline: "يد تمتد... ويد تجيب",

  eventDate: new Date("2027-08-15T19:00:00+01:00"),
  weddingTime: "19:00",

  message: "بكل فرح وسرور، نتشرف بدعوتكم لحضور حفل زفافنا.",
  duaText:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  closingText: "حضوركم يفتح أبواب فرحنا",

  venue: "قاعة الجزائر",
  venueCity: "الجزائر",
  venueAddress: "حيدرة، الجزائر العاصمة",
  address: "حيدرة، الجزائر العاصمة",

  dressCodeIntro: "أناقة جزائرية",
  dressCodeForHer: "قراقو تقليدي أو فستان سهرة أنيق.",
  dressCodeForHim: "بدلة رسمية أو لباس تقليدي.",
  adultsOnlyEnabled: true,

  groomFamilyLabel: "والدا العريس",
  groomFamilyNames: "السيد كريم والسيدة هدى",
  brideFamilyLabel: "والدا العروس",
  brideFamilyNames: "السيد سامي والسيدة رنا",

  contactButtonText: "تأكيد عبر واتساب",
  contactName: "أبو أحمد",
  contactWhatsapp: "213700000000",

  programItems: [
    { id: "d1", time: "19:00", title: "استقبال الضيوف" },
    { id: "d2", time: "19:30", title: "دخول العروسين" },
    { id: "d3", time: "21:00", title: "العشاء" },
    { id: "d4", time: "22:30", title: "الحفل والرقص" },
  ],
  storyMilestones: [
    {
      id: "s1",
      year: "2023",
      title: "أول لقاء",
      description: "جمعنا القدر لأول مرة في جامعة الجزائر.",
    },
    {
      id: "s2",
      year: "2025",
      title: "الخطوبة",
      description: "بحضور العائلة والأحباب.",
    },
    {
      id: "s3",
      year: "2027",
      title: "الزفاف",
      description: "وتبدأ أجمل حكاية.",
    },
  ],
  notes: [
    {
      id: "n1",
      text: "نرجو الحضور قبل نصف ساعة من بدء المراسم.",
      isFeatured: false,
    },
  ],
  photos: [
    {
      id: "p1",
      url: "https://picsum.photos/seed/demo1/800/800",
      role: "COUPLE",
      position: 0,
    },
    {
      id: "p2",
      url: "https://picsum.photos/seed/demo2/600/600",
      role: "MEMORY",
      position: 1,
    },
    {
      id: "p3",
      url: "https://picsum.photos/seed/demo3/600/600",
      role: "MEMORY",
      position: 2,
    },
  ],

  wishes: [
    {
      id: "w1",
      name: "ياسين",
      message: "ألف مبروك، عقبال الفرح الدائم إن شاء الله.",
    },
    {
      id: "w2",
      name: "أمينة",
      message: "بارك الله لكما وبارك عليكما وجمع بينكما في خير.",
    },
  ],
  guestCounts: {
    attending: 0,
    notAttending: 0,
    maybe: 0,
    pending: 0,
    totalCompanions: 0,
    totalWishes: 2,
  },
};

// ─── Registry ─────────────────────────────────────────────
export const templates: Record<string, TemplateEntry> = {
  elegant: {
    key: "elegant",
    name: "Elegant",
    occasion: "WEDDING",
    description:
      "A refined floral design with a soft blush-and-gold palette, an envelope reveal, and rich typography.",
    previewImage: "https://picsum.photos/seed/elegant-preview/800/1200",
    Component: ElegantTemplate,
    demoData: elegantDemoData,
  },
};

// ─── Lookup helpers ───────────────────────────────────────
export function getTemplate(key: string): TemplateEntry | null {
  return templates[key] ?? null;
}

export function getAllTemplates(): TemplateEntry[] {
  return Object.values(templates);
}