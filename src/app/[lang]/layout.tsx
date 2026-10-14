import { notFound } from "next/navigation";
import { DIR, isLang } from "@/lib/i18n";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <div
      lang={lang}
      dir={DIR[lang]}
      className={`lang-${lang} font-body min-h-screen bg-bg text-text`}
    >
      {children}
    </div>
  );
}