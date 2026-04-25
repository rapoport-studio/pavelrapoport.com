import { TimelineWithList } from "./timeline-with-list";

/**
 * CareerBlock — second of the three About-section acts. A short editorial
 * intro paragraph above the SVG strip and the 16-row period list.
 *
 * The intro string is resolved by AboutSection via useTranslations and
 * passed in as a prop; this component itself is a layout-only seam.
 *
 * The intro caps at max-w-3xl (~48rem) for readability — the strip and
 * list want the full max-w-5xl of the section, so the intro narrowness
 * gives the prose a breath before the dense timeline data.
 */

export interface CareerBlockProps {
  intro: string;
  axisEndYear: number;
  axisLabel: string;
  presentLabel: string;
}

export function CareerBlock({
  intro,
  axisEndYear,
  axisLabel,
  presentLabel,
}: CareerBlockProps) {
  return (
    <div className="space-y-12">
      <p className="max-w-3xl text-lg leading-relaxed text-foreground">
        {intro}
      </p>
      <TimelineWithList
        axisEndYear={axisEndYear}
        axisLabel={axisLabel}
        presentLabel={presentLabel}
      />
    </div>
  );
}
