export type JobStatus = 'pending' | 'queued' | 'processing' | 'completed' | 'failed'
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
}

export type UploadStep = 'idle' | 'uploading' | 'creating_job' | 'triggering_webhook' | 'complete' | 'error'

export interface UploadProgress {
  step: UploadStep
  uploadProgress: number
  stepMessage: string
}
