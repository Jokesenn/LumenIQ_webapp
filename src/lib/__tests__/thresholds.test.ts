// src/lib/__tests__/thresholds.test.ts
import { describe, it, expect } from "vitest";
import { DEFAULT_THRESHOLDS, getColorFromThreshold } from "@/lib/thresholds/defaults";
import type { ThresholdConfig } from "@/lib/thresholds/defaults";

describe("DEFAULT_THRESHOLDS", () => {
  it("contains all 5 expected metric keys", () => {
    const keys = DEFAULT_THRESHOLDS.map((t) => t.metric_key);
    expect(keys).toContain("reliability_score");
    expect(keys).toContain("wape");
    expect(keys).toContain("model_score");
    expect(keys).toContain("mase");
    expect(keys).toContain("bias");
    expect(keys).toHaveLength(5);
  });

  it("each threshold has required fields", () => {
    for (const t of DEFAULT_THRESHOLDS) {
      expect(t.metric_key).toBeTruthy();
      expect(t.label).toBeTruthy();
      expect(t.unit).toBeTruthy();
      expect(typeof t.green_max).toBe("number");
      expect(typeof t.yellow_max).toBe("number");
      expect(["lower_is_better", "higher_is_better"]).toContain(t.direction);
    }
  });

  it("thresholds are consistent with direction", () => {
    for (const t of DEFAULT_THRESHOLDS) {
      if (t.direction === "lower_is_better") {
        expect(t.green_max).toBeLessThan(t.yellow_max);
      } else {
        expect(t.green_max).toBeGreaterThan(t.yellow_max);
      }
    }
  });
});

describe("getColorFromThreshold", () => {
  const lowerIsBetter: ThresholdConfig = {
    metric_key: "wape",
    label: "WAPE",
    unit: "%",
    green_max: 15,
    yellow_max: 20,
    direction: "lower_is_better",
  };

  const higherIsBetter: ThresholdConfig = {
    metric_key: "reliability_score",
    label: "Score de fiabilite",
    unit: "%",
    green_max: 90,
    yellow_max: 70,
    direction: "higher_is_better",
  };

  it("returns green when value <= green_max (lower_is_better)", () => {
    expect(getColorFromThreshold(lowerIsBetter, 10)).toBe("green");
    expect(getColorFromThreshold(lowerIsBetter, 15)).toBe("green");
  });

  it("returns yellow when value > green_max and <= yellow_max (lower_is_better)", () => {
    expect(getColorFromThreshold(lowerIsBetter, 16)).toBe("yellow");
    expect(getColorFromThreshold(lowerIsBetter, 20)).toBe("yellow");
  });

  it("returns red when value > yellow_max (lower_is_better)", () => {
    expect(getColorFromThreshold(lowerIsBetter, 21)).toBe("red");
    expect(getColorFromThreshold(lowerIsBetter, 50)).toBe("red");
  });

  it("returns green when value >= green_max (higher_is_better)", () => {
    expect(getColorFromThreshold(higherIsBetter, 95)).toBe("green");
    expect(getColorFromThreshold(higherIsBetter, 90)).toBe("green");
  });

  it("returns yellow when value < green_max and >= yellow_max (higher_is_better)", () => {
    expect(getColorFromThreshold(higherIsBetter, 85)).toBe("yellow");
    expect(getColorFromThreshold(higherIsBetter, 70)).toBe("yellow");
  });

  it("returns red when value < yellow_max (higher_is_better)", () => {
    expect(getColorFromThreshold(higherIsBetter, 60)).toBe("red");
    expect(getColorFromThreshold(higherIsBetter, 0)).toBe("red");
  });
});
