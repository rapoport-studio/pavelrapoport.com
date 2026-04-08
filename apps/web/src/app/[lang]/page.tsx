import { type Locale } from "@/lib/i18n";
import { ComingSoon } from "@/components/ComingSoon";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return <ComingSoon lang={lang as Locale} />;
}
