# User Thresholds Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Externalize hardcoded color thresholds (green/yellow/red) to Supabase with per-user customization and a settings UI.

**Architecture:** React Context provider (`ThresholdsProvider`) mounted in `DashboardShell`, fetching user overrides from `lumeniq.user_thresholds` at mount and merging with defaults. Pure `getColor()` function for threshold logic. Settings UI added as a new section in the existing `/dashboard/settings` page.

**Tech Stack:** Next.js 16.1 (App Router), React 19.2, TypeScript 5.9, Supabase (lumeniq schema), Tailwind CSS v4, Vitest

---

## Task 1: Types and defaults

**Files:**
- Create: `src/lib/thresholds/defaults.ts`
- Test: `src/lib/__tests__/thresholds.test.ts`

**Step 1: Write the test file**

```ts
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

  // lower_is_better tests
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

  // higher_is_better tests
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
```

**Step 2: Run test to verify it fails**

Run: `cd LumenIQ_webapp && npm test -- src/lib/__tests__/thresholds.test.ts`
Expected: FAIL (module not found)

**Step 3: Write the implementation**

```ts
// src/lib/thresholds/defaults.ts
export type ThresholdDirection = "lower_is_better" | "higher_is_better";
export type ThresholdColor = "green" | "yellow" | "red";

export interface ThresholdConfig {
  metric_key: string;
  label: string;
  unit: string;
  green_max: number;
  yellow_max: number;
  direction: ThresholdDirection;
}

/**
 * Default thresholds matching the previously hardcoded values.
 *
 * lower_is_better:  green_max < yellow_max  (e.g. WAPE 15 < 20)
 * higher_is_better: green_max > yellow_max  (e.g. reliability 90 > 70)
 */
export const DEFAULT_THRESHOLDS: ThresholdConfig[] = [
  {
    metric_key: "reliability_score",
    label: "Score de fiabilite",
    unit: "%",
    green_max: 90,
    yellow_max: 70,
    direction: "higher_is_better",
  },
  {
    metric_key: "wape",
    label: "Erreur ponderee (WAPE)",
    unit: "%",
    green_max: 15,
    yellow_max: 20,
    direction: "lower_is_better",
  },
  {
    metric_key: "model_score",
    label: "Score modele",
    unit: "/100",
    green_max: 80,
    yellow_max: 50,
    direction: "higher_is_better",
  },
  {
    metric_key: "mase",
    label: "Indice predictif (MASE)",
    unit: "/100",
    green_max: 80,
    yellow_max: 100,
    direction: "lower_is_better",
  },
  {
    metric_key: "bias",
    label: "Biais prevision",
    unit: "%",
    green_max: 5,
    yellow_max: 10,
    direction: "lower_is_better",
  },
];

/**
 * Pure function: determines color for a metric value given a threshold config.
 */
export function getColorFromThreshold(
  threshold: ThresholdConfig,
  value: number
): ThresholdColor {
  if (threshold.direction === "lower_is_better") {
    if (value <= threshold.green_max) return "green";
    if (value <= threshold.yellow_max) return "yellow";
    return "red";
  }
  // higher_is_better
  if (value >= threshold.green_max) return "green";
  if (value >= threshold.yellow_max) return "yellow";
  return "red";
}

/** Index defaults by metric_key for fast lookup. */
export function buildThresholdsMap(
  thresholds: ThresholdConfig[]
): Record<string, ThresholdConfig> {
  const map: Record<string, ThresholdConfig> = {};
  for (const t of thresholds) {
    map[t.metric_key] = t;
  }
  return map;
}
```

**Step 4: Run test to verify it passes**

Run: `cd LumenIQ_webapp && npm test -- src/lib/__tests__/thresholds.test.ts`
Expected: PASS (all tests green)

**Step 5: Commit**

```bash
git add src/lib/thresholds/defaults.ts src/lib/__tests__/thresholds.test.ts
git commit -m "feat: add threshold types, defaults, and getColorFromThreshold"
```

---

## Task 2: Supabase migration

**Files:**
- None locally (Supabase MCP)

**Step 1: Apply the migration via Supabase MCP**

