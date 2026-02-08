import type { AlertType } from "@/components/ui/alert-badge"

export interface SeriesAlertData {
  wape: number | null
  was_gated?: boolean | null
  drift_detected?: boolean | null
  is_first_run?: boolean | null
  previous_champion?: string | null
  champion_model: string
}

/**
 * Détermine les alertes applicables à une série
 * basé sur les données de lumeniq.forecast_results
 * Seuils basés sur WAPE (typiquement plus élevé que SMAPE)
 */
export function getSeriesAlerts(series: SeriesAlertData): AlertType[] {
  const alerts: AlertType[] = []
  const wape = series.wape ?? 0

  // Performance alerts (mutuellement exclusifs - prendre le pire)
  if (wape > 20) {
    alerts.push("attention")
  } else if (wape > 15) {
    alerts.push("watch")
  }

  // Drift detected
  if (series.drift_detected) {
    alerts.push("drift")
  }

  // Nouvelle série
  if (series.is_first_run) {
    alerts.push("new")
  }

  // Modèle changé (seulement si pas first_run et previous_champion existe)
  if (
    !series.is_first_run &&
    series.previous_champion &&
    series.previous_champion !== series.champion_model
  ) {
    alerts.push("model-changed")
  }

  // Gated (bonne chose - série stable)
  if (series.was_gated) {
    alerts.push("gated")
  }

  return alerts
}

/**
 * Trie les alertes par priorité (les plus critiques en premier)
 */
export function sortAlertsByPriority(alerts: AlertType[]): AlertType[] {
  const priority: Record<AlertType, number> = {
    attention: 1,
    watch: 2,
    drift: 3,
    "model-changed": 4,
    new: 5,
    gated: 6,
  }

  return [...alerts].sort((a, b) => priority[a] - priority[b])
}

/**
 * Compte les alertes par type pour un ensemble de séries
 */
export function countAlertsByType(
  seriesList: SeriesAlertData[]
): Record<AlertType, number> {
  const counts: Record<AlertType, number> = {
    attention: 0,
    watch: 0,
    drift: 0,
    new: 0,
    "model-changed": 0,
    gated: 0,
  }

  for (const series of seriesList) {
    const alerts = getSeriesAlerts(series)
    for (const alert of alerts) {
      counts[alert]++
    }
  }

  return counts
}
