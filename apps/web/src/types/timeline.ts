import { z } from "zod";
import timelineJson from "@/data/timeline.json";

export const PERIOD_TYPES = [
  "formative",
  "founder",
  "business",
  "work",
  "military",
] as const;

export const PeriodSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "id must be lowercase alphanumeric with dashes"),
    type: z.enum(PERIOD_TYPES),
    startYear: z.number().int().min(1900).max(2100),
    endYear: z.number().int().min(1900).max(2100).nullable(),
    ongoing: z.boolean().optional().default(false),
    organization: z.string().min(1),
    role: z.string().min(1),
    location: z.string().min(1),
    tech: z.array(z.string().min(1)).optional(),
    summary: z.string().min(1),
    notable: z.array(z.string().min(1)).optional(),
  })
  .refine(
    (p) => p.endYear === null || p.endYear >= p.startYear,
    "endYear must be >= startYear or null",
  )
  .refine(
    (p) => !p.ongoing || p.endYear === null,
    "ongoing periods must have endYear: null",
  );

export const TimelineSchema = z.object({
  $schema: z.literal("timeline-data/v1"),
  periods: z.array(PeriodSchema).min(1),
});

export type Period = z.infer<typeof PeriodSchema>;
export type PeriodType = (typeof PERIOD_TYPES)[number];
export type Timeline = z.infer<typeof TimelineSchema>;

export const ACCENT_TOKENS = [
  "accent-origin",
  "accent-founder",
  "accent-architect",
  "accent-current",
  "text-tertiary",
  "text-quaternary",
] as const;
export type AccentToken = (typeof ACCENT_TOKENS)[number];

// Leading word boundary only: "Lead" and "Leader" both match at a token
// boundary, but "pleaded" won't. Covers Architect / Lead / Team Leader.
const ARCHITECT_ROLE_REGEX = /\b(architect|lead)/i;

export function getPeriodAccent(period: Period): AccentToken {
  if (period.ongoing) return "accent-current";

  switch (period.type) {
    case "formative":
      return "accent-origin";
    case "founder":
    case "business":
      return "accent-founder";
    case "military":
      return "text-quaternary";
    case "work":
      return ARCHITECT_ROLE_REGEX.test(period.role)
        ? "accent-architect"
        : "text-tertiary";
  }
}

// Validate once at module load. Throws and halts the RSC build on any
// schema violation — matches the spec requirement that the build SHALL
// fail loudly on missing or invalid timeline data.
export const timeline: Timeline = TimelineSchema.parse(timelineJson);
export const periods: readonly Period[] = timeline.periods;
