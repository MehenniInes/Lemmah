"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import RsvpForm from "./RsvpForm";

type InvitationData = {
  brideName: string;
  groomName: string;
  weddingDate: Date;
  weddingTime?: string | null;
  venue: string;
  address?: string | null;
  message?: string | null;
  programItems: { id: string; time: string; title: string }[];
  storyMilestones: { id: string; year: string; title: string; description: string | null }[];
  notes: { id: string; text: string; isFeatured: boolean }[];
  venueCity?: string | null;
  venueAddress?: string | null;
  dressCodeIntro?: string | null;
  dressCodeForHer?: string | null;
  dressCodeForHim?: string | null;
  duaText?: string | null;
  groomFamilyLabel?: string | null;
  groomFamilyNames?: string | null;
  brideFamilyLabel?: string | null;
  brideFamilyNames?: string | null;
  closingText?: string | null;
  contactButtonText?: string | null;
  contactName?: string | null;
  contactWhatsapp?: string | null;
  adultsOnlyEnabled: boolean;
  id: string;
  guests: { id: string; name: string; attendance: string; companions: number; message: string | null }[];
  photos: { id: string; url: string; role: string; position: number }[];
};

export default function ElegantTemplate({ invitation }: { invitation: InvitationData }) {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(invitation.weddingDate).getTime();
    const interval = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [invitation.weddingDate]);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(invitation.weddingDate);

  const mapsQuery = [invitation.venue, invitation.venueCity, invitation.venueAddress]
    .filter(Boolean)
    .join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

  const start = new Date(invitation.weddingDate);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const toGCalFormat = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(`${invitation.brideName} & ${invitation.groomName}'s Wedding`)}` +
    `&dates=${toGCalFormat(start)}/${toGCalFormat(end)}` +
    `&location=${encodeURIComponent(mapsQuery)}`;

  const wishes = invitation.guests.filter((g) => g.message);
  const couplePhoto = invitation.photos.find((p) => p.role === "COUPLE");
  const memoryPhotos = invitation.photos
    .filter((p) => p.role === "MEMORY")
    .sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#2c2a3d] to-[#1c1b29] px-4 py-8 text-[#f6efe6]">
      <div className="w-full max-w-md" style={{ perspective: 1800 }}>
        {/* ENVELOPE */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Tap to open the invitation"
          className="relative block w-full aspect-[3/4] rounded-md border border-[#c6a15b]/30 bg-gradient-to-br from-[#2c2a3d] to-[#1c1b29] shadow-2xl overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {!open && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="text-4xl text-[#e3c383]" style={{ fontFamily: "cursive" }}>
                {invitation.brideName} &amp; {invitation.groomName}
              </div>
              <div className="text-xs uppercase tracking-widest text-white/50">Tap to open</div>
            </div>
          )}

          <motion.div
            initial={false}
            animate={{ rotateX: open ? 180 : 0 }}
            transition={{ duration: 1.1 }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            className="absolute top-0 left-0 right-0 h-[52%] z-10"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#26243a] to-[#1c1b29] border-b border-[#c6a15b]/30"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
          </motion.div>
        </button>

        {/* CARD */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 rounded bg-[#f6efe6] text-[#1c1b29] flex flex-col items-center text-center px-5 py-6 shadow-xl"
          >
            <div className="text-[11px] uppercase tracking-widest text-[#6e2a3d] mb-1">
              You&apos;re invited to the wedding of
            </div>
            <div className="text-3xl mb-2" style={{ fontFamily: "cursive" }}>
              {invitation.brideName} &amp; {invitation.groomName}
            </div>

            {couplePhoto && (
              <img
                src={couplePhoto.url}
                alt={`${invitation.brideName} & ${invitation.groomName}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#c6a15b] mb-3"
              />
            )}

            {invitation.duaText && (
              <div className="text-sm italic text-[#5a5670] mb-2 px-2">{invitation.duaText}</div>
            )}

            <div className="w-10 h-px bg-[#c6a15b] my-2" />

            <div className="text-base leading-relaxed">
              {formattedDate}
              {invitation.weddingTime ? ` · ${invitation.weddingTime}` : ""}
              <br />
              {invitation.venue}
              {invitation.address ? `, ${invitation.address}` : ""}
            </div>

            {(invitation.groomFamilyNames || invitation.brideFamilyNames) && (
              <div className="mt-3 text-xs text-[#5a5670]">
                {invitation.groomFamilyNames && (
                  <div>{invitation.groomFamilyLabel || "Groom's family"}: {invitation.groomFamilyNames}</div>
                )}
                {invitation.brideFamilyNames && (
                  <div>{invitation.brideFamilyLabel || "Bride's family"}: {invitation.brideFamilyNames}</div>
                )}
              </div>
            )}

            <div className="mt-3 flex gap-3 text-xs">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="underline text-[#6e2a3d]">
                Open in Maps
              </a>
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="underline text-[#6e2a3d]">
                Add to calendar
              </a>
            </div>

            {invitation.message && (
              <div className="mt-3 text-sm italic">{invitation.message}</div>
            )}

            <div className="mt-4 flex gap-3 text-center">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((unit) => (
                <div key={unit.label}>
                  <div className="text-xl font-semibold text-[#6e2a3d]">{unit.value}</div>
                  <div className="text-[10px] uppercase tracking-wide text-[#5a5670]">{unit.label}</div>
                </div>
              ))}
            </div>

            {invitation.programItems.length > 0 && (
              <div className="mt-4 w-full text-sm">
                {invitation.programItems.map((item) => (
                  <div key={item.id} className="flex justify-between border-t border-[#e0d5c3] py-1">
                    <span className="text-[#6e2a3d]">{item.time}</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            )}

            {invitation.storyMilestones.length > 0 && (
              <div className="mt-4 w-full text-sm text-left">
                <div className="text-[11px] uppercase tracking-widest text-[#6e2a3d] mb-2 text-center">
                  Our Story
                </div>
                {invitation.storyMilestones.map((milestone) => (
                  <div key={milestone.id} className="mb-2">
                    <div className="font-semibold text-[#6e2a3d]">
                      {milestone.year} — {milestone.title}
                    </div>
                    {milestone.description && (
                      <div className="text-xs text-[#5a5670]">{milestone.description}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {(invitation.dressCodeIntro || invitation.dressCodeForHer || invitation.dressCodeForHim) && (
              <div className="mt-4 w-full text-sm">
                <div className="text-[11px] uppercase tracking-widest text-[#6e2a3d] mb-2">
                  Dress Code
                </div>
                {invitation.dressCodeIntro && <div className="mb-1">{invitation.dressCodeIntro}</div>}
                {invitation.dressCodeForHer && (
                  <div className="text-xs"><strong>For her:</strong> {invitation.dressCodeForHer}</div>
                )}
                {invitation.dressCodeForHim && (
                  <div className="text-xs"><strong>For him:</strong> {invitation.dressCodeForHim}</div>
                )}
              </div>
            )}

            {invitation.notes.length > 0 && (
              <div className="mt-4 w-full text-xs text-left">
                <div className="text-[11px] uppercase tracking-widest text-[#6e2a3d] mb-2 text-center">
                  Notes
                </div>
                {invitation.notes.map((note) => (
                  <div key={note.id} className={note.isFeatured ? "font-semibold" : ""}>
                    ✦ {note.text}
                  </div>
                ))}
              </div>
            )}

            {invitation.adultsOnlyEnabled && (
              <div className="mt-4 text-xs text-[#5a5670] italic">
                For everyone&apos;s comfort, we kindly ask that you do not bring children.
              </div>
            )}

            {memoryPhotos.length > 0 && (
              <div className="mt-4 w-full">
                <div className="text-[11px] uppercase tracking-widest text-[#6e2a3d] mb-2 text-center">
                  Our Memories
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {memoryPhotos.map((photo) => (
                    <Image
                      key={photo.id}
                      src={photo.url}
                      alt="Memory"
                      width={300}
                      height={300}
                      className="w-full aspect-square object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            <RsvpForm invitationId={invitation.id} />

            {wishes.length > 0 && (
              <div className="mt-4 w-full text-left text-xs">
                <div className="text-[11px] uppercase tracking-widest text-[#6e2a3d] mb-2 text-center">
                  Wishes
                </div>
                {wishes.map((g) => (
                  <div key={g.id} className="mb-2">
                    <span className="font-semibold">{g.name}: </span>
                    {g.message}
                  </div>
                ))}
              </div>
            )}

            {invitation.closingText && (
              <div className="mt-4 text-sm">{invitation.closingText}</div>
            )}

            {invitation.contactWhatsapp && (
              
              <a  href={`https://wa.me/${invitation.contactWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm bg-[#6e2a3d] text-[#f6efe6] px-4 py-2 rounded-full"
              >
                {invitation.contactButtonText || "Contact us"}
                {invitation.contactName ? ` — ${invitation.contactName}` : ""}
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}