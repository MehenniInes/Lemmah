import type { Metadata } from "next";
import {
  Aref_Ruqaa,
  IBM_Plex_Sans_Arabic,
  Inter,
  Jost,
  Monsieur_La_Doulaise,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

// ─── Fonts ─────────────────────────────────────────────────
const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-aref",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ibm",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const monsieur = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-monsieur",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// ─── Metadata ──────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "فرحة — دعوات رقمية من الجزائر",
    template: "%s · فرحة",
  },
  description:
    "أنشئوا دعوات زفاف ومناسبات رقمية أنيقة، وشاركوها برابط واحد. Farha — invitations numériques d'Algérie.",
  applicationName: "Farha",
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "فرحة · Farha",
    title: "فرحة — دعوات رقمية من الجزائر",
    description: "دعوة واحدة، رابط واحد، لكل ضيوفكم.",
  },
  robots: { index: true, follow: true },
};

// ─── Layout ────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={[
        arefRuqaa.variable,
        ibmPlexArabic.variable,
        inter.variable,
        jost.variable,
        monsieur.variable,
        playfair.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  );
}