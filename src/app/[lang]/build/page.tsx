import { type Locale } from "@/lib/i18n";
import { ComingSoon } from "@/components/ComingSoon";

export default async function BuildPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return <ComingSoon lang={lang as Locale} />;
}
