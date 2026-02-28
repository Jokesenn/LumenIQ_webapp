export interface SeriesPdfData {
  series_id: string
  abc_class: string
  xyz_class: string
  smape: number
  wape?: number | null
  champion_score?: number | null
  mape?: number | null
  champion_model: string
  cv: number | null
  horizon: number
  total_value?: number | null
  was_gated?: boolean | null
  drift_detected?: boolean | null
}

export interface ForecastPoint {
  date: string
  forecast: number
  lower: number | null
  upper: number | null
}

export interface HistoricalPoint {
  date: string
  value: number
}
