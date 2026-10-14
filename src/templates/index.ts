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

  brideName: "Sara",
  groomName: "Ahmed",
  nameOrder: "groom-top",
  tagline: null,

  eventDate: new Date("2027-08-15"),
  weddingTime: "7:00 PM",

  message: "With hearts full of joy, we invite you to our wedding celebration.",
  duaText:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا",
  closingText: "Your presence opens the doors of our happiness",

  venue: "Salle El Djazair",
  venueCity: "Algiers",
  venueAddress: "Hydra",
  address: "Hydra",

  dressCodeIntro: "Algiers elegance",
  dressCodeForHer:
    "Traditional Algerian karakou or elegant evening wear are welcome.",
  dressCodeForHim: "Formal suit or traditional attire.",
  adultsOnlyEnabled: true,

  groomFamilyLabel: "Groom's parents",
  groomFamilyNames: "Mr. Karim & Mrs. Houda",
  brideFamilyLabel: "Bride's parents",
  brideFamilyNames: "Mr. Sami & Mrs. Rana",

  contactButtonText: "Confirm by WhatsApp",
  contactName: "Abu Ahmed",
  contactWhatsapp: "213700000000",

  programItems: [
    { id: "d1", time: "7:00 PM", title: "Guest reception" },
    { id: "d2", time: "8:00 PM", title: "Ceremony begins" },
    { id: "d3", time: "9:00 PM", title: "Dinner" },
  ],
  storyMilestones: [
    {
      id: "s1",
      year: "2023",
      title: "The first meeting",
      description: "Fate brought us together for the first time.",
    },
    {
      id: "s2",
      year: "2026",
      title: "The wedding",
      description: "And now begins the most beautiful celebration.",
    },
  ],
  notes: [
    {
      id: "n1",
      text: "Please arrive half an hour before the ceremony begins.",
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
      name: "Yacine",
      message: "Congratulations, wishing you a lifetime of happiness.",
    },
    {
      id: "w2",
      name: "Amina",
      message: "May your union be blessed with love and joy.",
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