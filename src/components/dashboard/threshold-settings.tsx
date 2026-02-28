"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useThresholds } from "@/lib/thresholds/context";
import { DEFAULT_THRESHOLDS, type ThresholdConfig } from "@/lib/thresholds/defaults";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true when the current green/yellow pair is invalid for the given direction. */
function isInvalid(
  direction: ThresholdConfig["direction"],
  greenMax: number,
  yellowMax: number
): boolean {
  if (direction === "lower_is_better") {
    // green_max must be < yellow_max  (e.g. WAPE: <=15 green, <=20 yellow)
    return greenMax >= yellowMax;
  }
  // higher_is_better: green_max must be > yellow_max (e.g. reliability: >=90 green, >=70 yellow)
  return greenMax <= yellowMax;
}

/** Build a validation message for the user. */
function validationMessage(direction: ThresholdConfig["direction"]): string {
  if (direction === "lower_is_better") {
    return "Le seuil Vert doit être inférieur au seuil Jaune";
  }
  return "Le seuil Vert doit être supérieur au seuil Jaune";
}

// ---------------------------------------------------------------------------
// Color preview bar
// ---------------------------------------------------------------------------

function ColorBar({
  greenMax,
  yellowMax,
  direction,
}: {
  greenMax: number;
  yellowMax: number;
  direction: ThresholdConfig["direction"];
}) {
  // Compute proportional widths (approximate — we just need a visual hint)
  const total = Math.max(greenMax, yellowMax) * 1.4; // give red some room
  let gPct: number;
  let yPct: number;

  if (direction === "lower_is_better") {
    gPct = (greenMax / total) * 100;
    yPct = ((yellowMax - greenMax) / total) * 100;
  } else {
    // higher_is_better: green zone is above green_max, yellow is between yellow_max and green_max
    // Visually: red | yellow | green  (left-to-right ascending)
    gPct = ((100 - greenMax) / 100) * 100 || 30;
    yPct = ((greenMax - yellowMax) / 100) * 100 || 20;
    // For higher_is_better we reverse the bar order:
    return (
      <div className="flex h-2 rounded-full overflow-hidden mt-2">
        <div
          className="bg-red-500/70"
          style={{ width: `${100 - gPct - yPct}%` }}
        />
        <div className="bg-amber-400/70" style={{ width: `${yPct}%` }} />
        <div className="bg-emerald-500/70" style={{ width: `${gPct}%` }} />
      </div>
    );
  }

  const rPct = Math.max(100 - gPct - yPct, 5);

  return (
    <div className="flex h-2 rounded-full overflow-hidden mt-2">
      <div className="bg-emerald-500/70" style={{ width: `${gPct}%` }} />
      <div className="bg-amber-400/70" style={{ width: `${yPct}%` }} />
      <div className="bg-red-500/70" style={{ width: `${rPct}%` }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single metric row
// ---------------------------------------------------------------------------

function MetricRow({
  config,
  current,
  custom,
  onUpdate,
  onReset,
}: {
  config: ThresholdConfig; // default definition (label, unit, direction)
  current: ThresholdConfig; // currently active (may be custom)
  custom: boolean;
  onUpdate: (metricKey: string, green: number, yellow: number) => void;
  onReset: (metricKey: string) => void;
}) {
  const [greenVal, setGreenVal] = useState(current.green_max);
  const [yellowVal, setYellowVal] = useState(current.yellow_max);

  // Sync local state when external thresholds change (e.g. after reset)
  useEffect(() => {
    setGreenVal(current.green_max);
    setYellowVal(current.yellow_max);
  }, [current.green_max, current.yellow_max]);

  // Debounced save -------------------------------------------------------
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useCallback(
    (green: number, yellow: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!isInvalid(config.direction, green, yellow)) {
          onUpdate(config.metric_key, green, yellow);
        }
      }, 500);
    },
    [config.direction, config.metric_key, onUpdate]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleGreenChange = (val: string) => {
    const n = Number(val);
    if (Number.isNaN(n)) return;
    setGreenVal(n);
    debouncedSave(n, yellowVal);
  };

  const handleYellowChange = (val: string) => {
    const n = Number(val);
    if (Number.isNaN(n)) return;
    setYellowVal(n);
    debouncedSave(greenVal, n);
  };

  const invalid = isInvalid(config.direction, greenVal, yellowVal);

  const greenLabel =
    config.direction === "lower_is_better" ? "Vert <=" : "Vert >=";
  const yellowLabel =
    config.direction === "lower_is_better" ? "Jaune <=" : "Jaune >=";

  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      {/* Header row: label, badge, reset */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">
            {config.label}
          </span>
          <span className="text-xs text-zinc-500">{config.unit}</span>
          {custom ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-400">
              Personnalisé
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-700/60 text-zinc-400">
              Par défaut
            </span>
          )}
        </div>
        {custom && (
          <button
            onClick={() => onReset(config.metric_key)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
            title="Réinitialiser"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">
            {greenLabel}
          </label>
          <input
            type="number"
            value={greenVal}
            onChange={(e) => handleGreenChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">
            {yellowLabel}
          </label>
          <input
            type="number"
            value={yellowVal}
            onChange={(e) => handleYellowChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Color preview */}
      <ColorBar
        greenMax={greenVal}
        yellowMax={yellowVal}
        direction={config.direction}
      />

      {/* Validation error */}
      {invalid && (
        <p className="mt-2 text-xs text-red-400">
          {validationMessage(config.direction)}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ThresholdSettings() {
  const { thresholds, isCustom, updateThreshold, resetThreshold, resetAll } =
    useThresholds();

  const anyCustom = DEFAULT_THRESHOLDS.some((d) => isCustom(d.metric_key));

  return (
    <div className="md:col-span-2 dash-card p-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="dash-section-title">Seuils d&apos;affichage</h3>
        {anyCustom && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resetAll()}
            className="gap-1.5 text-zinc-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser tout
          </Button>
        )}
      </div>
      <p className="text-sm text-zinc-400 mb-5">
        Personnalisez les seuils de coloration des métriques
      </p>

      {/* Metric rows */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_THRESHOLDS.map((def) => {
          const current = thresholds[def.metric_key] ?? def;
          return (
            <MetricRow
              key={def.metric_key}
              config={def}
              current={current}
              custom={isCustom(def.metric_key)}
              onUpdate={updateThreshold}
              onReset={resetThreshold}
            />
          );
        })}
      </div>
    </div>
  );
}