Use `mcp__claude_ai_Supabase__apply_migration` with:
- name: `create_user_thresholds`
- query:
```sql
CREATE TABLE lumeniq.user_thresholds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_key TEXT NOT NULL,
  green_max NUMERIC NOT NULL,
  yellow_max NUMERIC NOT NULL,
  direction TEXT DEFAULT 'lower_is_better'
    CHECK (direction IN ('lower_is_better', 'higher_is_better')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, metric_key)
);

ALTER TABLE lumeniq.user_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own thresholds"
  ON lumeniq.user_thresholds FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Step 2: Verify the table exists**

Use `mcp__claude_ai_Supabase__list_tables` with schemas: `["lumeniq"]` and confirm `user_thresholds` appears.

**Step 3: Run security advisors**

Use `mcp__claude_ai_Supabase__get_advisors` with type: `security` to confirm RLS is properly configured.

---

## Task 3: ThresholdsProvider context

**Files:**
- Create: `src/lib/thresholds/context.tsx`
- Modify: `src/app/dashboard/dashboard-shell.tsx` (line 1: add import, line 64-65: wrap children)

**Step 1: Create the context provider**

```tsx
// src/lib/thresholds/context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useSupabase, useUser } from "@/hooks/use-supabase";
import {
  DEFAULT_THRESHOLDS,
  buildThresholdsMap,
  getColorFromThreshold,
  type ThresholdConfig,
  type ThresholdColor,
} from "./defaults";

interface ThresholdsContextValue {
  thresholds: Record<string, ThresholdConfig>;
  getColor: (metricKey: string, value: number) => ThresholdColor;
  updateThreshold: (
    metricKey: string,
    green_max: number,
    yellow_max: number
  ) => Promise<void>;
  resetThreshold: (metricKey: string) => Promise<void>;
  resetAll: () => Promise<void>;
  isLoading: boolean;
  isCustom: (metricKey: string) => boolean;
}

const ThresholdsContext = createContext<ThresholdsContextValue | null>(null);

const defaultsMap = buildThresholdsMap(DEFAULT_THRESHOLDS);

export function ThresholdsProvider({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const supabase = useSupabase();
  const [customKeys, setCustomKeys] = useState<Set<string>>(new Set());
  const [merged, setMerged] = useState<Record<string, ThresholdConfig>>(defaultsMap);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user overrides on mount
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setMerged(defaultsMap);
      setCustomKeys(new Set());
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchThresholds() {
      const { data, error } = await supabase
        .schema("lumeniq")
        .from("user_thresholds")
        .select("metric_key, green_max, yellow_max, direction")
        .eq("user_id", user!.id);

      if (cancelled) return;

      if (error) {
        console.error("Failed to fetch thresholds:", error.message);
        setIsLoading(false);
        return;
      }

      const newMerged = { ...defaultsMap };
      const newCustom = new Set<string>();

      for (const row of data ?? []) {
        const def = defaultsMap[row.metric_key];
        if (def) {
          newMerged[row.metric_key] = {
            ...def,
            green_max: Number(row.green_max),
            yellow_max: Number(row.yellow_max),
          };
          newCustom.add(row.metric_key);
        }
      }

      setMerged(newMerged);
      setCustomKeys(newCustom);
      setIsLoading(false);
    }

    fetchThresholds();
    return () => { cancelled = true; };
  }, [user, userLoading, supabase]);

  const getColor = useCallback(
    (metricKey: string, value: number): ThresholdColor => {
      const t = merged[metricKey];
      if (!t) return "green";
      return getColorFromThreshold(t, value);
    },
    [merged]
  );

  const updateThreshold = useCallback(
    async (metricKey: string, green_max: number, yellow_max: number) => {
      if (!user) return;
      const def = defaultsMap[metricKey];
      if (!def) return;

      // Optimistic update
      setMerged((prev) => ({
        ...prev,
        [metricKey]: { ...def, green_max, yellow_max },
      }));
      setCustomKeys((prev) => new Set([...prev, metricKey]));

      const { error } = await supabase
        .schema("lumeniq")
        .from("user_thresholds")
        .upsert(
          {
            user_id: user.id,
            metric_key: metricKey,
            green_max,
            yellow_max,
            direction: def.direction,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,metric_key" }
        );

      if (error) {
        console.error("Failed to save threshold:", error.message);
        // Rollback
        setMerged((prev) => ({ ...prev, [metricKey]: def }));
        setCustomKeys((prev) => {
          const next = new Set(prev);
          next.delete(metricKey);
          return next;
        });
      }
    },
    [user, supabase]
  );

  const resetThreshold = useCallback(
    async (metricKey: string) => {
      if (!user) return;
      const def = defaultsMap[metricKey];
      if (!def) return;

      // Optimistic
      setMerged((prev) => ({ ...prev, [metricKey]: def }));
      setCustomKeys((prev) => {
        const next = new Set(prev);
        next.delete(metricKey);
        return next;
      });

      await supabase
        .schema("lumeniq")
        .from("user_thresholds")
        .delete()
        .eq("user_id", user.id)
        .eq("metric_key", metricKey);
    },
    [user, supabase]
  );

  const resetAll = useCallback(async () => {
    if (!user) return;

    setMerged(defaultsMap);
    setCustomKeys(new Set());

    await supabase
      .schema("lumeniq")
      .from("user_thresholds")
      .delete()
      .eq("user_id", user.id);
  }, [user, supabase]);

  const isCustom = useCallback(
    (metricKey: string) => customKeys.has(metricKey),
    [customKeys]
  );

  const value = useMemo<ThresholdsContextValue>(
    () => ({
      thresholds: merged,
      getColor,
      updateThreshold,
      resetThreshold,
      resetAll,
      isLoading,
      isCustom,
    }),
    [merged, getColor, updateThreshold, resetThreshold, resetAll, isLoading, isCustom]
  );

  return (
    <ThresholdsContext.Provider value={value}>
      {children}
    </ThresholdsContext.Provider>
  );
}

