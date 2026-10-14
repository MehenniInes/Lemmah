"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import RsvpForm from "./RsvpForm";

/* =========================================================
   TYPES
   ========================================================= */

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

/* =========================================================
   PALETTE  (pink / cream / champagne)
   ========================================================= */

const C = {
  blush: "#f7e6e6",
  blushDeep: "#efd0d0",
  cream: "#fdf8f0",
  creamWarm: "#f5ead9",
  gold: "#c9a86a",
  goldSoft: "#e0c79a",
  rose: "#6b3a3a",
  roseSoft: "#8a5252",
  leaf: "#8a9a7b",
  leafDeep: "#5f7355",
  ink: "#4a2f2f",
  inkSoft: "#7a5555",
};

/* =========================================================
   DECORATIVE SVGs
   ========================================================= */

function Flower({
  size = 40,
  petal = C.blushDeep,
  center = C.gold,
  rotate = 0,
}: {
  size?: number;
  petal?: string;
  center?: string;
  rotate?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="50"
          cy="30"
          rx="14"
          ry="22"
          fill={petal}
          opacity="0.85"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="8" fill={center} />
    </svg>
  );
}

function Branch({
  width = 120,
  flip = false,
  color = C.leaf,
}: {
  width?: number;
  flip?: boolean;
  color?: string;
}) {
  return (
    <svg
      width={width}
      height={width * 2}
      viewBox="0 0 120 240"
      aria-hidden="true"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path d="M60 235 C58 180 62 120 60 5" stroke={color} strokeWidth="1.5" fill="none" />
      {[30, 70, 110, 150, 190].map((y, i) => (
        <ellipse
          key={y}
          cx={i % 2 ? 78 : 42}
          cy={y}
          rx="26"
          ry="10"
          fill={color}
          opacity="0.7"
          transform={`rotate(${i % 2 ? 30 : -30} ${i % 2 ? 78 : 42} ${y})`}
        />
      ))}
      {[50, 90, 130, 170].map((y, i) => (
        <circle key={y} cx={i % 2 ? 84 : 36} cy={y} r="4" fill={C.goldSoft} opacity="0.9" />
      ))}
    </svg>
  );
}

function CornerBranch({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined, width: 110, height: 110 }}
    >
      <path d="M5 155 C20 110 50 70 95 40 C120 25 140 15 155 10" stroke={C.leafDeep} strokeWidth="1.2" fill="none" opacity="0.55" />
      {[20, 55, 90, 125].map((x, i) => (
        <ellipse
          key={x}
          cx={x}
          cy={150 - x * 0.7}
          rx="18"
          ry="7"
          fill={C.leaf}
          opacity="0.5"
          transform={`rotate(${-40 + i * 12} ${x} ${150 - x * 0.7})`}
        />
      ))}
      {[40, 80, 120].map((x) => (
        <circle key={x} cx={x} cy={145 - x * 0.7} r="4" fill={C.goldSoft} opacity="0.85" />
      ))}
    </svg>
  );
}

