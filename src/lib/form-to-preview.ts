import type { InvitationData } from "@/lib/invitation";
import type { InvitationFormInput } from "@/lib/invitation-schema";

export interface PreviewMeta {
  id: string;
  slug: string;
  templateKey: string;
  language: string;
  occasionType: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED";
}

export function formToPreview(
  form: InvitationFormInput,
  meta: PreviewMeta
): InvitationData {
  return {
    id: meta.id,
    slug: meta.slug,
    status: meta.status,
    templateKey: meta.templateKey,
    language: meta.language,
    occasionType: meta.occasionType,

    brideName: form.brideName || "—",
    groomName: form.groomName || "—",
    nameOrder: form.nameOrder,
    tagline: form.tagline ?? null,

    eventDate: form.eventDate ? new Date(form.eventDate) : new Date(),
    weddingTime: form.weddingTime ?? null,

    message: form.message ?? null,
    duaText: form.duaText ?? null,
    closingText: form.closingText ?? null,

    venue: form.venue || "—",
    venueCity: form.venueCity ?? null,
    venueAddress: form.venueAddress ?? null,
    address: form.venueAddress ?? null,

    dressCodeIntro: form.dressCodeIntro ?? null,
    dressCodeForHer: form.dressCodeForHer ?? null,
    dressCodeForHim: form.dressCodeForHim ?? null,
    adultsOnlyEnabled: form.adultsOnlyEnabled,

    groomFamilyLabel: form.groomFamilyLabel ?? null,
    groomFamilyNames: form.groomFamilyNames ?? null,
    brideFamilyLabel: form.brideFamilyLabel ?? null,
    brideFamilyNames: form.brideFamilyNames ?? null,

    contactButtonText: form.contactButtonText ?? null,
    contactName: form.contactName ?? null,
    contactWhatsapp: form.contactWhatsapp ?? null,

     programItems: form.programItems.map((p) => ({
      id: p.id,
      time: p.time,
      title: p.title,
    })),
    storyMilestones: form.storyMilestones.map((s) => ({
      id: s.id,
      year: s.year,
      title: s.title,
      description: s.description ?? null,
    })),
    notes: form.notes.map((n) => ({
      id: n.id,
      text: n.text,
      isFeatured: n.isFeatured,
    })),
    photos: form.photos,

    wishes: [],
    guestCounts: {
      attending: 0,
      notAttending: 0,
      maybe: 0,
      pending: 0,
      totalCompanions: 0,
      totalWishes: 0,
    },
  };
}