/**
 * Utilitaires partagés pour les données de graphiques.
 *
 * fillZeroGap : remplit les périodes manquantes entre le dernier actual
 * et le premier forecast avec des valeurs actual=0.
 *
 * bridgeChartGap : connecte visuellement la dernière valeur réelle
 * à la première valeur de prévision dans un tableau trié de points
 * de graphique. Cela évite un "trou" entre les deux lignes dans Recharts.
 *
 * resolveGlobalErrorRatio : chaîne de fallback pour les métriques
 * d'erreur globales au niveau job (global_wape → global_smape).
 */

import { classifyFreq } from "@/lib/date-format";

export interface ChartPoint {
  actual?: number;
  forecast?: number;
  forecastLower?: number;
  forecastUpper?: number;
  [key: string]: unknown;
}

/**
 * Fill the gap between the last actual data point and the first forecast
 * with zero-valued actual entries. Ensures dormant/end-of-life series
 * show continuous zeros instead of a visual jump (e.g. Dec 2023 → Jan 2026).
 *
 * Operates on the dataMap before sorting. Frequency determines step size.
 */
export function fillZeroGap(
  dataMap: Map<string, Record<string, unknown>>,
  lastActualKey: string | undefined,
  firstForecastKey: string | undefined,
  frequency: string | null | undefined,
  formatFn: (ds: string, freq: string | null | undefined) => string,
): void {
  if (!lastActualKey || !firstForecastKey) return;

  const family = classifyFreq(frequency ?? "");
  const start = new Date(lastActualKey);
  const end = new Date(firstForecastKey);

  if (start >= end) return;

  const cursor = new Date(start);

  // Advance one step past the last actual
  switch (family) {
    case "W":
      cursor.setDate(cursor.getDate() + 7);
      break;
    case "D":
      cursor.setDate(cursor.getDate() + 1);
      break;
    default: // M, Q, H
      cursor.setMonth(cursor.getMonth() + 1);
  }

  while (cursor < end) {
    const key =
      family === "M" || family === "Q"
        ? `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-01`
        : cursor.toISOString().split("T")[0];

    if (!dataMap.has(key)) {
      dataMap.set(key, {
        date: formatFn(key, frequency),
        actual: 0,
      });
    }

    switch (family) {
      case "W":
        cursor.setDate(cursor.getDate() + 7);
        break;
      case "D":
        cursor.setDate(cursor.getDate() + 1);
        break;
      default:
        cursor.setMonth(cursor.getMonth() + 1);
    }
  }
}

/**
 * Bridge the gap between the last actual data point and the first
 * forecast-only point so Recharts draws a continuous transition line.
 * Mutates the array in-place and returns it for convenience.
 */
export function bridgeChartGap<T extends ChartPoint>(data: T[]): T[] {
  const lastActualIdx = data.findLastIndex((d) => d.actual !== undefined);
  const firstForecastOnlyIdx = data.findIndex(
    (d) => d.forecast !== undefined && d.actual === undefined,
  );
  if (
    lastActualIdx >= 0 &&
    firstForecastOnlyIdx > lastActualIdx &&
    data[lastActualIdx].forecast === undefined
  ) {
    const actualVal = data[lastActualIdx].actual as number;
    data[lastActualIdx] = {
      ...data[lastActualIdx],
      forecast: actualVal,
      forecastLower: actualVal,
      forecastUpper: actualVal,
    };
  }
  return data;
}

/**
 * Résout le ratio d'erreur global pour un job.
 * Chaîne de priorité : global_wape → global_smape.
 * Retourne null si aucune métrique n'est disponible.
 */
export function resolveGlobalErrorRatio(data: {
  global_wape?: unknown;
  global_smape?: unknown;
}): number | null {
  if (data.global_wape != null) return Number(data.global_wape);
  if (data.global_smape != null) return Number(data.global_smape);
  return null;
}
