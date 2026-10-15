"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getTemplate } from "@/templates";
import type { InvitationFormInput } from "@/lib/invitation-schema";
import { formToPreview, type PreviewMeta } from "@/lib/form-to-preview";
import { saveDraft } from "@/lib/edit-actions";
import { publishOrder, type PublishResult } from "@/lib/publish-actions";
import CopyButton from "@/components/CopyButton";
import EditorForm from "./EditorForm";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const SAVE_DEBOUNCE_MS = 1500;

export default function EditorShell({
  code,
  initial,
  meta,
}: {
  code: string;
  initial: InvitationFormInput;
  meta: PreviewMeta & { editsRemaining: number };
}) {
  const [form, setForm] = useState(initial);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [editsRemaining, setEditsRemaining] = useState(meta.editsRemaining);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(
    null
  );
  const firstRender = useRef(true);

  const readOnly = editsRemaining <= 0;

  const previewData = useMemo(
    () => formToPreview(form, meta),
    [form, meta]
  );

  const template = getTemplate(meta.templateKey);
  const PreviewComponent = template?.Component;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (readOnly) return;

    setStatus("saving");
    const timer = window.setTimeout(async () => {
      try {
        const res = await saveDraft(code, form);
        setStatus(res.ok ? "saved" : "error");
      } catch {
        setStatus("error");
      }
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [form, code, readOnly]);

  const statusText =
    status === "saving"
      ? "جاري الحفظ…"
      : status === "saved"
        ? "تم الحفظ ✓"
        : status === "error"
          ? "تعذّر الحفظ"
          : null;

  async function handlePublish() {
    setPublishing(true);
    setPublishError(null);
    try {
      const res = await publishOrder(code, form);
      if (res.ok) {
        setEditsRemaining(res.editsRemaining);
        setPublishResult(res);
        setConfirmOpen(false);
      } else {
        setPublishError(publishErrorMessage(res.error));
      }
    } catch {
      setPublishError("تعذّر النشر. حاول مرة أخرى.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF7F9] text-[#231F20]">
      <header className="sticky top-0 z-20 border-b border-[#D4AF37]/25 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="font-display text-lg sm:text-xl">تعديل الدعوة</h1>
            <p className="mt-0.5 text-xs text-[#6b5b66]">
              التعديلات المتبقية:{" "}
              <span className="text-[#9A7B1C]">{editsRemaining}</span>
              {statusText && (
                <>
                  {" · "}
                  <span
                    className={
                      status === "error" ? "text-[#6e2a3d]" : "text-[#9A7B1C]"
                    }
                  >
                    {statusText}
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="rounded-full border border-[#D4AF37]/50 px-3 py-2 text-xs text-[#9A7B1C] transition hover:bg-[#FCE7F0] lg:hidden"
            >
              {showPreview ? "النموذج" : "معاينة"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={readOnly}
              className="rounded-full bg-[#6e2a3d] px-4 py-2 text-xs text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-sm"
            >
              {readOnly ? "استنفدت التعديلات" : "نشر الدعوة"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        <div className={showPreview ? "hidden lg:block" : "block"}>
          <EditorForm
            code={code}
            form={form}
            setForm={setForm}
            readOnly={readOnly}
          />
        </div>

        <aside
          className={`${
            showPreview ? "block" : "hidden lg:block"
          } lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]`}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-white shadow-sm">
            <p className="border-b border-[#D4AF37]/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#9A7B1C]">
              معاينة مباشرة
            </p>
            <div className="flex-1 overflow-y-auto">
              {PreviewComponent ? (
                <PreviewComponent invitation={previewData} previewMode />
              ) : (
                <p className="p-6 text-sm text-[#6b5b66]">
                  القالب غير متوفر.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {confirmOpen && (
        <ConfirmationDialog
          editsRemaining={editsRemaining}
          publishing={publishing}
          error={publishError}
          onCancel={() => {
            if (!publishing) {
              setConfirmOpen(false);
              setPublishError(null);
            }
          }}
          onConfirm={handlePublish}
        />
      )}

      {publishResult?.ok && (
        <SuccessOverlay
          result={publishResult}
          onClose={() => setPublishResult(null)}
        />
      )}
    </div>
  );
}

function publishErrorMessage(key: string): string {
  switch (key) {
    case "rate":
      return "طلبات كثيرة. حاول بعد قليل.";
    case "notfound":
      return "الطلب غير موجود.";
    case "unpaid":
      return "لم يتم تأكيد الدفع بعد.";
    case "exhausted":
      return "استنفدتم عدد التعديلات المسموح بها.";
    case "expired":
      return "انتهت صلاحية الدعوة.";
    case "invalid":
      return "يرجى مراجعة البيانات المدخلة.";
    default:
      return key;
  }
}

function ConfirmationDialog({
  editsRemaining,
  publishing,
  error,
  onCancel,
  onConfirm,
}: {
  editsRemaining: number;
  publishing: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#D4AF37]/30 bg-white p-6 shadow-xl">
        <h2 className="font-display text-xl text-[#231F20]">تأكيد النشر</h2>
        <p className="mt-3 text-sm leading-7 text-[#6b5b66]">
          لديكم{" "}
          <span className="font-bold text-[#9A7B1C]">{editsRemaining}</span>{" "}
          {editsRemaining === 1 ? "تعديل متبقٍ" : "تعديلات متبقية"}. النشر
          سيستخدم واحدًا منها.
        </p>
        <p className="mt-3 text-xs leading-6 text-[#6b5b66]">
          بعد النشر، سيتمكن ضيوفكم من رؤية الدعوة عبر الرابط العام. يمكنكم
          تعديلها لاحقًا ضمن الحد المسموح.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-[#6e2a3d]/30 bg-[#FCE7F0] px-3 py-2 text-sm text-[#6e2a3d]">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={publishing}
            className="rounded-full border border-[#D4AF37]/50 px-5 py-2 text-sm text-[#9A7B1C] transition hover:bg-[#FCE7F0] disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={publishing}
            className="rounded-full bg-[#6e2a3d] px-6 py-2 text-sm text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {publishing ? "جاري النشر…" : "تأكيد النشر"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessOverlay({
  result,
  onClose,
}: {
  result: Extract<PublishResult, { ok: true }>;
  onClose: () => void;
}) {
  const waText = `دعوتنا جاهزة! شاركوا معنا الفرحة:\n${result.publicUrl}`;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 px-4 py-8">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#D4AF37]/30 bg-white p-6 shadow-xl sm:p-8">
        <div className="text-center">
          <p className="text-4xl text-[#9A7B1C]" aria-hidden="true">
            ✓
          </p>
          <h2 className="mt-3 font-display text-2xl">تم نشر الدعوة</h2>
          <p className="mt-2 text-sm text-[#6b5b66]">
            يمكن لضيوفكم رؤيتها الآن عبر الرابط أدناه.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-[#D4AF37]/30 bg-[#FDF0F4] p-4">
          <p className="text-xs text-[#6b5b66]">
            الرابط العام (شاركوه مع ضيوفكم)
          </p>
          <code
            dir="ltr"
            className="mt-2 block break-all rounded bg-white px-2 py-1 text-xs text-[#6e2a3d]"
          >
            {result.publicUrl}
          </code>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton
              text={result.publicUrl}
              label="نسخ الرابط"
              className="rounded-full border border-[#D4AF37]/50 px-3 py-1.5 text-xs text-[#9A7B1C] hover:bg-white"
            />
            <a
              href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#6e2a3d] px-3 py-1.5 text-xs text-white hover:brightness-110"
            >
              مشاركة واتساب
            </a>
          </div>
        </div>

        {result.manageUrl && (
          <div className="mt-4 rounded-xl border-2 border-[#6e2a3d]/40 bg-[#FCE7F0] p-4">
            <p className="text-xs font-bold text-[#6e2a3d]">
              ⚠️ رابط الإدارة الخاص بكم — احفظوه الآن!
            </p>
            <p className="mt-1 text-[11px] leading-6 text-[#6b5b66]">
              يظهر هذا الرابط مرة واحدة فقط. استخدموه للاطلاع على تأكيدات
              الحضور ورسائل الضيوف.
            </p>
            <code
              dir="ltr"
              className="mt-2 block break-all rounded bg-white px-2 py-1 text-xs text-[#6e2a3d]"
            >
              {result.manageUrl}
            </code>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton
                text={result.manageUrl}
                label="نسخ رابط الإدارة"
                className="rounded-full bg-[#6e2a3d] px-3 py-1.5 text-xs text-white hover:brightness-110"
              />
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-[#6b5b66]">
          {result.editsRemaining > 0 ? (
            <>
              لديكم{" "}
              <span className="font-bold text-[#9A7B1C]">
                {result.editsRemaining}
              </span>{" "}
              تعديلات متبقية. يمكنكم مواصلة التعديل الآن.
            </>
          ) : (
            <>
              استنفدتم عدد التعديلات المسموح بها. دعوتكم تبقى متاحة لضيوفكم حتى
              أسبوع بعد الحفل.
            </>
          )}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#6e2a3d] px-8 py-2 text-sm text-white transition hover:brightness-110"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
}