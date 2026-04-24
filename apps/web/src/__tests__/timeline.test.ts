import { describe, expect, it } from "vitest";
import {
  getPeriodAccent,
  PeriodSchema,
  timeline,
  type Period,
} from "../types/timeline";

const basePeriod: Period = {
  id: "base",
  type: "work",
  startYear: 2010,
  endYear: 2011,
  ongoing: false,
  organization: "Acme",
  role: "Developer",
  location: "City, Country",
  summary: "A base fixture.",
};

describe("getPeriodAccent", () => {
  it("maps formative to accent-origin", () => {
    expect(getPeriodAccent({ ...basePeriod, type: "formative" })).toBe(
      "accent-origin",
    );
  });

  it("maps founder and business to accent-founder", () => {
    expect(getPeriodAccent({ ...basePeriod, type: "founder" })).toBe(
      "accent-founder",
    );
    expect(getPeriodAccent({ ...basePeriod, type: "business" })).toBe(
      "accent-founder",
    );
  });

  it("maps military to text-quaternary", () => {
    expect(getPeriodAccent({ ...basePeriod, type: "military" })).toBe(
      "text-quaternary",
    );
  });

  it("maps work roles containing Architect or Lead to accent-architect", () => {
    expect(
      getPeriodAccent({ ...basePeriod, role: "Frontend Architect" }),
    ).toBe("accent-architect");
    expect(getPeriodAccent({ ...basePeriod, role: "Tech Lead" })).toBe(
      "accent-architect",
    );
    expect(
      getPeriodAccent({ ...basePeriod, role: "Front-End Team Leader" }),
    ).toBe("accent-architect");
  });

  it("maps other work roles to text-tertiary", () => {
    expect(
      getPeriodAccent({ ...basePeriod, role: "Frontend Developer" }),
    ).toBe("text-tertiary");
    expect(getPeriodAccent({ ...basePeriod, role: "Designer" })).toBe(
      "text-tertiary",
    );
  });

  it("ongoing periods override everything with accent-current", () => {
    expect(
      getPeriodAccent({
        ...basePeriod,
        role: "Frontend Architect",
        endYear: null,
        ongoing: true,
      }),
    ).toBe("accent-current");
  });
});

describe("PeriodSchema validation", () => {
  it("rejects endYear < startYear", () => {
    const bad = { ...basePeriod, startYear: 2020, endYear: 2010 };
    expect(() => PeriodSchema.parse(bad)).toThrow();
  });

  it("rejects ongoing with non-null endYear", () => {
    const bad = { ...basePeriod, ongoing: true, endYear: 2025 };
    expect(() => PeriodSchema.parse(bad)).toThrow();
  });

  it("rejects ids with invalid characters", () => {
    const bad = { ...basePeriod, id: "Has Spaces" };
    expect(() => PeriodSchema.parse(bad)).toThrow();
  });

  it("accepts a well-formed period", () => {
    expect(() => PeriodSchema.parse(basePeriod)).not.toThrow();
  });
});

describe("timeline.json (module-load validation)", () => {
  it("parses successfully — the module export exists", () => {
    expect(timeline.$schema).toBe("timeline-data/v1");
    expect(timeline.periods.length).toBeGreaterThan(0);
  });

  it("has unique ids across all periods", () => {
    const ids = timeline.periods.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has exactly one ongoing period", () => {
    const ongoing = timeline.periods.filter((p) => p.ongoing);
    expect(ongoing).toHaveLength(1);
  });

  it("origin period is type formative", () => {
    const origin = timeline.periods.find((p) => p.id === "origin-pioneer-palace");
    expect(origin?.type).toBe("formative");
    expect(origin?.startYear).toBe(1990);
  });
});
