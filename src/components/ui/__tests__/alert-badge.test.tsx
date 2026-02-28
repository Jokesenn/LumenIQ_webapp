import { describe, it, expect } from "vitest";
import { BADGE_CONFIG, type AlertType } from "@/components/ui/alert-badge";

// ────────────────────────────────────────────
// AlertBadge — Configuration et labels business
// ────────────────────────────────────────────

describe("BADGE_CONFIG", () => {
  it("definit une config pour chaque type d'alerte", () => {
    const expectedTypes: AlertType[] = [
      "attention",
      "watch",
      "drift",
      "model-changed",
      "new",
      "gated",
    ];

    for (const type of expectedTypes) {
      expect(BADGE_CONFIG[type]).toBeDefined();
      expect(BADGE_CONFIG[type].label).toBeTruthy();
      expect(BADGE_CONFIG[type].icon).toBeTruthy();
      expect(BADGE_CONFIG[type].variant).toBeTruthy();
      expect(typeof BADGE_CONFIG[type].priority).toBe("number");
    }
  });

  it("utilise des labels en francais compréhensibles pour un non-technicien", () => {
    // Aucun label ne doit contenir de jargon technique (WAPE, MASE, CV, drift, gating...)
    const technicalTerms = [
      "wape",
      "mase",
      "smape",
      "mape",
      "drift",
      "gating",
      "gated",
      "cv",
      "model",
      "backtest",
      "cross-validation",
    ];

    for (const [, config] of Object.entries(BADGE_CONFIG)) {
      const labelLower = config.label.toLowerCase();
      for (const term of technicalTerms) {
        expect(labelLower).not.toContain(term);
      }
    }
  });

  it("a les priorites dans le bon ordre (attention = plus critique)", () => {
    expect(BADGE_CONFIG.attention.priority).toBeLessThan(
      BADGE_CONFIG.watch.priority
    );
    expect(BADGE_CONFIG.watch.priority).toBeLessThan(
      BADGE_CONFIG.drift.priority
    );
    expect(BADGE_CONFIG.drift.priority).toBeLessThan(
      BADGE_CONFIG["model-changed"].priority
    );
    expect(BADGE_CONFIG["model-changed"].priority).toBeLessThan(
      BADGE_CONFIG.new.priority
    );
    expect(BADGE_CONFIG.new.priority).toBeLessThan(
      BADGE_CONFIG.gated.priority
    );
  });

  it("utilise un variant destructive pour les alertes critiques", () => {
    expect(BADGE_CONFIG.attention.variant).toBe("destructive");
  });

  it("utilise un variant warning pour les alertes moderees", () => {
    expect(BADGE_CONFIG.watch.variant).toBe("warning");
    expect(BADGE_CONFIG.drift.variant).toBe("warning");
  });

  it("utilise un variant success pour les indicateurs positifs", () => {
    expect(BADGE_CONFIG.gated.variant).toBe("success");
  });
});
