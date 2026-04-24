# homepage/about-section — delta v1

## ADDED Requirements

### Requirement: Section placement
The About section SHALL appear on the homepage with anchor id `#about`.
For v1 it renders as the primary homepage content, replacing the
`<ComingSoon />` placeholder. When the "Blueprint" and "Contact" sections
land in future changes, About SHALL be repositioned to sit between them
without modification to its own implementation.

Top-nav integration is out of scope for this change and is tracked
separately.

### Requirement: Three-act structure
The section SHALL render in three sequential blocks:

1. **Origin** — one period (1990), prose + Arkanoid icon
2. **Career** — intro paragraph, followed by a minimal SVG timeline strip,
   followed by a complete text list of all career periods
3. **Pivot** — editorial block describing the 2026 transition and the
   Product Architect positioning

Blocks SHALL render in this order on all viewports. On mobile the layout
stacks vertically; no block is hidden based on viewport size.

### Requirement: Origin act content
The Origin act SHALL include:

- Year: 1990
- Location: Pioneer Palace, Chișinău, Moldova SSR
- Artifact: Arkanoid game written in Basic on a ДВК computer
- Achievement: second place, district math olympiad
- Opening line: *"It started in 1990, in the abandoned observatory of
  the Pioneer Palace."*
- Closing line: *"I've been writing code ever since. Thirty-five years."*

An Arkanoid SVG icon SHALL accompany the text. The icon SHALL be a
stylized wireframe, not a screenshot of the historical game.

### Requirement: Career timeline data source
The Career block SHALL read periods from `apps/web/data/timeline.json`,
conforming to schema `timeline-data/v1`. The SVG strip and the text list
SHALL both consume this single source. If the file is missing or fails
schema validation at build time, the build SHALL fail loudly.

### Requirement: Career timeline strip rendering
The timeline strip SHALL render as minimal SVG with the following rules:

- A single horizontal axis line, from year 2000 to the current year
- One square per career period, placed at the period's start year
- Non-highlighted squares: 10 × 10 px
- Highlighted squares (type `founder` / `business`, or has `notable[]`):
  14 × 14 px
- The Origin period (1990) SHALL render as a detached square to the far
  left, connected to the main axis by a dotted line
- Year ticks SHALL appear at every 5-year interval (2000, 2005, 2010,
  2015, 2020, 2025)
- The strip SHALL NOT use swim lanes, variable-width bars, overlapping
  rectangles, or decorative gradients
- The strip SHALL NOT animate on load beyond a simple fade-in on
  scroll-into-view

### Requirement: Design token usage
All colors, typography, spacing, and border-radius values in both the
timeline strip and the period list SHALL come from `@repo/ui` design
tokens. Inline hex codes, inline rem values for spacing, and font-family
overrides are FORBIDDEN in the About section components.

If a required token does not exist in `@repo/ui`, it SHALL be added to
`@repo/ui` in a separate minimal commit before the About section
references it.

### Requirement: Period-type color mapping
Period squares SHALL use tokens according to role type:

- `formative` → `--color-accent-origin`
- `founder`, `business` → `--color-accent-founder`
- `work` with "Architect" or "Lead" in the role string → `--color-accent-architect`
- `work` (other) → `--color-text-tertiary`
- `military` → `--color-text-quaternary`
- `ongoing: true` → `--color-accent-current` (overrides type color)

The mapping SHALL live in a pure function `getPeriodAccent(period)` in
`apps/web/types/timeline.ts` so that the strip and list stay consistent.

### Requirement: Career text list — primary information channel
The Career block SHALL include a complete text list of all 16 periods
from the timeline data. The list is the primary information channel;
the SVG strip is a decorative visual anchor.

Each list item SHALL render:

- Years (formatted `YYYY – YYYY` or `YYYY – present`)
- Organization name
- Role
- City, country (from `location`)
- Tech stack as inline dot-separated text (from `tech[]`)
- Summary paragraph (from `summary`)

Highlighted periods SHALL render with an accent `border-left` in the
matching role-type token color. Non-highlighted periods SHALL use a
neutral `border-left`.

All 16 periods SHALL be visible at all times. There SHALL NOT be
pagination, filtering, "show more" toggles, or hover-only content.

### Requirement: Strip–list interaction
Clicking or pressing Enter on a timeline strip square SHALL smooth-scroll
the viewport to the matching period in the list below and set focus on
that list item. The list item SHALL remain highlighted for 1.5 seconds
after the jump for visual confirmation.

### Requirement: Pivot act content
The Pivot act SHALL include:

- Headline: *"In 2026, I stopped writing code by hand."*
- Body copy covering:
  - End of hand-written code (late 2025 / 2026)
  - Move to professional OpenSpec authoring as primary deliverable
  - Current position: Product Architect
  - Location: Chișinău, working with EU founders
  - The Canvas-for-OpenSpec vision (stated as in-progress, not shipped)

The Pivot act SHALL NOT link to external products that do not yet exist
publicly.

### Requirement: Language support
Narrative copy (Origin headline + body, Career intro, Pivot headline +
body) SHALL be provided in English, Russian, and Romanian under the
`home.about.*` namespace in `packages/i18n/messages/{locale}/web.json`.

Timeline metadata — organization names, city names, role titles, tech
stack items, and period summaries — SHALL remain in English across all
locales for v1. Translation of period summaries is out of scope.

### Requirement: Component boundary
All reusable components (`TimelineStrip`, `PeriodListItem`, `ArkanoidIcon`)
SHALL live in `@repo/ui`. They SHALL accept all strings as props and
SHALL NOT import `next-intl` directly.

The page-level assembly (`AboutSection`, `OriginAct`, `CareerBlock`,
`PivotAct`) lives in `apps/web/components/home/about/` and handles
translation resolution.

### Requirement: Accessibility
- The timeline strip SHALL have `role="img"` and a descriptive `aria-label`
- Each square SHALL contain a `<title>` element announcing organization
  and years
- The period list SHALL be a semantic `<ol>` of `<article>` elements
- Every piece of information shown in the strip SHALL also appear in the
  list (no information is visual-only)
- Keyboard navigation SHALL tab through strip squares in chronological
  order
- No information SHALL be conveyed by color alone

### Requirement: Performance
The About section SHALL not block First Contentful Paint of the homepage.
The timeline JSON SHALL be imported at build time, not fetched. The
section SHALL render fully on the server. Client-side JavaScript is
required ONLY for the strip-to-list scroll interaction.
