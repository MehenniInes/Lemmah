import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => text(max).optional().nullable();

const whatsappField = z
  .string()
  .trim()
  .max(30)
  .optional()
  .nullable()
  .refine((v) => !v || /^[0-9+\s-]*$/.test(v), { message: "invalid_whatsapp" });

export const programItemSchema = z.object({
  id: z.string().min(1),
  time: text(20),
  title: text(80),
});

export const storyMilestoneSchema = z.object({
  id: z.string().min(1),
  year: text(10),
  title: text(80),
  description: optionalText(400),
});

export const noteSchema = z.object({
  id: z.string().min(1),
  text: text(400),
  isFeatured: z.boolean().default(false),
});

export const photoSchema = z.object({
  id: z.string().min(1),
  url: z.string().url().max(500),
  role: z.enum(["COUPLE", "VENUE", "BACKGROUND", "MEMORY"]),
  position: z.number().int().min(0).default(0),
});

/**
 * Draft schema — lenient. Used for autosave while the user is still filling
 * the form. No field is required to be non-empty.
 */
export const invitationFormSchema = z.object({
  brideName: text(60),
  groomName: text(60),
  nameOrder: z.enum(["groom-top", "bride-top"]).default("groom-top"),
  tagline: optionalText(140),

  eventDate: z.string().max(30),
  weddingTime: optionalText(20),

  venue: text(120),
  venueCity: optionalText(80),
  venueAddress: optionalText(200),

  message: optionalText(600),
  duaText: optionalText(600),
  closingText: optionalText(300),

  dressCodeIntro: optionalText(300),
  dressCodeForHer: optionalText(200),
  dressCodeForHim: optionalText(200),
  adultsOnlyEnabled: z.boolean().default(false),

  groomFamilyLabel: optionalText(80),
  groomFamilyNames: optionalText(200),
  brideFamilyLabel: optionalText(80),
  brideFamilyNames: optionalText(200),

  contactButtonText: optionalText(80),
  contactName: optionalText(80),
  contactWhatsapp: whatsappField,

  musicSource: z.enum(["UPLOAD", "YOUTUBE"]).optional().nullable(),
  musicUrl: optionalText(500),

  programItems: z.array(programItemSchema).max(12).default([]),
  storyMilestones: z.array(storyMilestoneSchema).max(10).default([]),
  notes: z.array(noteSchema).max(8).default([]),
  photos: z.array(photoSchema).max(10).default([]),
});

export type InvitationFormInput = z.infer<typeof invitationFormSchema>;

export function emptyInvitationForm(): InvitationFormInput {
  return {
    brideName: "",
    groomName: "",
    nameOrder: "groom-top",
    tagline: null,
    eventDate: "",
    weddingTime: null,
    venue: "",
    venueCity: null,
    venueAddress: null,
    message: null,
    duaText: null,
    closingText: null,
    dressCodeIntro: null,
    dressCodeForHer: null,
    dressCodeForHim: null,
    adultsOnlyEnabled: false,
    groomFamilyLabel: null,
    groomFamilyNames: null,
    brideFamilyLabel: null,
    brideFamilyNames: null,
    contactButtonText: null,
    contactName: null,
    contactWhatsapp: null,
    musicSource: null,
    musicUrl: null,
    programItems: [],
    storyMilestones: [],
    notes: [],
    photos: [],
  };
}

/**
 * Publish-time check. Returns a list of human-readable issues.
 * Empty list = ready to publish.
 */
export function getPublishIssues(form: InvitationFormInput): string[] {
  const issues: string[] = [];
  if (!form.groomName.trim()) issues.push("اسم العريس مطلوب");
  if (!form.brideName.trim()) issues.push("اسم العروس مطلوب");
  if (!form.eventDate.trim()) {
    issues.push("تاريخ الحفل مطلوب");
  } else if (Number.isNaN(Date.parse(form.eventDate))) {
    issues.push("صيغة التاريخ غير صحيحة");
  }
  if (!form.venue.trim()) issues.push("اسم القاعة مطلوب");
  return issues;
}