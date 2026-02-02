// Types et constantes pour les préférences forecast utilisateur

export type HorizonMonths = 3 | 6 | 9 | 12
export type ConfidenceInterval = 80 | 90 | 95

// Row type (matches lumeniq.user_preferences)
export interface UserPreferences {
  user_id: string
  horizon_months: HorizonMonths
  gating_enabled: boolean
  confidence_interval: ConfidenceInterval
  created_at: string
  updated_at: string
}

// Sous-ensemble pour le config override du webhook
export interface ForecastConfigOverride {
  horizon_months: number
  gating_enabled: boolean
  confidence_interval: number
}

// Valeurs par défaut
export const DEFAULT_PREFERENCES: ForecastConfigOverride = {
  horizon_months: 6,
  gating_enabled: true,
  confidence_interval: 90,
}

// Options pour les selects UI
export const HORIZON_OPTIONS: { value: HorizonMonths; label: string }[] = [
  { value: 3, label: '3 mois' },
  { value: 6, label: '6 mois' },
  { value: 9, label: '9 mois' },
  { value: 12, label: '12 mois' },
]

export const CONFIDENCE_OPTIONS: { value: ConfidenceInterval; label: string }[] = [
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
  { value: 95, label: '95%' },
]
