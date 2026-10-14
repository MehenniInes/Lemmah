import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate } from "@/templates";

export default function ElegantDemoPage() {
  const template = getTemplate("elegant");
  if (!template) notFound();

  const { Component, demoData } = template;

  return (
    <div>
      <div className="bg-[#c6a15b] text-[#1c1b29] text-center text-sm py-2 px-4">
        This is a demo preview with sample names — tap the envelope to see the animation
      </div>
      <Component invitation={demoData} />
      <div className="bg-[#1c1b29] text-center py-6">
        <Link
          href="/create"
          className="inline-block bg-[#6e2a3d] text-[#f6efe6] px-6 py-3 rounded-full text-sm"
        >
          Order this template
        </Link>
      </div>
    </div>
  );
}