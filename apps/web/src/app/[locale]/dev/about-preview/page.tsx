import { PeriodListItem } from "@repo/ui/components/period-list-item";
import { TimelineStrip } from "@repo/ui/components/timeline-strip";

import {
  formatLocation,
  formatYears,
  getPeriodBorderClass,
  getPeriodTextClass,
  getStartYear,
  isPeriodHighlighted,
  periods,
  type Period,
} from "@/types/timeline";

const CURRENT_YEAR = 2026;
const AXIS_START_YEAR = 2000;

function buildTooltip(period: Period): string {
  const years = formatYears(period, "present");
  return `${period.organization} · ${years}`;
}

export default function AboutPreviewPage() {
  // Strip data: oldest-first, in chronological order so tab order works.
  const stripPeriods = periods.map((p) => ({
    id: p.id,
    startYear: getStartYear(p),
    tw: getPeriodTextClass(p),
    highlighted: isPeriodHighlighted(p),
    tooltip: buildTooltip(p),
  }));

  // List data: newest-first per spec ("Origin at the bottom").
  const listPeriods = [...periods].reverse();

  return (
    <main className="min-h-screen bg-background p-8 text-foreground md:p-16">
      <header className="mb-8">
        <h1 className="font-mono text-sm uppercase tracking-widest">
          About — preview
        </h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Temporary review page (gated to NODE_ENV=development).
          Renders the §5 components against real data.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          TimelineStrip
        </h2>
        <TimelineStrip
          periods={stripPeriods}
          axisStartYear={AXIS_START_YEAR}
          axisEndYear={CURRENT_YEAR}
          axisLabel="Career timeline 2000–2026, with 1990 origin"
        />
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          PeriodListItem — all 16 periods, newest first
        </h2>
        <ol className="flex flex-col">
          {listPeriods.map((p) => (
            <li key={p.id}>
              <PeriodListItem
                id={p.id}
                yearsLabel={formatYears(p, "present")}
                organization={p.organization}
                role={p.role}
                location={formatLocation(p.location)}
                tech={p.tech}
                body={p.summary}
                highlighted={isPeriodHighlighted(p)}
                accentTw={getPeriodBorderClass(p)}
                notable={p.notable}
              />
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
