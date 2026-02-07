export type JobStatus = 'pending' | 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type PlanType = 'standard' | 'ml' | 'premium'

export interface ForecastJob {
  id: string
  user_id: string
  filename: string
  input_path: string
  file_size_bytes: number
  series_count?: number | null
  date_column?: string | null
  value_columns?: string[] | null
  plan_at_run: PlanType
  models_requested?: string[] | null
  horizon?: number | null
  frequency?: string | null
  status: JobStatus
  progress: number
  current_step?: string | null
  error_message?: string | null
  created_at?: string
  started_at?: string | null
  completed_at?: string | null
  results_path?: string | null
}

export interface ForecastJobInsert {
  id: string
  user_id: string
  filename: string
  input_path: string
  file_size_bytes: number
  status: JobStatus
  progress: number
  plan_at_run: PlanType
}

export interface WebhookPayload {
  job_id: string
  user_id: string
  plan: PlanType
  input_path: string
  filename: string
  config_override?: {
    horizon_months: number
    gating_enabled: boolean
    confidence_interval: number
  }
}

export type UploadStep = 'idle' | 'uploading' | 'creating_job' | 'triggering_webhook' | 'complete' | 'error'

// Types pour la navigation inter-séries et le tri
export type SeriesSortOption = 'alpha' | 'smape' | 'abc'

export interface SeriesListItem {
  series_id: string
  abc_class: string
  xyz_class: string
  wape: number | null
  smape: number | null
  champion_score: number | null
  champion_model: string
  behavior_tags?: string[] | null
  alerts?: string[] | null
  was_gated?: boolean | null
  drift_detected?: boolean | null
  is_first_run?: boolean | null
  previous_champion?: string | null
  cv?: number | null
  history_sample?: number[] | null
  forecast_sample?: number[] | null
}

export interface UploadProgress {
  step: UploadStep
  uploadProgress: number
  stepMessage: string
}
