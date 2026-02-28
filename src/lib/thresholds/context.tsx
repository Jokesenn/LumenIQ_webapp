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
  /** Merged thresholds indexed by metric_key (custom overrides defaults) */
  thresholds: Record<string, ThresholdConfig>;
  /** Get the color zone for a metric value */
  getColor: (metricKey: string, value: number) => ThresholdColor;
  /** UPSERT a custom threshold (optimistic update) */
  updateThreshold: (
    metricKey: string,
    green_max: number,
    yellow_max: number
  ) => Promise<void>;
  /** Delete a single custom threshold (reset to default) */
  resetThreshold: (metricKey: string) => Promise<void>;
  /** Delete all custom thresholds (reset everything to defaults) */
  resetAll: () => Promise<void>;
  /** True while initial fetch is in progress */
  isLoading: boolean;
  /** Whether a metric has a custom (non-default) threshold */
  isCustom: (metricKey: string) => boolean;
}

const ThresholdsContext = createContext<ThresholdsContextValue | null>(null);

export function useThresholds(): ThresholdsContextValue {
  const ctx = useContext(ThresholdsContext);
  if (!ctx) {
    throw new Error("useThresholds must be used within a ThresholdsProvider");
  }
  return ctx;
}

const defaultMap = buildThresholdsMap(DEFAULT_THRESHOLDS);

export function ThresholdsProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabase();
  const { user, loading: userLoading } = useUser();

  const [customRows, setCustomRows] = useState<ThresholdConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch custom thresholds from Supabase on mount / user change
  useEffect(() => {
    if (userLoading) return;

    let cancelled = false;

    async function fetchThresholds() {
      if (!user) {
        if (!cancelled) {
          setCustomRows([]);
          setIsLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .schema("lumeniq")
        .from("user_thresholds")
        .select("metric_key, green_max, yellow_max")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (error) {
        console.error("Failed to fetch user thresholds:", error.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        const rows: ThresholdConfig[] = data.map(
          (row: { metric_key: string; green_max: number; yellow_max: number }) => {
            const base = defaultMap[row.metric_key];
            return {
              metric_key: row.metric_key,
              label: base?.label ?? row.metric_key,
              unit: base?.unit ?? "",
              green_max: row.green_max,
              yellow_max: row.yellow_max,
              direction: base?.direction ?? "lower_is_better",
            };
          }
        );
        setCustomRows(rows);
      }

      setIsLoading(false);
    }

    fetchThresholds();

    return () => {
      cancelled = true;
    };
  }, [supabase, user, userLoading]);

  // Merged thresholds: defaults + custom overrides
  const thresholds = useMemo<Record<string, ThresholdConfig>>(() => {
    const merged = { ...defaultMap };
    for (const row of customRows) {
      if (merged[row.metric_key]) {
        merged[row.metric_key] = {
          ...merged[row.metric_key],
          green_max: row.green_max,
          yellow_max: row.yellow_max,
        };
      }
    }
    return merged;
  }, [customRows]);

  // Set of custom metric keys for O(1) lookup
  const customKeys = useMemo(
    () => new Set(customRows.map((r) => r.metric_key)),
    [customRows]
  );

  const getColor = useCallback(
    (metricKey: string, value: number): ThresholdColor => {
      const t = thresholds[metricKey];
      if (!t) return "red";
      return getColorFromThreshold(t, value);
    },
    [thresholds]
  );

  const updateThreshold = useCallback(
    async (metricKey: string, green_max: number, yellow_max: number) => {
      if (!user) return;

      // Optimistic update
      const prevRows = customRows;
      const existing = customRows.find((r) => r.metric_key === metricKey);
      const base = defaultMap[metricKey];

      const newRow: ThresholdConfig = {
        metric_key: metricKey,
        label: base?.label ?? metricKey,
        unit: base?.unit ?? "",
        green_max,
        yellow_max,
        direction: base?.direction ?? "lower_is_better",
      };

      if (existing) {
        setCustomRows((rows) =>
          rows.map((r) => (r.metric_key === metricKey ? newRow : r))
        );
      } else {
        setCustomRows((rows) => [...rows, newRow]);
      }

      const { error } = await supabase
        .schema("lumeniq")
        .from("user_thresholds")
        .upsert(
          {
            user_id: user.id,
            metric_key: metricKey,
            green_max,
            yellow_max,
          },
          { onConflict: "user_id,metric_key" }
        );

      if (error) {
        console.error("Failed to update threshold:", error.message);
        // Rollback
        setCustomRows(prevRows);
      }
    },
    [supabase, user, customRows]
  );

  const resetThreshold = useCallback(
    async (metricKey: string) => {
      if (!user) return;

      // Optimistic update
      const prevRows = customRows;
      setCustomRows((rows) => rows.filter((r) => r.metric_key !== metricKey));

      const { error } = await supabase
        .schema("lumeniq")
        .from("user_thresholds")
        .delete()
        .eq("user_id", user.id)
        .eq("metric_key", metricKey);

      if (error) {
        console.error("Failed to reset threshold:", error.message);
        // Rollback
        setCustomRows(prevRows);
      }
    },
    [supabase, user, customRows]
  );

  const resetAll = useCallback(async () => {
    if (!user) return;

    // Optimistic update
    const prevRows = customRows;
    setCustomRows([]);

    const { error } = await supabase
      .schema("lumeniq")
      .from("user_thresholds")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to reset all thresholds:", error.message);
      // Rollback
      setCustomRows(prevRows);
    }
  }, [supabase, user, customRows]);

  const isCustom = useCallback(
    (metricKey: string): boolean => customKeys.has(metricKey),
    [customKeys]
  );

  const value = useMemo<ThresholdsContextValue>(
    () => ({
      thresholds,
      getColor,
      updateThreshold,
      resetThreshold,
      resetAll,
      isLoading,
      isCustom,
    }),
    [
      thresholds,
      getColor,
      updateThreshold,
      resetThreshold,
      resetAll,
      isLoading,
      isCustom,
    ]
  );

  return (
    <ThresholdsContext.Provider value={value}>
      {children}
    </ThresholdsContext.Provider>
  );
}
