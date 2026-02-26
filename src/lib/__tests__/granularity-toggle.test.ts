// src/lib/__tests__/granularity-toggle.test.ts
import { describe, it, expect } from "vitest";
import { formatFrequencyLabel } from "@/lib/date-format";
import { classifyFreq } from "@/lib/date-format";

describe("formatFrequencyLabel", () => {
  it("returns Journalier for daily frequencies", () => {
    expect(formatFrequencyLabel("D")).toBe("Journalier");
    expect(formatFrequencyLabel("2D")).toBe("Journalier");
  });

  it("returns Hebdomadaire for weekly frequencies", () => {
    expect(formatFrequencyLabel("7D")).toBe("Hebdomadaire");
    expect(formatFrequencyLabel("W")).toBe("Hebdomadaire");
  });

  it("returns Mensuel for monthly frequencies", () => {
    expect(formatFrequencyLabel("MS")).toBe("Mensuel");
    expect(formatFrequencyLabel("ME")).toBe("Mensuel");
    expect(formatFrequencyLabel("M")).toBe("Mensuel");
  });

  it("returns Trimestriel for quarterly frequencies", () => {
    expect(formatFrequencyLabel("Q")).toBe("Trimestriel");
    expect(formatFrequencyLabel("QS")).toBe("Trimestriel");
  });

  it("returns Horaire for hourly frequencies", () => {
    expect(formatFrequencyLabel("H")).toBe("Horaire");
    expect(formatFrequencyLabel("h")).toBe("Horaire");
  });

  it("returns Mensuel for null/undefined", () => {
    expect(formatFrequencyLabel(null)).toBe("Mensuel");
  });

  it("returns Mensuel for empty string", () => {
    expect(formatFrequencyLabel("")).toBe("Mensuel");
  });
});

describe("classifyFreq (exported)", () => {
  it("classifies 7D as W", () => {
    expect(classifyFreq("7D")).toBe("W");
  });

  it("classifies MS as M", () => {
    expect(classifyFreq("MS")).toBe("M");
  });

  it("classifies D as D", () => {
    expect(classifyFreq("D")).toBe("D");
  });
});
