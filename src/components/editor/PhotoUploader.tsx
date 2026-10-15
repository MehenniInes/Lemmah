"use client";

import { useRef, useState } from "react";
import type { InvitationFormInput } from "@/lib/invitation-schema";
import { uploadPhotos } from "@/lib/edit-actions";

const MAX_FILES = 10;
const MAX_SIZE = 5 * 1024 * 1024;

type Photo = InvitationFormInput["photos"][number];

export default function PhotoUploader({
  code,
  photos,
  onChange,
  readOnly,
}: {
  code: string;
  photos: Photo[];
  onChange: (next: Photo[]) => void;
  readOnly?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setError(null);

    if (photos.length + files.length > MAX_FILES) {
      setError(`الحد الأقصى ${MAX_FILES} صور.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    for (const f of files) {
      if (!f.type.startsWith("image/")) {
        setError("الصيغ المسموحة: JPG، PNG، WebP.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      if (f.size > MAX_SIZE) {
        setError("أقصى حجم للصورة 5 ميجابايت.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    const fd = new FormData();
    for (const f of files) fd.append("file", f);

    setUploading(true);
    try {
      const res = await uploadPhotos(code, fd);
      if (!res.ok) {
        setError(errorMessage(res.error));
        return;
      }
      const baseIndex = photos.length;
      const next: Photo[] = [
        ...photos,
        ...res.photos.map((p, i) => ({
          id: `p_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`,
          url: p.url,
          role: baseIndex === 0 && i === 0 ? "COUPLE" : "MEMORY",
          position: baseIndex + i,
        })),
      ] as Photo[];
      onChange(next);
    } catch {
      setError("خطأ غير متوقع أثناء الرفع.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(id: string) {
    const next = photos
      .filter((p) => p.id !== id)
      .map((p, i) => ({ ...p, position: i }));
    onChange(next);
  }

  function setAsCouple(id: string) {
    const next = photos.map((p) => ({
      ...p,
      role: p.id === id ? ("COUPLE" as const) : ("MEMORY" as const),
    }));
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p) => (
            <div
              key={p.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-[#D4AF37]/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt=""
                className="h-full w-full object-cover"
              />
              {p.role === "COUPLE" && (
                <span className="absolute left-1 top-1 rounded-full bg-[#6e2a3d] px-2 py-0.5 text-[9px] text-white">
                  رئيسية
                </span>
              )}
              {!readOnly && (
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 p-1 text-[10px] text-white">
                  {p.role !== "COUPLE" && (
                    <button
                      type="button"
                      onClick={() => setAsCouple(p.id)}
                      className="px-1"
                    >
                      رئيسية
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="ml-auto px-1"
                  >
                    حذف
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && photos.length < MAX_FILES && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onFiles}
            disabled={uploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-xl border-2 border-dashed border-[#D4AF37]/50 py-4 text-sm text-[#9A7B1C] transition hover:bg-[#FCE7F0] disabled:opacity-50"
          >
            {uploading ? "جاري الرفع…" : "＋ إضافة صور"}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-[#6e2a3d]">{error}</p>}

      <p className="text-[11px] text-[#6b5b66]">
        {photos.length} / {MAX_FILES} صور. JPG، PNG أو WebP. أقصى حجم 5 ميجابايت.
      </p>
    </div>
  );
}

function errorMessage(key: string): string {
  switch (key) {
    case "rate":
      return "طلبات كثيرة. حاول بعد قليل.";
    case "not_image":
      return "يُسمح بالصور فقط.";
    case "too_large":
      return "أقصى حجم للصورة 5 ميجابايت.";
    case "too_many":
      return "الحد الأقصى 10 صور.";
    case "upload_failed":
      return "تعذّر رفع إحدى الصور.";
    case "readonly":
      return "لا يمكن التعديل بعد استهلاك الحد المسموح.";
    default:
      return "تعذّر رفع الصور.";
  }
}