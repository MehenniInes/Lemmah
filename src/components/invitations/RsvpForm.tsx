"use client";

import { useState } from "react";
import { submitRsvp } from "@/app/i/[slug]/actions";

export default function RsvpForm({ invitationId }: { invitationId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  if (submitted) {
    return (
      <div className="p-3 bg-[#E7E2CE]/20 rounded-xl text-xs font-semibold text-[#E7E2CE] font-sans text-center">
        Thank you! Your response has been recorded.
      </div>
    );
  }

  return (
    <form
      action={async (formData) => {
        setPending(true);
        await submitRsvp(formData);
        setPending(false);
        setSubmitted(true);
      }}
      className="w-full text-left font-sans space-y-3"
    >
      <div className="text-[10px] uppercase tracking-[0.25em] text-[#BEB7A7] text-center mb-3">
        Kindly Respond
      </div>

      <input type="hidden" name="invitationId" value={invitationId} />

      <div>
        <label className="block text-[11px] font-medium text-[#BEB7A7] mb-1">Your Full Name</label>
        <input
          name="name"
          required
          className="w-full bg-[#0B1530]/80 border border-[#BEB7A7]/40 rounded-xl px-3 py-2 text-xs text-[#F5F4F0] focus:outline-none focus:border-[#E7E2CE]"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-[#BEB7A7] mb-1">Will you attend?</label>
        <select
          name="attendance"
          required
          className="w-full bg-[#0B1530]/80 border border-[#BEB7A7]/40 rounded-xl px-3 py-2 text-xs text-[#F5F4F0] focus:outline-none focus:border-[#E7E2CE]"
        >
          <option value="COMING" className="bg-[#112250]">Joyfully Accept</option>
          <option value="MAYBE" className="bg-[#112250]">Tentative</option>
          <option value="NOT_COMING" className="bg-[#112250]">Regretfully Decline</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-[#BEB7A7] mb-1">Number of Companions</label>
        <input
          type="number"
          name="companions"
          min={0}
          defaultValue={0}
          className="w-full bg-[#0B1530]/80 border border-[#BEB7A7]/40 rounded-xl px-3 py-2 text-xs text-[#F5F4F0] focus:outline-none focus:border-[#E7E2CE]"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-[#BEB7A7] mb-1">Message for the Couple</label>
        <textarea
          name="message"
          rows={2}
          className="w-full bg-[#0B1530]/80 border border-[#BEB7A7]/40 rounded-xl px-3 py-2 text-xs text-[#F5F4F0] focus:outline-none focus:border-[#E7E2CE]"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-gradient-to-r from-[#BEB7A7] via-[#E7E2CE] to-[#BEB7A7] text-[#112250] py-2.5 rounded-full text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all disabled:opacity-50"
      >
        {pending ? "Sending..." : "Confirm RSVP"}
      </button>
    </form>
  );
}