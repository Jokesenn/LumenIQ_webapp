import { describe, it, expect } from "vitest";
import {
  getSeriesAlerts,
  sortAlertsByPriority,
  countAlertsByType,
} from "@/lib/series-alerts";
import type { SeriesAlertData } from "@/lib/series-alerts";

// ────────────────────────────────────────────
// getSeriesAlerts
// ────────────────────────────────────────────

describe("getSeriesAlerts", () => {
  const baseSeries: SeriesAlertData = {
    wape: 5,
    was_gated: false,
    drift_detected: false,
    is_first_run: false,
    previous_champion: "naive",
    champion_model: "naive",
  };

  it("retourne 'attention' quand WAPE > 20%", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, wape: 25 });
    expect(alerts).toContain("attention");
    expect(alerts).not.toContain("watch");
  });

  it("retourne 'watch' quand WAPE entre 15% et 20%", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, wape: 17 });
    expect(alerts).toContain("watch");
    expect(alerts).not.toContain("attention");
  });

  it("ne retourne ni 'attention' ni 'watch' quand WAPE <= 15%", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, wape: 10 });
    expect(alerts).not.toContain("attention");
    expect(alerts).not.toContain("watch");
  });

  it("attention et watch sont mutuellement exclusifs (WAPE > 20 ne donne que attention)", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, wape: 30 });
    const perfAlerts = alerts.filter((a) => a === "attention" || a === "watch");
    expect(perfAlerts).toEqual(["attention"]);
  });

  it("retourne 'drift' quand drift_detected est true", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, drift_detected: true });
    expect(alerts).toContain("drift");
  });

  it("ne retourne pas 'drift' quand drift_detected est false", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, drift_detected: false });
    expect(alerts).not.toContain("drift");
  });

  it("retourne 'new' quand is_first_run est true", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, is_first_run: true });
    expect(alerts).toContain("new");
  });

  it("retourne 'model-changed' quand le champion a change et ce n'est pas un premier run", () => {
    const alerts = getSeriesAlerts({
      ...baseSeries,
      previous_champion: "naive",
      champion_model: "hw_multiplicative",
      is_first_run: false,
    });
    expect(alerts).toContain("model-changed");
  });

  it("ne retourne pas 'model-changed' quand c'est un premier run", () => {
    const alerts = getSeriesAlerts({
      ...baseSeries,
      previous_champion: null,
      champion_model: "naive",
      is_first_run: true,
    });
    expect(alerts).not.toContain("model-changed");
  });

  it("ne retourne pas 'model-changed' quand le champion n'a pas change", () => {
    const alerts = getSeriesAlerts({
      ...baseSeries,
      previous_champion: "naive",
      champion_model: "naive",
    });
    expect(alerts).not.toContain("model-changed");
  });

  it("retourne 'gated' quand was_gated est true", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, was_gated: true });
    expect(alerts).toContain("gated");
  });

  it("peut combiner plusieurs alertes simultanement", () => {
    const alerts = getSeriesAlerts({
      wape: 25,
      was_gated: false,
      drift_detected: true,
      is_first_run: false,
      previous_champion: "naive",
      champion_model: "hw_multiplicative",
    });
    expect(alerts).toContain("attention");
    expect(alerts).toContain("drift");
    expect(alerts).toContain("model-changed");
    expect(alerts).toHaveLength(3);
  });

  it("retourne un tableau vide pour une serie sans probleme et non-gated", () => {
    const alerts = getSeriesAlerts(baseSeries);
    expect(alerts).toEqual([]);
  });

  it("gere les valeurs null gracieusement", () => {
    const alerts = getSeriesAlerts({
      wape: null,
      was_gated: null,
      drift_detected: null,
      is_first_run: null,
      previous_champion: null,
      champion_model: "naive",
    });
    expect(alerts).toEqual([]);
  });
});

// ────────────────────────────────────────────
// sortAlertsByPriority
// ────────────────────────────────────────────

describe("sortAlertsByPriority", () => {
  it("trie les alertes par criticite decroissante", () => {
    const sorted = sortAlertsByPriority(["gated", "attention", "drift", "watch"]);
    expect(sorted).toEqual(["attention", "watch", "drift", "gated"]);
  });

  it("retourne un tableau vide si aucune alerte", () => {
    expect(sortAlertsByPriority([])).toEqual([]);
  });

  it("ne modifie pas un tableau deja trie", () => {
    const sorted = sortAlertsByPriority(["attention", "watch"]);
    expect(sorted).toEqual(["attention", "watch"]);
  });

  it("place model-changed avant new et gated", () => {
    const sorted = sortAlertsByPriority(["new", "gated", "model-changed"]);
    expect(sorted).toEqual(["model-changed", "new", "gated"]);
  });
});

// ────────────────────────────────────────────
// countAlertsByType
// ────────────────────────────────────────────

describe("countAlertsByType", () => {
  it("compte correctement les alertes pour un ensemble de series", () => {
    const seriesList: SeriesAlertData[] = [
      { wape: 25, champion_model: "naive" }, // attention
      { wape: 17, champion_model: "naive" }, // watch
      { wape: 5, drift_detected: true, champion_model: "naive" }, // drift
      { wape: 5, champion_model: "naive" }, // aucune alerte
    ];

    const counts = countAlertsByType(seriesList);
    expect(counts.attention).toBe(1);
    expect(counts.watch).toBe(1);
    expect(counts.drift).toBe(1);
    expect(counts.new).toBe(0);
    expect(counts["model-changed"]).toBe(0);
    expect(counts.gated).toBe(0);
  });

  it("retourne tous les compteurs a zero pour une liste vide", () => {
    const counts = countAlertsByType([]);
    expect(Object.values(counts).every((c) => c === 0)).toBe(true);
  });

  it("gere plusieurs series avec la meme alerte", () => {
    const seriesList: SeriesAlertData[] = [
      { wape: 25, champion_model: "a" },
      { wape: 30, champion_model: "b" },
      { wape: 22, champion_model: "c" },
    ];

    const counts = countAlertsByType(seriesList);
    expect(counts.attention).toBe(3);
  });
});
