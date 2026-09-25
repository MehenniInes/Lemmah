import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

async function publishInvitation(formData: FormData) {
  "use server";

  const invitationId = formData.get("invitationId");
  const adminKey = formData.get("adminKey");

  if (
    typeof invitationId !== "string" ||
    adminKey !== process.env.ADMIN_SECRET
  ) {
    return;
  }

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { isPublished: true },
  });

  revalidatePath("/admin/orders");
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  if (key !== process.env.ADMIN_SECRET) {
    notFound();
  }

  const pending = await prisma.invitation.findMany({
    where: { isPublished: false },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const live = await prisma.invitation.findMany({
    where: { isPublished: true },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-[#1c1b29] text-[#f6efe6] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-6">Pending Orders ({pending.length})</h1>

        {pending.length === 0 && (
          <p className="text-[#f6efe6]/50">No pending orders right now.</p>
        )}

        {pending.map((inv) => (
          <div key={inv.id} className="bg-[#2c2a3d] rounded p-4 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg text-[#e3c383]">
                  {inv.brideName} &amp; {inv.groomName}
                </div>
                <div className="text-sm text-[#f6efe6]/60">
                  Customer: {inv.customer.name} — {inv.customer.email}
                  {inv.customer.whatsapp && (
                    <>
                      {" "}—{" "}
                      <a
                        href={`https://wa.me/${inv.customer.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        WhatsApp
                      </a>
                    </>
                  )}
                </div>
                <a
                  href={`/i/${inv.slug}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline text-[#c6a15b]"
                >
                  View preview →
                </a>
              </div>
              <form action={publishInvitation}>
                <input type="hidden" name="invitationId" value={inv.id} />
                <input type="hidden" name="adminKey" value={key} />
                <button
                  type="submit"
                  className="bg-[#6e2a3d] text-[#f6efe6] px-4 py-2 rounded-full text-sm"
                >
                  Mark Paid & Publish
                </button>
              </form>
            </div>
          </div>
        ))}

        <h2 className="text-xl mt-10 mb-4">Recently Published</h2>
        {live.map((inv) => (
          <div key={inv.id} className="bg-[#2c2a3d]/50 rounded p-3 mb-2 text-sm">
            {inv.brideName} &amp; {inv.groomName} —{" "}
            <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="underline text-[#c6a15b]">
              /i/{inv.slug}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}