export function useThresholds(): ThresholdsContextValue {
  const ctx = useContext(ThresholdsContext);
  if (!ctx) {
    throw new Error("useThresholds must be used within ThresholdsProvider");
  }
  return ctx;
}
```

**Step 2: Mount in DashboardShell**

Modify `src/app/dashboard/dashboard-shell.tsx`:
- Add import: `import { ThresholdsProvider } from "@/lib/thresholds/context";`
- Wrap `{children}` at line 65 with `<ThresholdsProvider>{children}</ThresholdsProvider>`

Specifically, change line 64-66 from:
```tsx
<ErrorBoundary>
  <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
</ErrorBoundary>
```
to:
```tsx
<ErrorBoundary>
  <main className="flex-1 overflow-auto p-4 lg:p-8">
    <ThresholdsProvider>{children}</ThresholdsProvider>
  </main>
</ErrorBoundary>
```

**Step 3: Verify build**

Run: `cd LumenIQ_webapp && npx tsc`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/lib/thresholds/context.tsx src/app/dashboard/dashboard-shell.tsx
git commit -m "feat: add ThresholdsProvider context and mount in DashboardShell"
```

---

## Task 4: Refactor metrics.ts

**Files:**
- Modify: `src/lib/metrics.ts` (lines 35-53)

**Context:** `getChampionScoreColor()` and `getChampionScoreStatus()` use hardcoded thresholds 90/70. These functions are called by `series-list.tsx` (line 44) and potentially other components. They are pure functions (no hooks), so they need to accept thresholds as a parameter.

**Step 1: Add a thresholds parameter to both functions**

Change `getChampionScoreColor` (lines 35-40) to accept an optional thresholds parameter:

```ts
export function getChampionScoreColor(
  score: number | null,
  thresholds?: { green: number; yellow: number }
): string {
  if (score == null) return "text-zinc-400";
  const { green, yellow } = thresholds ?? { green: 90, yellow: 70 };
  if (score >= green) return "text-emerald-400";
  if (score >= yellow) return "text-amber-400";
  return "text-red-400";
}
```

Change `getChampionScoreStatus` (lines 45-53) similarly:

```ts
export function getChampionScoreStatus(
  score: number,
  thresholds?: { green: number; yellow: number }
): {
  label: string;
  color: string;
  Icon: LucideIcon;
} {
  const { green, yellow } = thresholds ?? { green: 90, yellow: 70 };
  if (score >= green) return { label: "Excellent", color: "text-emerald-400", Icon: CheckCircle2 };
  if (score >= yellow) return { label: "Acceptable", color: "text-amber-400", Icon: Info };
  return { label: "A ameliorer", color: "text-red-400", Icon: AlertTriangle };
}
```

**Step 2: Verify existing tests still pass**

Run: `cd LumenIQ_webapp && npm test`
Expected: All tests pass (no tests directly test metrics.ts, but series-alerts tests should still pass)

