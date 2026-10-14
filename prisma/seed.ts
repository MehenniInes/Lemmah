import "dotenv/config";
import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const hashToken = (t: string) =>
  createHash("sha256").update(t).digest("hex");

async function main() {
  // ─── Demo customer (email is not @unique → findFirst + create) ───
  let customer = await prisma.customer.findFirst({
    where: { email: "demo@lemmah.dz" },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: "عميل تجريبي",
        email: "demo@lemmah.dz",
        whatsapp: "213555000000",
        countryCode: "DZ",
      },
    });
    console.log("   → customer created");
  } else {
    console.log("   → customer already exists, reusing");
  }

  const plainControlToken = "demo-ctrl-0000-1111-2222";
  const slug = "sara-ahmed";
  const weddingDate = new Date("2027-08-15T19:00:00+01:00");
  const expiresAt = new Date(weddingDate.getTime() + 7 * 86400_000);

  // ─── Invitation ──────────────────────────────────────────
  const existing = await prisma.invitation.findUnique({ where: { slug } });

  const invitation = existing
    ? existing
    : await prisma.invitation.create({
        data: {
          slug,
          controlTokenHash: hashToken(plainControlToken),
          customerId: customer.id,

          templateKey: "elegant",
          packageTier: "COMPLETE",
          occasionType: "WEDDING",
          language: "ar",

          groomName: "أحمد",
          brideName: "سارة",
          nameOrder: "groom-top",
          tagline: "يد تمتد... ويد تجيب",
          weddingDate,
          weddingTime: "19:00",
          invitationText:
            "بكل فرح وسرور، نتشرف بدعوتكم لحضور حفل زفافنا.",
          duaText: "بارك الله لهما وبارك عليهما وجمع بينهما في خير.",

          venueName: "قاعة الجزائر",
          venueCity: "الجزائر",
          venueAddress: "حيدرة، الجزائر العاصمة",

          dressCodeIntro: "ملابس أنيقة للسهرة.",
          dressCodeForHer: "فستان طويل",
          dressCodeForHim: "بدلة داكنة",

          musicSource: "UPLOAD",
          rsvpEnabled: true,
          qrCheckInEnabled: false,
          autoScrollIntro: false,
          showSaveDateCard: true,

          isPublished: true,
          expiresAt,

          programItems: {
            create: [
              { time: "19:00", title: "استقبال الضيوف", order: 0 },
              { time: "19:30", title: "دخول العروسين", order: 1 },
              { time: "21:00", title: "العشاء", order: 2 },
              { time: "22:30", title: "الحفل", order: 3 },
            ],
          },
          storyMilestones: {
            create: [
              {
                year: "2022",
                title: "أول لقاء",
                description: "في جامعة الجزائر",
                order: 0,
              },
              {
                year: "2025",
                title: "الخطوبة",
                description: "بحضور العائلة",
                order: 1,
              },
            ],
          },
          notes: {
            create: [
              {
                text: "مواقف مجانية متوفرة أمام القاعة.",
                order: 0,
              },
            ],
          },
        },
      });

  console.log(existing ? "   → invitation already exists, reusing" : "   → invitation created");

  // ─── Demo guests ─────────────────────────────────────────
  const guestCount = await prisma.guest.count({
    where: { invitationId: invitation.id },
  });

  if (guestCount === 0) {
    await prisma.guest.createMany({
      data: [
        {
          invitationId: invitation.id,
          name: "ياسين بلقاسم",
          guestSlug: "yacine-b",
          attendance: "COMING",
          companions: 1,
          message: "ألف مبروك، عقبال الفرح الدائم 🤍",
        },
        {
          invitationId: invitation.id,
          name: "أمينة حمادي",
          guestSlug: "amina-h",
          attendance: "NOT_COMING",
          companions: 0,
          message: "نعتذر عن الحضور، مبروك لكما.",
        },
      ],
    });
    console.log("   → 2 demo guests created");
  } else {
    console.log("   → guests already exist, skipping");
  }

  console.log("");
  console.log("✅ Seed complete");
  console.log("   public URL:      /i/" + invitation.slug);
  console.log("   plain token:     " + plainControlToken + "  (DB stores hash)");
  console.log("   customer email:  " + customer.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });