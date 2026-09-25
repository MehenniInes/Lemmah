import Link from "next/link";

const templates = [
  { key: "elegant", name: "Elegant", description: "Envelope opens to reveal your invitation" },
  // more templates get added here as you build them
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#1c1b29] text-[#f6efe6] px-4 py-10">
      <h1 className="text-2xl mb-6 text-center">Pick your invitation style</h1>
      <div className="max-w-md mx-auto grid grid-cols-1 gap-4">
        {templates.map((t) => (
          <Link
            key={t.key}
            href={`/templates/${t.key}`}
            className="block bg-[#2c2a3d] rounded p-5 border border-[#c6a15b]/30"
          >
            <div className="text-lg text-[#e3c383]">{t.name}</div>
            <div className="text-sm text-[#f6efe6]/60 mt-1">{t.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}