**Step 3: Verify TypeScript compiles**

Run: `cd LumenIQ_webapp && npx tsc`
Expected: No errors (optional parameter means callers without thresholds still work)

**Step 4: Commit**

```bash
git add src/lib/metrics.ts
git commit -m "refactor: add optional thresholds parameter to metrics color functions"
```

---

## Task 5: Refactor series-alerts.ts

**Files:**
- Modify: `src/lib/series-alerts.ts` (lines 4-6, 22-31)
- Modify: `src/lib/__tests__/series-alerts.test.ts`

**Context:** `getSeriesAlerts()` uses hardcoded constants `WAPE_THRESHOLD_ATTENTION = 20` and `WAPE_THRESHOLD_WATCH = 15`. This function is used SSR (in `results-content.tsx` line 107, `AlertsSummaryCard`, etc.), so it can't use hooks. The thresholds must be passed as optional parameters.

**Step 1: Update the test to cover parametrized thresholds**

Add to `src/lib/__tests__/series-alerts.test.ts` after the existing tests in the `getSeriesAlerts` describe block:

```ts
describe("custom thresholds", () => {
  const baseSeries: SeriesAlertData = {
    wape: 5,
    was_gated: false,
    drift_detected: false,
    is_first_run: false,
    previous_champion: "naive",
    champion_model: "naive",
  };

  it("uses custom WAPE thresholds when provided", () => {
    // With custom thresholds: attention at 10, watch at 5
    const wapeThresholds = { attention: 10, watch: 5 };
    const alerts = getSeriesAlerts({ ...baseSeries, wape: 7 }, { wapeThresholds });
    expect(alerts).toContain("watch");
    expect(alerts).not.toContain("attention");
  });

  it("uses custom attention threshold", () => {
    const wapeThresholds = { attention: 10, watch: 5 };
    const alerts = getSeriesAlerts({ ...baseSeries, wape: 12 }, { wapeThresholds });
    expect(alerts).toContain("attention");
  });

  it("falls back to defaults when no custom thresholds", () => {
    const alerts = getSeriesAlerts({ ...baseSeries, wape: 17 });
    expect(alerts).toContain("watch");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd LumenIQ_webapp && npm test -- src/lib/__tests__/series-alerts.test.ts`