function GoldRule({ color = C.gold }: { color?: string }) {
  return (
    <div className="my-5 flex items-center justify-center gap-3" style={{ color }}>
      <span className="h-px w-10 sm:w-12" style={{ background: color, opacity: 0.5 }} />
      <span className="text-[11px]">✦</span>
      <span className="h-px w-10 sm:w-12" style={{ background: color, opacity: 0.5 }} />
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  const titleColor = dark ? C.cream : C.rose;
  const eyebrowColor = dark ? C.goldSoft : C.roseSoft;
  return (
    <div className="mb-8 text-center">
      <p className="mb-2 text-[9px] uppercase tracking-[0.42em]" style={{ color: eyebrowColor }}>
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-normal tracking-wide sm:text-4xl" style={{ color: titleColor }}>
        {title}
      </h2>
      <GoldRule color={dark ? C.goldSoft : C.gold} />
    </div>
  );
}

/* =========================================================
   AMBIENT PETALS
   ========================================================= */

function Petals({ count = 7, reduced = false }: { count?: number; reduced?: boolean }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 10,
        size: 8 + Math.random() * 10,
        rotate: Math.random() * 360,
        color: Math.random() > 0.5 ? C.blushDeep : C.goldSoft,
      })),
    [count]
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-10%] block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.7,
            background: p.color,
            borderRadius: "50% 0 50% 50%",
            opacity: 0.5,
          }}
          initial={{ y: "-10vh", rotate: p.rotate }}
          animate={{ y: "110vh", rotate: p.rotate + 360, x: [0, 20, -15, 10, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   FLORAL GATE (opening scene)
   ========================================================= */

function FloralGate({ open, reduced }: { open: boolean; reduced: boolean }) {
  const panelTransition = {
    duration: reduced ? 0.2 : 1.4,
    ease: [0.65, 0, 0.35, 1] as const,
  };

  return (
    <>
      <motion.div
        className="absolute inset-y-0 left-0 z-30 w-1/2 origin-right overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.blush} 0%, ${C.blushDeep} 100%)`,
          boxShadow: "inset -30px 0 60px rgba(107,58,58,.08)",
        }}
        initial={false}
        animate={open ? { x: "-105%", rotate: -6 } : { x: 0, rotate: 0 }}
        transition={panelTransition}
      >
        <div className="absolute inset-y-0 right-0 flex w-32 flex-col items-center justify-around py-10 sm:w-40">
          <motion.div animate={reduced ? {} : { y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Flower size={48} petal={C.blushDeep} rotate={-12} />
          </motion.div>
          <Branch width={70} />
          <motion.div animate={reduced ? {} : { y: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
            <Flower size={38} petal={C.goldSoft} rotate={20} />
          </motion.div>
          <Branch width={60} flip />
          <motion.div animate={reduced ? {} : { y: [0, -4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
            <Flower size={52} petal={C.blushDeep} rotate={8} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-y-0 right-0 z-30 w-1/2 origin-left overflow-hidden"
        style={{
          background: `linear-gradient(225deg, ${C.blush} 0%, ${C.blushDeep} 100%)`,
          boxShadow: "inset 30px 0 60px rgba(107,58,58,.08)",
        }}
        initial={false}
        animate={open ? { x: "105%", rotate: 6 } : { x: 0, rotate: 0 }}
        transition={panelTransition}
      >
        <div className="absolute inset-y-0 left-0 flex w-32 flex-col items-center justify-around py-10 sm:w-40">
          <motion.div animate={reduced ? {} : { y: [0, -5, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>
            <Flower size={52} petal={C.goldSoft} rotate={15} />
          </motion.div>
          <Branch width={65} flip />
          <motion.div animate={reduced ? {} : { y: [0, 6, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}>
            <Flower size={44} petal={C.blushDeep} rotate={-18} />
          </motion.div>
          <Branch width={75} />
          <motion.div animate={reduced ? {} : { y: [0, -3, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}>
            <Flower size={48} petal={C.goldSoft} rotate={-8} />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function Opening({
  invitation,
  onOpen,
}: {
  invitation: InvitationData;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!opened) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    window.setTimeout(() => onOpen(), reduced ? 150 : 900);
  };

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(invitation.weddingDate));

  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 40%, ${C.cream} 0%, ${C.blush} 60%, ${C.blushDeep} 100%)`,
      }}
    >
      <Petals count={7} reduced={reduced} />

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(201,168,106,.15) 100%)` }}
      />

      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-md flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={opened ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: reduced ? 0 : 0.9, duration: 0.8 }}
          className="text-[10px] uppercase tracking-[0.5em]"
          style={{ color: C.roseSoft }}
        >
          The wedding of
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={opened ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: reduced ? 0 : 1.05, duration: 0.9 }}
          className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl"
          style={{ color: C.rose }}
        >
          {invitation.brideName}
          <span className="my-2 block text-3xl font-light italic" style={{ color: C.gold }}>
            &amp;
          </span>
          {invitation.groomName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={opened ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: reduced ? 0 : 1.35, duration: 0.7 }}
        >
          <GoldRule />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={opened ? { opacity: 1 } : {}}
          transition={{ delay: reduced ? 0 : 1.5, duration: 0.7 }}
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: C.roseSoft }}
        >
          {dateLabel}
        </motion.p>
      </div>

      <AnimatePresence>
        {!opened && (
          <motion.div
            key="preopen"
            className="absolute inset-0 z-40"
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 1.2 }}
          >
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: C.roseSoft, opacity: 0.55 }}>
                You are invited to
              </p>
              <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl" style={{ color: C.rose, opacity: 0.65 }}>
                {invitation.brideName}
                <span className="my-1 block text-2xl italic" style={{ color: C.gold }}>
                  &amp;
                </span>
                {invitation.groomName}
              </h1>
            </div>

            <FloralGate open={opened} reduced={reduced} />

            <motion.div
              className="absolute inset-x-0 bottom-[14%] z-50 flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.6, duration: 0.7 }}
            >
              <motion.button
                type="button"
                onClick={handleOpen}
                whileTap={{ scale: 0.94 }}
                whileHover={reduced ? {} : { y: -2 }}
                className="rounded-full px-8 py-3 text-[10px] uppercase tracking-[0.32em]"
                style={{
                  background: C.rose,
                  color: C.cream,
                  boxShadow: "0 12px 30px rgba(107,58,58,.3)",
                }}
              >
                Open Invitation
              </motion.button>

              <motion.p
                animate={reduced ? {} : { opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="text-[8px] uppercase tracking-[0.3em]"
                style={{ color: C.roseSoft }}
              >
                Tap to open
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* =========================================================
   COUNTDOWN
   ========================================================= */

function Countdown({
  timeLeft,
  reduced,
}: {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  reduced: boolean;
}) {
  const items: [string, number][] = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Minutes", timeLeft.minutes],
    ["Seconds", timeLeft.seconds],
  ];

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-10" style={{ background: C.cream }}>
      <CornerBranch className="right-0 top-0" flip />
      <div className="relative mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-0 sm:divide-x" style={{ borderColor: `${C.gold}40` }}>
          {items.map(([label, value]) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl px-4 py-5 text-center sm:rounded-none"
              style={{
                background: C.blush,
                border: `1px solid ${C.gold}30`,
              }}
            >
              <motion.div
                key={value}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-display text-3xl sm:text-4xl"
                style={{ color: C.rose }}
              >
                {String(value).padStart(2, "0")}
              </motion.div>
              <div className="mt-1 text-[8px] uppercase tracking-[0.3em]" style={{ color: C.roseSoft }}>
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MAIN TEMPLATE
   ========================================================= */

export default function ElegantTemplate({ invitation }: { invitation: InvitationData }) {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = new Date(invitation.weddingDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [invitation.weddingDate]);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(invitation.weddingDate));

  const mapsQuery = [invitation.venue, invitation.venueCity, invitation.venueAddress, invitation.address]
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

  const couplePhoto = invitation.photos.find((p) => p.role === "COUPLE");
  const memoryPhotos = invitation.photos.filter((p) => p.role === "MEMORY").sort((a, b) => a.position - b.position);
  const wishes = invitation.guests.filter((g) => g.message);

  const gallery = useMemo(() => {
    const all = [couplePhoto, ...memoryPhotos].filter(Boolean) as typeof invitation.photos;
    return all;
  }, [couplePhoto, memoryPhotos]);

  useEffect(() => {
    if (gallery.length < 2) return;
    const timer = window.setInterval(() => setActivePhoto((v) => (v + 1) % gallery.length), 5000);
    return () => window.clearInterval(timer);
  }, [gallery.length]);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: C.cream, color: C.ink }}
    >
      <AnimatePresence mode="wait">
        {!open ? (
          <Opening key="opening" invitation={invitation} onOpen={() => setOpen(true)} />
        ) : (
          <motion.main
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* HERO */}
            <section className="relative min-h-[88svh] overflow-hidden" style={{ background: C.blush }}>
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 35%, rgba(255,255,255,.75), transparent 40%), linear-gradient(120deg, ${C.blushDeep}, ${C.cream} 48%, ${C.goldSoft})`,
                }}
              />
              {couplePhoto && (
                <img
                  src={couplePhoto.url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, rgba(253,248,240,.1), rgba(253,248,240,.25), rgba(107,58,58,.3))`,
                }}
              />
              <CornerBranch className="left-0 top-0 rotate-180" />
              <CornerBranch className="right-0 bottom-0" flip />

              <div className="relative mx-auto flex min-h-[88svh] max-w-6xl items-center justify-center px-5 py-20 text-center sm:px-6">
                <div className="max-w-3xl">
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] uppercase tracking-[0.5em]"
                    style={{ color: C.roseSoft }}
                  >
                    Together with their families
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.9 }}
                    className="mt-8 font-display text-5xl font-normal leading-[.9] tracking-tight sm:text-7xl lg:text-8xl"
                    style={{ color: C.rose }}
                  >
                    {invitation.brideName}
                    <span className="my-4 block text-3xl font-light italic sm:text-4xl" style={{ color: C.gold }}>
                      &amp;
                    </span>
                    {invitation.groomName}
                  </motion.h1>
                  <GoldRule />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-[10px] uppercase tracking-[0.34em]"
                    style={{ color: C.inkSoft }}
                  >
                    {formattedDate}
                  </motion.p>
                  <p className="mt-3 text-[9px] uppercase tracking-[0.28em]" style={{ color: C.roseSoft }}>
                    {[invitation.venue, invitation.address || invitation.venueCity].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-9 flex flex-wrap justify-center gap-3">
                    <motion.a
                      whileTap={{ scale: 0.95 }}
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full px-6 py-3 text-[9px] uppercase tracking-[0.2em]"
                      style={{ background: C.rose, color: C.cream, boxShadow: "0 12px 30px rgba(107,58,58,.28)" }}
                    >
                      View venue
                    </motion.a>
                    <motion.a
                      whileTap={{ scale: 0.95 }}
                      href={calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full px-6 py-3 text-[9px] uppercase tracking-[0.2em]"
                      style={{
                        background: "rgba(253,248,240,.5)",
                        color: C.rose,
                        border: `1px solid ${C.rose}70`,
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      Add to calendar
                    </motion.a>
                  </div>
                </div>
              </div>
            </section>

            {/* INTRO */}
            <section className="relative px-5 py-14 text-center sm:px-10" style={{ background: C.cream }}>
              <CornerBranch className="right-0 top-0" flip />
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative mx-auto max-w-3xl"
              >
                <p className="font-display text-lg italic leading-relaxed sm:text-xl" style={{ color: C.inkSoft }}>
                  {invitation.message ||
                    "With hearts full of joy, we invite you to celebrate this beautiful beginning with us."}
                </p>
                <GoldRule />
                {invitation.duaText && (
                  <p className="mx-auto max-w-2xl font-display text-sm leading-8" style={{ color: C.inkSoft }}>
                    {invitation.duaText}
                  </p>
                )}
              </motion.div>
            </section>

            <Countdown timeLeft={timeLeft} reduced={reduced} />

            {/* FAMILIES */}
            {(invitation.groomFamilyNames || invitation.brideFamilyNames) && (
              <section className="relative px-5 py-16 sm:px-10" style={{ background: C.blush }}>
                <div className="mx-auto max-w-4xl text-center">
                  <SectionTitle eyebrow="With the blessings of" title="Their Families" />
                  <div className="grid gap-6 sm:grid-cols-2">
                    {invitation.brideFamilyNames && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl px-5 py-7"
                        style={{ border: `1px solid ${C.gold}50`, background: `${C.cream}80` }}
                      >
                        <p className="text-[8px] uppercase tracking-[0.35em]" style={{ color: C.roseSoft }}>
                          {invitation.brideFamilyLabel || "Bride's family"}
                        </p>
                        <p className="mt-3 font-display text-xl" style={{ color: C.rose }}>
                          {invitation.brideFamilyNames}
                        </p>
                      </motion.div>
                    )}
                    {invitation.groomFamilyNames && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl px-5 py-7"
                        style={{ border: `1px solid ${C.gold}50`, background: `${C.cream}80` }}
                      >
                        <p className="text-[8px] uppercase tracking-[0.35em]" style={{ color: C.roseSoft }}>
                          {invitation.groomFamilyLabel || "Groom's family"}
                        </p>
                        <p className="mt-3 font-display text-xl" style={{ color: C.rose }}>
                          {invitation.groomFamilyNames}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* STORY + GALLERY */}
            {(invitation.storyMilestones.length > 0 || gallery.length > 0) && (
              <section className="relative overflow-hidden px-5 py-20 sm:px-10" style={{ background: C.cream }}>
                <CornerBranch className="left-0 top-10" />
                <div className="relative mx-auto max-w-5xl">
                  {invitation.storyMilestones.length > 0 && (
                    <div className="mb-20">
                      <SectionTitle eyebrow="Two hearts, one journey" title="Our Story" />
                      <div className="mx-auto max-w-3xl">
                        {invitation.storyMilestones.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="relative grid grid-cols-[56px_1fr] gap-5 py-6 first:pt-0 last:pb-0 sm:grid-cols-[100px_1fr] sm:gap-6"
                          >
                            {index < invitation.storyMilestones.length - 1 && (
                              <span
                                className="absolute bottom-0 top-14 w-px sm:left-[49px]"
                                style={{ left: 27, background: `${C.gold}50` }}
                              />
                            )}
                            <div
                              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[9px] font-medium sm:h-12 sm:w-12"
                              style={{ border: `1px solid ${C.gold}80`, background: C.cream, color: C.roseSoft }}
                            >
                              {item.year}
                            </div>
                            <div>
                              <h3 className="font-display text-xl" style={{ color: C.rose }}>
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="mt-2 max-w-xl text-sm leading-7" style={{ color: C.inkSoft }}>
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {gallery.length > 0 && (
                    <div>
                      <SectionTitle eyebrow="Memories for a lifetime" title="Our Gallery" />
                      <div className="relative mx-auto max-w-4xl">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={gallery[activePhoto]?.id}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.6 }}
                            className="overflow-hidden rounded-lg"
                            style={{ border: `10px solid ${C.blush}`, background: C.blush }}
                          >
                            <img
                              src={gallery[activePhoto].url}
                              alt="Wedding memory"
                              className="aspect-[4/3] w-full object-cover"
                            />
                          </motion.div>
                        </AnimatePresence>
                        {gallery.length > 1 && (
                          <div className="mt-5 flex justify-center gap-2">
                            {gallery.map((photo, index) => (
                              <motion.button
                                key={photo.id}
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActivePhoto(index)}
                                aria-label={`Show photo ${index + 1}`}
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                  width: index === activePhoto ? 32 : 8,
                                  background: index === activePhoto ? C.rose : `${C.gold}80`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* PROGRAM + VENUE */}
            <section className="relative px-5 py-20 sm:px-10" style={{ background: C.blush }}>
              <CornerBranch className="right-0 top-0" flip />
              <div className="relative mx-auto grid max-w-5xl gap-14 lg:grid-cols-2">
                {invitation.programItems.length > 0 && (
                  <div>
                    <SectionTitle eyebrow="The celebration" title="The Program" />
                    <div className="mx-auto max-w-md">
                      {invitation.programItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          className="flex gap-5 py-5 last:border-0"
                          style={{ borderBottom: `1px solid ${C.gold}30` }}
                        >
                          <span className="min-w-20 text-[9px] uppercase tracking-[0.18em]" style={{ color: C.roseSoft }}>
                            {item.time}
                          </span>
                          <span className="font-display text-lg" style={{ color: C.ink }}>
                            {item.title}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <SectionTitle eyebrow="Where we gather" title="The Venue" />
                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{ background: C.cream, boxShadow: "0 18px 50px rgba(107,58,58,.12)" }}
                  >
                    <div
                      className="h-56"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${C.goldSoft}, transparent 35%), linear-gradient(135deg, ${C.blushDeep}, ${C.cream})`,
                      }}
                    />
                    <div className="p-7 text-center">
                      <h3 className="font-display text-2xl" style={{ color: C.rose }}>
                        {invitation.venue}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em]" style={{ color: C.roseSoft }}>
                        {[invitation.address, invitation.venueCity].filter(Boolean).join(" · ")}
                      </p>
                      <motion.a
                        whileTap={{ scale: 0.95 }}
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex rounded-full px-7 py-3 text-[9px] uppercase tracking-[0.2em]"
                        style={{ background: C.rose, color: C.cream }}
                      >
                        Open in Google Maps
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* DRESS CODE + NOTES */}
            {((invitation.dressCodeIntro || invitation.dressCodeForHer || invitation.dressCodeForHim) ||
              invitation.notes.length > 0 ||
              invitation.adultsOnlyEnabled) && (
              <section className="relative px-5 py-20 sm:px-10" style={{ background: C.cream }}>
                <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
                  {(invitation.dressCodeIntro || invitation.dressCodeForHer || invitation.dressCodeForHim || invitation.adultsOnlyEnabled) && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="rounded-2xl p-8 sm:p-10"
                      style={{ border: `1px solid ${C.gold}50`, background: C.blush }}
                    >
                      <p className="text-[9px] uppercase tracking-[0.38em]" style={{ color: C.roseSoft }}>
                        A note for our guests
                      </p>
                      <h2 className="mt-3 font-display text-3xl" style={{ color: C.rose }}>
                        Dress Code
                      </h2>
                      <GoldRule />
                      {invitation.dressCodeIntro && (
                        <p className="text-sm leading-7" style={{ color: C.inkSoft }}>
                          {invitation.dressCodeIntro}
                        </p>
                      )}
                      <div className="mt-5 space-y-4 text-sm leading-7" style={{ color: C.inkSoft }}>
                        {invitation.dressCodeForHer && (
                          <p>
                            <strong style={{ color: C.rose }}>For her:</strong> {invitation.dressCodeForHer}
                          </p>
                        )}
                        {invitation.dressCodeForHim && (
                          <p>
                            <strong style={{ color: C.rose }}>For him:</strong> {invitation.dressCodeForHim}
                          </p>
                        )}
                        {invitation.adultsOnlyEnabled && (
                          <p
                            className="pt-4 text-[11px] uppercase tracking-[0.16em]"
                            style={{ borderTop: `1px solid ${C.gold}40`, color: C.roseSoft }}
                          >
                            Adults-only celebration
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {invitation.notes.length > 0 && (
                    <div className="flex flex-col justify-center">
                      <p className="text-[9px] uppercase tracking-[0.38em]" style={{ color: C.roseSoft }}>
                        Kindly remember
                      </p>
                      <h2 className="mt-3 font-display text-3xl" style={{ color: C.rose }}>
                        A Few Notes
                      </h2>
                      <GoldRule />
                      <div className="space-y-4">
                        {invitation.notes.map((note) => (
                          <p
                            key={note.id}
                            className="pb-4 text-sm leading-7 last:border-0"
                            style={{ borderBottom: `1px solid ${C.gold}30`, color: C.inkSoft }}
                          >
                            {note.isFeatured ? "✦ " : ""}
                            {note.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* RSVP */}
            <section className="relative px-5 py-20 sm:px-10" style={{ background: C.rose, color: C.cream }}>
              <CornerBranch className="left-0 top-0 rotate-180" />
              <CornerBranch className="bottom-0 right-0" flip />
              <div className="relative mx-auto max-w-2xl">
                <div className="mb-10 text-center">
                  <p className="text-[9px] uppercase tracking-[0.42em]" style={{ color: C.goldSoft }}>
                    Kindly confirm your attendance
                  </p>
                  <h2 className="mt-3 font-display text-4xl font-normal" style={{ color: C.cream }}>
                    RSVP
                  </h2>
                  <GoldRule color={C.goldSoft} />
                </div>
                <div
                  className="rounded-2xl p-5 sm:p-8"
                  style={{
                    border: `1px solid ${C.goldSoft}40`,
                    background: "rgba(253,248,240,.08)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <RsvpForm invitationId={invitation.id} />
                </div>
              </div>
            </section>

            {/* WISHES */}
            {wishes.length > 0 && (
              <section className="px-5 py-20 sm:px-10" style={{ background: C.blush }}>
                <div className="mx-auto max-w-3xl">
                  <SectionTitle eyebrow="From our loved ones" title="Warm Wishes" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {wishes.map((guest) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl p-6"
                        style={{ border: `1px solid ${C.gold}40`, background: C.cream }}
                      >
                        <p className="font-display text-lg" style={{ color: C.rose }}>
                          {guest.name}
                        </p>
                        <p className="mt-3 text-sm italic leading-7" style={{ color: C.inkSoft }}>
                          &ldquo;{guest.message}&rdquo;
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* CLOSING */}
            <section className="relative overflow-hidden px-5 py-28 text-center sm:px-10" style={{ background: C.creamWarm }}>
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,.6), transparent 45%)` }}
              />
              <CornerBranch className="left-0 top-0 rotate-180" />
              <CornerBranch className="bottom-0 right-0" flip />
              <div className="relative mx-auto max-w-3xl">
                <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: C.roseSoft }}>
                  Until we celebrate together
                </p>
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 font-display text-3xl font-normal leading-tight sm:text-5xl"
                  style={{ color: C.rose }}
                >
                  {invitation.closingText || "Your presence opens the doors of our happiness."}
                </motion.h2>
                <GoldRule />
                <p className="font-display text-3xl italic" style={{ color: C.gold }}>
                  {invitation.brideName} &amp; {invitation.groomName}
                </p>

                {invitation.contactWhatsapp && (
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    href={`https://wa.me/${invitation.contactWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-9 inline-flex rounded-full px-7 py-3 text-[9px] uppercase tracking-[0.2em]"
                    style={{ background: C.rose, color: C.cream, boxShadow: "0 12px 30px rgba(107,58,58,.28)" }}
                  >
                    {invitation.contactButtonText || "Contact us on WhatsApp"}
                    {invitation.contactName ? ` · ${invitation.contactName}` : ""}
                  </motion.a>
                )}
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}