import { describe, it, expect } from "vitest";
import { PRIORITY_CONFIG, TREND_CONFIG } from "@/components/dashboard/action-card";

// ────────────────────────────────────────────
// ActionCard — Labels de priorite et tendance
// ────────────────────────────────────────────

describe("PRIORITY_CONFIG", () => {
  it("definit les 4 niveaux de priorite", () => {
    expect(PRIORITY_CONFIG.urgent).toBeDefined();
    expect(PRIORITY_CONFIG.warning).toBeDefined();
    expect(PRIORITY_CONFIG.info).toBeDefined();
    expect(PRIORITY_CONFIG.clear).toBeDefined();
  });

  it("utilise des couleurs coherentes avec la severite", () => {
    // urgent = rouge
    expect(PRIORITY_CONFIG.urgent.bg).toContain("red");
    expect(PRIORITY_CONFIG.urgent.border).toContain("red");
    // warning = ambre/orange
    expect(PRIORITY_CONFIG.warning.bg).toContain("amber");
    // info = vert
    expect(PRIORITY_CONFIG.info.bg).toContain("emerald");
  });
});

describe("TREND_CONFIG", () => {
  it("definit les 3 tendances possibles", () => {
    expect(TREND_CONFIG.worsening).toBeDefined();
    expect(TREND_CONFIG.stable).toBeDefined();
    expect(TREND_CONFIG.improving).toBeDefined();
  });

  it("utilise des labels en francais comprehensibles sans jargon", () => {
    const technicalTerms = ["wape", "mase", "drift", "error", "metric"];

    for (const [, config] of Object.entries(TREND_CONFIG)) {
      const labelLower = config.label.toLowerCase();
      for (const term of technicalTerms) {
        expect(labelLower).not.toContain(term);
      }
    }
  });

  it("associe la degradation au rouge et l'amelioration au vert", () => {
    expect(TREND_CONFIG.worsening.color).toContain("red");
    expect(TREND_CONFIG.improving.color).toContain("emerald");
    expect(TREND_CONFIG.stable.color).toContain("zinc");
  });
});
