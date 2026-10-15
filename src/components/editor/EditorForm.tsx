"use client";

import { useState } from "react";
import type { InvitationFormInput } from "@/lib/invitation-schema";
import PhotoUploader from "./PhotoUploader";

interface Props {
  code: string;
  form: InvitationFormInput;
  setForm: React.Dispatch<React.SetStateAction<InvitationFormInput>>;
  readOnly?: boolean;
}

export default function EditorForm({ code, form, setForm, readOnly }: Props) {
  function update<K extends keyof InvitationFormInput>(
    key: K,
    value: InvitationFormInput[K]
  ) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  const empty = (v: string) => (v === "" ? null : v);

  return (
    <div className="space-y-4">
      <Section title="الأساسيات" defaultOpen>
        <Field label="اسم العريس">
          <input
            type="text"
            value={form.groomName}
            onChange={(e) => update("groomName", e.target.value)}
            disabled={readOnly}
            maxLength={60}
            className={input}
          />
        </Field>
        <Field label="اسم العروس">
          <input
            type="text"
            value={form.brideName}
            onChange={(e) => update("brideName", e.target.value)}
            disabled={readOnly}
            maxLength={60}
            className={input}
          />
        </Field>
        <Field label="ترتيب الأسماء">
          <select
            value={form.nameOrder}
            onChange={(e) =>
              update("nameOrder", e.target.value as "groom-top" | "bride-top")
            }
            disabled={readOnly}
            className={input}
          >
            <option value="groom-top">العريس أولاً</option>
            <option value="bride-top">العروس أولاً</option>
          </select>
        </Field>
        <Field label="الشعار (اختياري)">
          <input
            type="text"
            value={form.tagline ?? ""}
            onChange={(e) => update("tagline", empty(e.target.value))}
            disabled={readOnly}
            maxLength={140}
            className={input}
          />
        </Field>
        <Field label="تاريخ الحفل">
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => update("eventDate", e.target.value)}
            disabled={readOnly}
            dir="ltr"
            className={input}
          />
        </Field>
        <Field label="الساعة (اختياري)">
          <input
            type="time"
            value={form.weddingTime ?? ""}
            onChange={(e) => update("weddingTime", empty(e.target.value))}
            disabled={readOnly}
            dir="ltr"
            className={input}
          />
        </Field>
      </Section>

      <Section title="المكان" defaultOpen>
        <Field label="اسم القاعة">
          <input
            type="text"
            value={form.venue}
            onChange={(e) => update("venue", e.target.value)}
            disabled={readOnly}
            maxLength={120}
            className={input}
          />
        </Field>
        <Field label="المدينة (اختياري)">
          <input
            type="text"
            value={form.venueCity ?? ""}
            onChange={(e) => update("venueCity", empty(e.target.value))}
            disabled={readOnly}
            maxLength={80}
            className={input}
          />
        </Field>
        <Field label="العنوان (اختياري)">
          <input
            type="text"
            value={form.venueAddress ?? ""}
            onChange={(e) => update("venueAddress", empty(e.target.value))}
            disabled={readOnly}
            maxLength={200}
            className={input}
          />
        </Field>
      </Section>

      <Section title="النصوص">
        <Field label="نص الدعوة (اختياري)">
          <textarea
            value={form.message ?? ""}
            onChange={(e) => update("message", empty(e.target.value))}
            disabled={readOnly}
            maxLength={600}
            rows={3}
            className={input}
          />
        </Field>
        <Field label="آية أو دعاء (اختياري)">
          <textarea
            value={form.duaText ?? ""}
            onChange={(e) => update("duaText", empty(e.target.value))}
            disabled={readOnly}
            maxLength={600}
            rows={3}
            className={input}
          />
        </Field>
        <Field label="نص الختام (اختياري)">
          <input
            type="text"
            value={form.closingText ?? ""}
            onChange={(e) => update("closingText", empty(e.target.value))}
            disabled={readOnly}
            maxLength={300}
            className={input}
          />
        </Field>
      </Section>

      <Section title="العائلة">
        <Field label="تسمية عائلة العريس (اختياري)">
          <input
            type="text"
            value={form.groomFamilyLabel ?? ""}
            onChange={(e) => update("groomFamilyLabel", empty(e.target.value))}
            disabled={readOnly}
            maxLength={80}
            className={input}
          />
        </Field>
        <Field label="أسماء عائلة العريس (اختياري)">
          <input
            type="text"
            value={form.groomFamilyNames ?? ""}
            onChange={(e) => update("groomFamilyNames", empty(e.target.value))}
            disabled={readOnly}
            maxLength={200}
            className={input}
          />
        </Field>
        <Field label="تسمية عائلة العروس (اختياري)">
          <input
            type="text"
            value={form.brideFamilyLabel ?? ""}
            onChange={(e) => update("brideFamilyLabel", empty(e.target.value))}
            disabled={readOnly}
            maxLength={80}
            className={input}
          />
        </Field>
        <Field label="أسماء عائلة العروس (اختياري)">
          <input
            type="text"
            value={form.brideFamilyNames ?? ""}
            onChange={(e) => update("brideFamilyNames", empty(e.target.value))}
            disabled={readOnly}
            maxLength={200}
            className={input}
          />
        </Field>
      </Section>

      <Section title="قواعد اللباس">
        <Field label="نص عام (اختياري)">
          <input
            type="text"
            value={form.dressCodeIntro ?? ""}
            onChange={(e) => update("dressCodeIntro", empty(e.target.value))}
            disabled={readOnly}
            maxLength={300}
            className={input}
          />
        </Field>
        <Field label="للنساء (اختياري)">
          <input
            type="text"
            value={form.dressCodeForHer ?? ""}
            onChange={(e) => update("dressCodeForHer", empty(e.target.value))}
            disabled={readOnly}
            maxLength={200}
            className={input}
          />
        </Field>
        <Field label="للرجال (اختياري)">
          <input
            type="text"
            value={form.dressCodeForHim ?? ""}
            onChange={(e) => update("dressCodeForHim", empty(e.target.value))}
            disabled={readOnly}
            maxLength={200}
            className={input}
          />
        </Field>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.adultsOnlyEnabled}
            onChange={(e) => update("adultsOnlyEnabled", e.target.checked)}
            disabled={readOnly}
            className="h-4 w-4 accent-[#6e2a3d]"
          />
          حفل للبالغين فقط
        </label>
      </Section>

      <Section title="للتواصل">
        <Field label="نص الزر (اختياري)">
          <input
            type="text"
            value={form.contactButtonText ?? ""}
            onChange={(e) => update("contactButtonText", empty(e.target.value))}
            disabled={readOnly}
            maxLength={80}
            className={input}
          />
        </Field>
        <Field label="اسم جهة الاتصال (اختياري)">
          <input
            type="text"
            value={form.contactName ?? ""}
            onChange={(e) => update("contactName", empty(e.target.value))}
            disabled={readOnly}
            maxLength={80}
            className={input}
          />
        </Field>
        <Field label="رقم واتساب (اختياري)">
          <input
            type="tel"
            value={form.contactWhatsapp ?? ""}
            onChange={(e) => update("contactWhatsapp", empty(e.target.value))}
            disabled={readOnly}
            maxLength={30}
            dir="ltr"
            className={input}
          />
        </Field>
      </Section>

     
              <Section title="الصور">
        <PhotoUploader
          code={code}
          photos={form.photos}
          onChange={(next) => update("photos", next)}
          readOnly={readOnly}
        />
      </Section>
    </div>
  );
}

const input =
  "w-full rounded-xl border border-[#D4AF37]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#6e2a3d] disabled:opacity-60";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-[#6b5b66]">{label}</span>
      {children}
    </label>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-[#D4AF37]/30 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-right"
        aria-expanded={open}
      >
        <span className="font-display text-base text-[#231F20]">{title}</span>
        <span
          aria-hidden="true"
          className={`text-[#9A7B1C] transition ${open ? "rotate-45" : ""}`}
        >
          ＋
        </span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-[#D4AF37]/20 px-4 py-4">
          {children}
        </div>
      )}
    </section>
  );
}