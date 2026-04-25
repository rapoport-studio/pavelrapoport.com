import { AboutSection } from "@/components/about/about-section";

const CURRENT_YEAR = 2026;

/**
 * Homepage. AboutSection is the primary content of pavelrapoport.com:
 * the three-act narrative (Origin → Career → Pivot) anchored at #about.
 *
 * `axisLabel` and `presentLabel` are passed as English literals for now.
 * They live outside the home.about.* i18n namespace approved in §3 — a
 * follow-up commit can localize them once the strings are reviewed.
 * Period metadata (orgs, roles, summaries) intentionally stays English
 * across locales per the spec.
 */
export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AboutSection
        axisEndYear={CURRENT_YEAR}
        axisLabel="Career timeline 2000–2026, with 1990 origin"
        presentLabel="present"
      />
    </main>
  );
}
