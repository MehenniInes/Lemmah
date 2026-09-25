"use client";

import { useState } from "react";
import { submitRsvp } from "@/app/i/[slug]/actions";

export default function RsvpForm({ invitationId }: { invitationId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  if (submitted) {
    return (
      <div className="mt-4 text-sm text-[#6e2a3d]">
        Thank you — your response has been recorded.
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
      className="mt-4 w-full text-left text-sm"
    >
      <input type="hidden" name="invitationId" value={invitationId} />

      <div className="mb-2">
        <label className="block text-xs text-[#5a5670] mb-1">Your name</label>
        <input name="name" required className="w-full border border-[#e0d5c3] rounded px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-xs text-[#5a5670] mb-1">Will you attend?</label>
        <select name="attendance" required className="w-full border border-[#e0d5c3] rounded px-2 py-1">
          <option value="COMING">Yes, I&apos;ll be there</option>
          <option value="MAYBE">Maybe</option>
          <option value="NOT_COMING">No, I can&apos;t make it</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-xs text-[#5a5670] mb-1">Number of companions</label>
        <input
          type="number"
          name="companions"
          min={0}
          defaultValue={0}
          className="w-full border border-[#e0d5c3] rounded px-2 py-1"
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs text-[#5a5670] mb-1">Message (optional)</label>
        <textarea name="message" rows={2} className="w-full border border-[#e0d5c3] rounded px-2 py-1" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 bg-[#6e2a3d] text-[#f6efe6] px-4 py-2 rounded-full text-sm disabled:opacity-50"
      >
        {pending ? "Sending..." : "Confirm attendance"}
      </button>
    </form>
  );
}