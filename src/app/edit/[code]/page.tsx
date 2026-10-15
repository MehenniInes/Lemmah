import Link from "next/link";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashEditCode, normalizeEditCodeInput } from "@/lib/edit-code";
import { rateLimit } from "@/lib/rate-limit";
import {
  invitationFormSchema,
  emptyInvitationForm,
  type InvitationFormInput,
} from "@/lib/invitation-schema";
import EditorShell from "@/components/editor/EditorShell";

async function getIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

function FriendlyError({ title, text }: { title: string; text: string }) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#FFF7F9] px-6 text-[#231F20]"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#D4AF37]/30 bg-white p-8 text-center shadow-sm">
        <p className="text-4xl text-[#D4AF37]" aria-hidden="true">
          ✦
        </p>
        <h1 className="mt-4 font-display text-2xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-[#6b5b66]">{text}</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#D4AF37]/60 px-6 text-sm text-[#9A7B1C] transition hover:bg-[#FCE7F0]"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

/** Merge saved draft JSON with the schema defaults so missing fields don't crash the form. */
function hydrateForm(draft: unknown): InvitationFormInput {
  const base = emptyInvitationForm();
  if (!draft || typeof draft !== "object") return base;

  const parsed = invitationFormSchema.safeParse({
    ...base,
    ...(draft as Record<string, unknown>),
  });

  return parsed.success ? parsed.data : base;
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = normalizeEditCodeInput(code);
  const hash = hashEditCode(normalized);

  const ip = await getIp();
  const rl = rateLimit(`edit-lookup:${ip}`, 30, 10 * 60 * 1000);
  if (!rl.allowed) {
    return (
      <FriendlyError
        title="محاولات كثيرة"
        text={`يرجى المحاولة لاحقًا بعد ${rl.retryAfterSec} ثانية.`}
      />
    );
  }

  if (normalized.length !== 14) {
    return (
      <FriendlyError
        title="رمز التعديل غير صالح"
        text="تأكدوا من كتابة الرمز بالصيغة الصحيحة xxxx-xxxx-xxxx."
      />
    );
  }

  const order = await prisma.order.findUnique({
    where: { editCodeHash: hash },
    include: { invitation: true },
  });

  if (!order) {
    return (
      <FriendlyError
        title="رمز التعديل غير صالح"
        text="لم نعثر على طلب مرتبط بهذا الرمز."
      />
    );
  }

  if (order.status !== "PAID") {
    return (
      <FriendlyError
        title="لم يتم تأكيد الدفع بعد"
        text="يرجى إتمام الدفع عبر واتساب. بعد التأكيد سيصدر لكم رمز التعديل."
      />
    );
  }

  if (
    order.invitation?.expiresAt &&
    order.invitation.expiresAt.getTime() < Date.now()
  ) {
    return (
      <FriendlyError
        title="انتهت صلاحية الدعوة"
        text="انتهت الفترة المسموح بها لتعديل هذه الدعوة."
      />
    );
  }

  const initial = hydrateForm(order.draftData);
  const readOnly = order.editsRemaining <= 0;

  return (
       <EditorShell
      code={normalized}
      initial={initial}
      readOnly={readOnly}
      meta={{
        id: order.id,
        slug: order.invitation?.slug ?? "preview",
        templateKey: order.templateKey,
        language: "ar",
        occasionType: order.occasionType,
        status: order.invitation?.status ?? "DRAFT",
        editsRemaining: order.editsRemaining,
      }}
    />
  );
}