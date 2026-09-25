import Link from "next/link";
import ElegantTemplate from "@/components/invitations/ElegantTemplate";

const demoData = {
  id: "demo",
  brideName: "Sara",
  groomName: "Ahmed",
  weddingDate: new Date("2027-08-15"),
  weddingTime: "7:00 PM",
  venue: "Salle El Djazair",
  address: "Hydra",
  venueCity: "Algiers",
  venueAddress: "Hydra",
  message: "With hearts full of joy, we invite you to our wedding celebration.",
  duaText: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا",
  groomFamilyLabel: "Groom's parents",
  groomFamilyNames: "Mr. Karim & Mrs. Houda",
  brideFamilyLabel: "Bride's parents",
  brideFamilyNames: "Mr. Sami & Mrs. Rana",
  closingText: "Your presence opens the doors of our happiness",
  contactButtonText: "Confirm by WhatsApp",
  contactName: "Abu Ahmed",
  contactWhatsapp: "213700000000",
  adultsOnlyEnabled: true,
  dressCodeIntro: "Algiers elegance",
  dressCodeForHer: "Traditional Algerian karakou or elegant evening wear are welcome.",
  dressCodeForHim: "Formal suit or traditional attire.",
  programItems: [
    { id: "d1", time: "7:00 PM", title: "Guest reception" },
    { id: "d2", time: "8:00 PM", title: "Ceremony begins" },
    { id: "d3", time: "9:00 PM", title: "Dinner" },
  ],
  storyMilestones: [
    { id: "s1", year: "2023", title: "The first meeting", description: "Fate brought us together for the first time." },
    { id: "s2", year: "2026", title: "The wedding", description: "And now begins the most beautiful celebration." },
  ],
  notes: [
    { id: "n1", text: "Please arrive half an hour before the ceremony begins.", isFeatured: false },
  ],
  guests: [],
  photos: [
    { id: "p1", url: "https://picsum.photos/seed/demo1/800/800", role: "COUPLE", position: 0 },
    { id: "p2", url: "https://picsum.photos/seed/demo2/600/600", role: "MEMORY", position: 1 },
    { id: "p3", url: "https://picsum.photos/seed/demo3/600/600", role: "MEMORY", position: 2 },
  ],
};

export default function ElegantDemoPage() {
  return (
    <div>
      <div className="bg-[#c6a15b] text-[#1c1b29] text-center text-sm py-2 px-4">
        This is a demo preview with sample names — tap the envelope to see the animation
      </div>
      <ElegantTemplate invitation={demoData} />
      <div className="bg-[#1c1b29] text-center py-6">
        <Link
          href="/create"
          className="inline-block bg-[#6e2a3d] text-[#f6efe6] px-6 py-3 rounded-full text-sm"
        >
          Order this template
        </Link>
      </div>
    </div>
  );
}