import { createInvitation } from "./actions";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-[#1c1b29] text-[#f6efe6] px-4 py-10">
      <form action={createInvitation} className="max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl mb-4">Create Your Invitation</h1>
        <p className="text-xs text-[#f6efe6]/50">Fields marked * are required</p>

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">Your contact info</h2>
        <input name="customerName" placeholder="Your name *" required className="w-full p-2 rounded text-black" />
        <input name="customerEmail" type="email" placeholder="Your email *" required className="w-full p-2 rounded text-black" />
        <input
             name="customerWhatsapp"
             placeholder="Your WhatsApp, e.g. 0555123456"
             required
             className="w-full p-2 rounded text-black"
             />

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">Couple</h2>
        <input name="groomName" placeholder="Groom's name "  className="w-full p-2 rounded text-black" />
        <input name="brideName" placeholder="Bride's name " className="w-full p-2 rounded text-black" />

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">Event</h2>
        <label className="block text-xs text-[#f6efe6]/60">Wedding date *</label>
        <input name="weddingDate" type="date"  className="w-full p-2 rounded text-black" />
        <label className="block text-xs text-[#f6efe6]/60">Wedding time</label>
        <input name="weddingTime" type="time" className="w-full p-2 rounded text-black" />
        <input name="venueName" placeholder="Venue name" className="w-full p-2 rounded text-black" />
        <input name="venueCity" placeholder="City" className="w-full p-2 rounded text-black" />
        <input name="venueAddress" placeholder="Address" className="w-full p-2 rounded text-black" />

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">Words</h2>
        <textarea
          name="invitationText"
          placeholder="e.g. With hearts full of joy, we invite you to our wedding celebration."
          rows={2}
          className="w-full p-2 rounded text-black"
        />
        <textarea
          name="duaText"
          placeholder="e.g. وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا (optional)"
          rows={2}
          className="w-full p-2 rounded text-black"
        />
        <textarea
          name="closingText"
          placeholder="e.g. Your presence opens the doors of our happiness"
          rows={2}
          className="w-full p-2 rounded text-black"
        />

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">Contact for RSVP</h2>
        <input name="contactName" placeholder="Contact person's name" className="w-full p-2 rounded text-black" />
        <input
          name="contactWhatsapp"
          placeholder="WhatsApp number, e.g. 213700000000"
          pattern="[0-9]{9,15}"
          title="Digits only, no spaces or symbols, e.g. 213700000000"
          className="w-full p-2 rounded text-black"
        />

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">Dress code (optional)</h2>
        <input name="dressCodeIntro" placeholder="Short intro, e.g. Algiers elegance" className="w-full p-2 rounded text-black" />
        <input name="dressCodeForHer" placeholder="For her" className="w-full p-2 rounded text-black" />
        <input name="dressCodeForHim" placeholder="For him" className="w-full p-2 rounded text-black" />
        <p className="text-xs text-[#f6efe6]/40">Dress code reference photos can be added later</p>

        <label className="flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" name="adultsOnlyEnabled" /> Adults only event
        </label>

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">
          Program — one per line, format: time | title
        </h2>
        <textarea
          name="programItems"
          rows={4}
          placeholder={"7:00 PM | Guest reception\n8:00 PM | Ceremony begins"}
          className="w-full p-2 rounded text-black"
        />

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">
          Notes — one per line
        </h2>
        <textarea
          name="notes"
          rows={3}
          placeholder={"Please arrive half an hour early\nWe would be honored by your presence"}
          className="w-full p-2 rounded text-black"
        />

        <h2 className="text-sm uppercase tracking-widest text-[#c6a15b] mt-6">
          Our Story — one per line, format: year | title | description
        </h2>
        <textarea
          name="storyMilestones"
          rows={4}
          placeholder={"2023 | The first meeting | Fate brought us together"}
          className="w-full p-2 rounded text-black"
        />

        <button type="submit" className="mt-6 bg-[#6e2a3d] text-[#f6efe6] px-6 py-3 rounded-full w-full">
          Create My Invitation
        </button>
      </form>
    </div>
  );
}