Expected: FAIL (getSeriesAlerts doesn't accept second parameter)

**Step 3: Update getSeriesAlerts to accept optional thresholds**

Modify `src/lib/series-alerts.ts`:

Replace lines 1-31 with:

```ts
import type { AlertType } from "@/components/ui/alert-badge"

/** Default WAPE thresholds (%) */
const WAPE_THRESHOLD_ATTENTION = 20
const WAPE_THRESHOLD_WATCH = 15

export interface SeriesAlertData {
  wape: number | null
  was_gated?: boolean | null
  drift_detected?: boolean | null
  is_first_run?: boolean | null
  previous_champion?: string | null
  champion_model: string
}

export interface AlertThresholdOptions {
  wapeThresholds?: {
    attention: number
    watch: number
  }
}

/**
 * Determines alerts applicable to a series.
 * Optionally accepts custom WAPE thresholds (defaults to 20/15).
 */
export function getSeriesAlerts(
  series: SeriesAlertData,
  options?: AlertThresholdOptions
): AlertType[] {
  const alerts: AlertType[] = []
  const wape = series.wape ?? 0
  const attention = options?.wapeThresholds?.attention ?? WAPE_THRESHOLD_ATTENTION
  const watch = options?.wapeThresholds?.watch ?? WAPE_THRESHOLD_WATCH

  if (wape > attention) {
    alerts.push("attention")
  } else if (wape > watch) {
    alerts.push("watch")
  }
```

(The rest of the function body from line 33 onwards stays exactly the same.)

Also update `countAlertsByType` to accept and forward options:

```ts
export function countAlertsByType(
  seriesList: SeriesAlertData[],
  options?: AlertThresholdOptions
): Record<AlertType, number> {
  // ...
  for (const series of seriesList) {
    const alerts = getSeriesAlerts(series, options)
    // ...
  }
  return counts
}
```

**Step 4: Run tests to verify all pass**

Run: `cd LumenIQ_webapp && npm test -- src/lib/__tests__/series-alerts.test.ts`
Expected: All tests pass (existing + new)

**Step 5: Commit**

```bash
git add src/lib/series-alerts.ts src/lib/__tests__/series-alerts.test.ts
git commit -m "refactor: add optional WAPE threshold params to getSeriesAlerts"
```

---

## Task 6: Refactor reliability-detail-table.tsx

**Files:**
- Modify: `src/components/dashboard/reliability-detail-table.tsx` (lines 1-28, 107)

**Context:** Three local functions (`getScoreColor`, `getScoreDotBg`, `getScoreDotShadow`) use hardcoded thresholds 80/50. This component is client-side, so it can use `useThresholds()`.

**Step 1: Replace hardcoded functions with threshold-aware logic**

Import hook and replace the three functions:

```tsx
import { useThresholds } from "@/lib/thresholds/context";
```

Remove the three standalone functions (lines 12-28). Inside the component, use the hook:

```tsx
export function ReliabilityDetailTable({ data, onModelClick }: ReliabilityDetailTableProps) {
  const { getColor } = useThresholds();

  const getScoreColor = (score: number): string => {
    const c = getColor("model_score", score);
    if (c === "green") return "text-emerald-400";
    if (c === "yellow") return "text-amber-400";
    return "text-red-400";
  };

  const getScoreDotBg = (score: number): string => {
    const c = getColor("model_score", score);
    if (c === "green") return "bg-emerald-400";
    if (c === "yellow") return "bg-amber-400";
    return "bg-red-400";
  };

  const getScoreDotShadow = (score: number): string => {
    const c = getColor("model_score", score);
    if (c === "green") return "shadow-[0_0_4px_rgba(52,211,153,0.5)]";
    if (c === "yellow") return "shadow-[0_0_4px_rgba(251,191,36,0.5)]";
    return "shadow-[0_0_4px_rgba(248,113,113,0.4)]";
  };

  // ... rest of component unchanged
```

**Step 2: Verify TypeScript compiles**

Run: `cd LumenIQ_webapp && npx tsc`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/dashboard/reliability-detail-table.tsx
git commit -m "refactor: use dynamic thresholds in reliability detail table"
```

---

## Task 7: Refactor results-content.tsx gauges

**Files:**
- Modify: `src/app/dashboard/results/results-content.tsx` (lines 249-312, 435)

**Context:** This component passes hardcoded threshold props to `MetricGaugeCard`:
- Line 255: `thresholds={{ good: 70, warning: 90 }}` (reliability)
- Line 267: `thresholds={{ good: 80, warning: 100 }}` (MASE)
- Line 279: `thresholds={{ good: 5, warning: 10 }}` (bias)
- Line 307: `thresholds={{ good: 70, warning: 90 }}` (reliable series)
- Line 435: `(s.wape ?? 0) > 20` hardcoded filter

Also the `reliableSeriesPct` calculation at line 151 uses `champion_score >= 70`.

**Step 1: Import useThresholds and replace hardcoded values**

Add import:
```tsx
import { useThresholds } from "@/lib/thresholds/context";
```

Inside `ResultsContent` component, add after existing hooks (around line 83):
```tsx
const { thresholds, getColor } = useThresholds();
```

Replace gauge threshold props:

Line 255 (reliability score gauge):
```tsx
thresholds={{ good: thresholds.reliability_score.yellow_max, warning: thresholds.reliability_score.green_max }}
```

Line 267 (MASE gauge):
```tsx
thresholds={{ good: thresholds.mase.green_max, warning: thresholds.mase.yellow_max }}
```

Line 279 (bias gauge):
```tsx
thresholds={{ good: thresholds.bias.green_max, warning: thresholds.bias.yellow_max }}
```

Line 307 (reliable series gauge):
```tsx
thresholds={{ good: thresholds.reliability_score.yellow_max, warning: thresholds.reliability_score.green_max }}
```

Replace line 151 (`champion_score >= 70`) in `reliableSeriesPct`:
```tsx
const reliable = scored.filter((s: any) => s.champion_score >= thresholds.reliability_score.yellow_max);
```

Replace line 435 (`(s.wape ?? 0) > 20`) in series filter:
```tsx
statusChecks.push((s.wape ?? 0) > thresholds.wape.yellow_max);
```

**Step 2: Verify TypeScript compiles**

Run: `cd LumenIQ_webapp && npx tsc`
Expected: No errors

**Step 3: Commit**

```bash
git add src/app/dashboard/results/results-content.tsx
git commit -m "refactor: use dynamic thresholds for gauge cards and series filter"
```

---

## Task 8: Wire thresholds into series-list.tsx

**Files:**
- Modify: `src/components/dashboard/series-list.tsx` (line 13, 44)

**Context:** `series-list.tsx` calls `getChampionScoreColor` at line 44 and line 143. It needs to pass the user's `reliability_score` thresholds.

**Step 1: Add useThresholds and pass to getChampionScoreColor**

Add import:
```tsx
import { useThresholds } from "@/lib/thresholds/context";
```

Inside `SeriesList`, add:
```tsx
const { thresholds } = useThresholds();
```

Replace line 44:
```tsx
const getScoreColor = (score: number | null) =>
  getChampionScoreColor(score, {
    green: thresholds.reliability_score.green_max,
    yellow: thresholds.reliability_score.yellow_max,
  });
```

**Step 2: Verify TypeScript compiles**

Run: `cd LumenIQ_webapp && npx tsc`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/dashboard/series-list.tsx
git commit -m "refactor: use dynamic thresholds in series list coloring"
```

---

## Task 9: Wire thresholds into AlertsSummaryCard and SeriesAlertBadges

**Files:**
- Modify: `src/components/dashboard/AlertsSummaryCard.tsx`
- Modify: `src/components/dashboard/results/SeriesAlertBadges.tsx`

**Context:** These components call `getSeriesAlerts()` and `countAlertsByType()`. They need to pass the WAPE thresholds from context.

**Step 1: Update AlertsSummaryCard**

Add import of `useThresholds`, build wapeThresholds from context, pass to `countAlertsByType`:

```tsx
const { thresholds } = useThresholds();
const wapeThresholds = {
  attention: thresholds.wape.yellow_max,
  watch: thresholds.wape.green_max,
};
// Then pass { wapeThresholds } to countAlertsByType(seriesList, { wapeThresholds })
```

**Step 2: Update SeriesAlertBadges similarly**

Pass `{ wapeThresholds }` to `getSeriesAlerts()`.

**Step 3: Update results-content.tsx filterCounts**

The `filterCounts` computation at line 107 also calls `getSeriesAlerts`. Pass thresholds:

```tsx
const alerts = getSeriesAlerts({...}, { wapeThresholds: { attention: thresholds.wape.yellow_max, watch: thresholds.wape.green_max } });
```

**Step 4: Run all tests**

Run: `cd LumenIQ_webapp && npm test`
Expected: All pass

**Step 5: Commit**

```bash
git add src/components/dashboard/AlertsSummaryCard.tsx src/components/dashboard/results/SeriesAlertBadges.tsx src/app/dashboard/results/results-content.tsx
git commit -m "refactor: pass dynamic WAPE thresholds to alert components"
```

---

## Task 10: Settings UI section

**Files:**
- Create: `src/components/dashboard/threshold-settings.tsx`
- Modify: `src/app/dashboard/settings/page.tsx` (add section after Preferences block)

**Step 1: Create the ThresholdSettings component**

```tsx
// src/components/dashboard/threshold-settings.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThresholds } from "@/lib/thresholds/context";
import { DEFAULT_THRESHOLDS, type ThresholdConfig } from "@/lib/thresholds/defaults";
import { cn } from "@/lib/utils";

function ThresholdCard({ config, isCustom, onUpdate, onReset }: {
  config: ThresholdConfig;
  isCustom: boolean;
  onUpdate: (green: number, yellow: number) => void;
  onReset: () => void;
}) {
  const isLower = config.direction === "lower_is_better";
  const [green, setGreen] = useState(config.green_max);
  const [yellow, setYellow] = useState(config.yellow_max);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync when config changes externally (reset)
  useEffect(() => {
    setGreen(config.green_max);
    setYellow(config.yellow_max);
    setError(null);
  }, [config.green_max, config.yellow_max]);

  const validate = useCallback(
    (g: number, y: number): boolean => {
      if (isLower) {
        if (g >= y) { setError("La borne verte doit etre inferieure a la borne jaune"); return false; }
      } else {
        if (g <= y) { setError("La borne verte doit etre superieure a la borne jaune"); return false; }
      }
      setError(null);
      return true;
    },
    [isLower]
  );

  const scheduleUpdate = useCallback(
    (g: number, y: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!validate(g, y)) return;
      debounceRef.current = setTimeout(() => onUpdate(g, y), 500);
    },
    [onUpdate, validate]
  );

  const handleGreenChange = (val: string) => {
    const n = Number(val);
    if (isNaN(n)) return;
    setGreen(n);
    scheduleUpdate(n, yellow);
  };

  const handleYellowChange = (val: string) => {
    const n = Number(val);
    if (isNaN(n)) return;
    setYellow(n);
    scheduleUpdate(green, n);
  };

  // Preview bar proportions
  const total = isLower
    ? Math.max(yellow * 1.5, 100)
    : Math.max(green * 1.2, 100);
  const greenWidth = isLower
    ? (green / total) * 100
    : ((total - green) / total) * 100;
  const yellowWidth = isLower
    ? ((yellow - green) / total) * 100
    : ((green - yellow) / total) * 100;

  return (
    <div className="dash-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-white">{config.label}</h4>
          <span className="text-xs text-zinc-500">({config.unit})</span>
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium",
              isCustom
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-zinc-700/50 text-zinc-400"
            )}
          >
            {isCustom ? "Personnalise" : "Par defaut"}
          </span>
        </div>
        {isCustom && (
          <button
            onClick={onReset}
            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">
            {isLower ? "Vert <=" : "Vert >="}
          </label>
          <input
            type="number"
            step="any"
            value={green}
            onChange={(e) => handleGreenChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">
            {isLower ? "Jaune <=" : "Jaune >="}
          </label>
          <input
            type="number"
            step="any"
            value={yellow}
            onChange={(e) => handleYellowChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
        <div className="flex items-end">
          <span className="text-xs text-zinc-500 pb-2.5">
            {isLower ? `Rouge > ${yellow}` : `Rouge < ${yellow}`}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 mb-3">{error}</p>
      )}

      {/* Color preview bar */}
      <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
        <div
          className="bg-emerald-500 transition-all"
          style={{ width: `${Math.max(greenWidth, 0)}%` }}
        />
        <div
          className="bg-amber-500 transition-all"
          style={{ width: `${Math.max(yellowWidth, 0)}%` }}
        />
        <div className="bg-red-500 flex-1" />
      </div>
    </div>
  );
}

export function ThresholdSettings() {
  const { thresholds, isCustom, updateThreshold, resetThreshold, resetAll } =
    useThresholds();

  const hasAnyCustom = DEFAULT_THRESHOLDS.some((d) => isCustom(d.metric_key));

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="dash-section-title">Seuils d&apos;affichage</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Personnalisez les seuils de coloration des metriques
          </p>
        </div>
        {hasAnyCustom && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAll}
            className="text-zinc-400 hover:text-white gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reinitialiser tout
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {DEFAULT_THRESHOLDS.map((def) => (
          <ThresholdCard
            key={def.metric_key}
            config={thresholds[def.metric_key] ?? def}
            isCustom={isCustom(def.metric_key)}
            onUpdate={(g, y) => updateThreshold(def.metric_key, g, y)}
            onReset={() => resetThreshold(def.metric_key)}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Add to settings page**

Modify `src/app/dashboard/settings/page.tsx`:

Add import:
```tsx
import { ThresholdSettings } from "@/components/dashboard/threshold-settings";
```

Insert `<ThresholdSettings />` after the Preferences card (after line 226, before the API card at line 228):

```tsx
        {/* Thresholds */}
        <ThresholdSettings />
```

**Step 3: Verify TypeScript compiles**

Run: `cd LumenIQ_webapp && npx tsc`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/dashboard/threshold-settings.tsx src/app/dashboard/settings/page.tsx
git commit -m "feat: add threshold settings UI section to settings page"
```

---

## Task 11: Full verification

**Step 1: Run all tests**

Run: `cd LumenIQ_webapp && npm test`
Expected: All tests pass

**Step 2: Type check**

Run: `cd LumenIQ_webapp && npx tsc`
Expected: No errors

**Step 3: Build**

Run: `cd LumenIQ_webapp && npm run build`
Expected: Successful build

**Step 4: Lint**

Run: `cd LumenIQ_webapp && npm run lint`
Expected: No errors

**Step 5: Final commit if any remaining changes**

```bash
git add -A
git commit -m "chore: final verification for user thresholds feature"
```
