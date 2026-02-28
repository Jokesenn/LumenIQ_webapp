/**
 * Utilitaires partagés pour les données de graphiques.
 *
 * bridgeChartGap : connecte visuellement la dernière valeur réelle
 * à la première valeur de prévision dans un tableau trié de points
 * de graphique. Cela évite un "trou" entre les deux lignes dans Recharts.
 *
 * resolveGlobalErrorRatio : chaîne de fallback pour les métriques
 * d'erreur globales au niveau job (global_wape → global_smape).
 */

export interface ChartPoint {
  actual?: number;
  forecast?: number;
  forecastLower?: number;
  forecastUpper?: number;
  [key: string]: unknown;
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
