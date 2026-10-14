/**
 * Shared invitation data loading for pages and templates.
 *
 * Goals:
 *   - One canonical `InvitationData` type used by every template.
 *   - One place that maps Prisma rows → template-ready objects.
 *   - Never leak the full guest list to the client. Only public wishes
 *     (message set, not hidden) plus aggregate counts.
 */

import { prisma } from "@/lib/prisma";

// ─── Public types ─────────────────────────────────────────
export type InvitationStatus = "DRAFT" | "PUBLISHED" | "EXPIRED";

export interface InvitationWish {
  id: string;
  name: string;
  message: string;
}

export interface InvitationGuestCounts {
  attending: number;        // guests with attendance === "COMING"
  notAttending: number;     // guests with attendance === "NOT_COMING"
  maybe: number;            // guests with attendance === "MAYBE"
  pending: number;          // guests with attendance === "PENDING"
  totalCompanions: number;  // sum of companions for COMING guests
  totalWishes: number;      // guests who left a message (public or not)
}

export interface InvitationData {
  // Identity
  id: string;
  slug: string;
  status: InvitationStatus;
  templateKey: string;
  language: string;
  occasionType: string;

  // Couple
  brideName: string;
  groomName: string;
  nameOrder: string;
  tagline: string | null;

  // Event
  eventDate: Date;
  weddingTime: string | null;

  // Copy
  message: string | null;       // ← invitationText in DB
  duaText: string | null;
  closingText: string | null;

  // Venue
  venue: string;                // ← venueName in DB
  venueCity: string | null;
  venueAddress: string | null;
  address: string | null;       // alias of venueAddress (templates reference both)

  // Dress code
  dressCodeIntro: string | null;
  dressCodeForHer: string | null;
  dressCodeForHim: string | null;
  adultsOnlyEnabled: boolean;

  // Families
  groomFamilyLabel: string | null;
  groomFamilyNames: string | null;
  brideFamilyLabel: string | null;
  brideFamilyNames: string | null;

  // Contact
  contactButtonText: string | null;
  contactName: string | null;
  contactWhatsapp: string | null;

  // Relational content (ordered, template-ready)
  programItems: { id: string; time: string; title: string }[];
  storyMilestones: {
    id: string;
    year: string;
    title: string;
    description: string | null;
  }[];
  notes: { id: string; text: string; isFeatured: boolean }[];
  photos: { id: string; url: string; role: string; position: number }[];

  // Public guest data (filtered + aggregated)
  wishes: InvitationWish[];
  guestCounts: InvitationGuestCounts;
}

// ─── Internal helpers ─────────────────────────────────────

const INVITATION_INCLUDE = {
  programItems: { orderBy: { order: "asc" as const } },
  storyMilestones: { orderBy: { order: "asc" as const } },
  notes: { orderBy: { order: "asc" as const } },
  photos: { orderBy: { position: "asc" as const } },
  guests: true,
} as const;

type PrismaInvitation = NonNullable<
  Awaited<
    ReturnType<
      typeof prisma.invitation.findUnique<{
        where: { slug: string };
        include: typeof INVITATION_INCLUDE;
      }>
    >
  >
>;

function buildGuestData(guests: PrismaInvitation["guests"]) {
  const wishes: InvitationWish[] = [];
  const counts: InvitationGuestCounts = {
    attending: 0,
    notAttending: 0,
    maybe: 0,
    pending: 0,
    totalCompanions: 0,
    totalWishes: 0,
  };

  for (const g of guests) {
    // Counts cover every guest, regardless of message or hidden flag.
    if (g.attendance === "COMING") {
      counts.attending += 1;
      counts.totalCompanions += g.companions ?? 0;
    } else if (g.attendance === "NOT_COMING") {
      counts.notAttending += 1;
    } else if (g.attendance === "MAYBE") {
      counts.maybe += 1;
    } else {
      counts.pending += 1;
    }

    // Wishes are public only: a real message, not hidden.
    const msg = g.message?.trim();
    if (msg && msg.length > 0) {
      counts.totalWishes += 1;
      if (!g.isHidden) {
        wishes.push({ id: g.id, name: g.name, message: msg });
      }
    }
  }

  return { wishes, counts };
}

function mapInvitation(row: PrismaInvitation): InvitationData {
  const { wishes, counts } = buildGuestData(row.guests);

  return {
    id: row.id,
    slug: row.slug,
    status: row.status as InvitationStatus,
    templateKey: row.templateKey,
    language: row.language,
    occasionType: row.occasionType,

    brideName: row.brideName,
    groomName: row.groomName,
    nameOrder: row.nameOrder,
    tagline: row.tagline,

    eventDate: row.eventDate,
    weddingTime: row.weddingTime,

    message: row.invitationText,
    duaText: row.duaText,
    closingText: row.closingText,

    venue: row.venueName,
    venueCity: row.venueCity,
    venueAddress: row.venueAddress,
    address: row.venueAddress,

    dressCodeIntro: row.dressCodeIntro,
    dressCodeForHer: row.dressCodeForHer,
    dressCodeForHim: row.dressCodeForHim,
    adultsOnlyEnabled: row.adultsOnlyEnabled,

    groomFamilyLabel: row.groomFamilyLabel,
    groomFamilyNames: row.groomFamilyNames,
    brideFamilyLabel: row.brideFamilyLabel,
    brideFamilyNames: row.brideFamilyNames,

    contactButtonText: row.contactButtonText,
    contactName: row.contactName,
    contactWhatsapp: row.contactWhatsapp,

    programItems: row.programItems.map((p) => ({
      id: p.id,
      time: p.time,
      title: p.title,
    })),
    storyMilestones: row.storyMilestones.map((s) => ({
      id: s.id,
      year: s.year,
      title: s.title,
      description: s.description,
    })),
    notes: row.notes.map((n) => ({
      id: n.id,
      text: n.text,
      isFeatured: n.isFeatured,
    })),
    photos: row.photos.map((p) => ({
      id: p.id,
      url: p.url,
      role: p.role,
      position: p.position,
    })),

    wishes,
    guestCounts: counts,
  };
}

// ─── Public API ───────────────────────────────────────────

/**
 * Public view: only published, not-yet-expired invitations.
 * Returns null if not found, not published, or past expiry.
 */
export async function getInvitationData(
  slug: string
): Promise<InvitationData | null> {
  const row = await prisma.invitation.findUnique({
    where: { slug },
    include: INVITATION_INCLUDE,
  });

  if (!row) return null;
  if (row.status !== "PUBLISHED") return null;
  if (row.expiresAt.getTime() <= Date.now()) return null;

  return mapInvitation(row);
}

/**
 * Preview view: any invitation regardless of status, as long as it exists.
 * Used by /i/[slug]/preview.
 */
export async function getPreviewData(
  slug: string
): Promise<InvitationData | null> {
  const row = await prisma.invitation.findUnique({
    where: { slug },
    include: INVITATION_INCLUDE,
  });

  if (!row) return null;

  return mapInvitation(row);
}