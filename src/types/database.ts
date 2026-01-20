// Types générés pour le schéma Supabase 'lumeniq'

// ============================================
// ENUMs
// ============================================

export type AbcClass = 'A' | 'B' | 'C'
export type XyzClass = 'X' | 'Y' | 'Z'
export type JobStatus = 'pending' | 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type PlanType = 'standard' | 'ml' | 'foundation'
export type SynthesisType = 'executive' | 'detailed' | 'inventory' | 'custom'

// ============================================
// Database Interface
// ============================================

export interface Database {
  lumeniq: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          plan: PlanType
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          current_period_start: string | null
          series_used_this_period: number | null
          api_key: string | null
          api_key_created_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          plan?: PlanType
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          current_period_start?: string | null
          series_used_this_period?: number | null
          api_key?: string | null
          api_key_created_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          plan?: PlanType
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          current_period_start?: string | null
          series_used_this_period?: number | null
          api_key?: string | null
          api_key_created_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      plans: {
        Row: {
          id: PlanType
          name: string
          price_monthly: number
          series_quota: number
          models_available: string[]
          features: Record<string, unknown>
          created_at: string | null
        }
        Insert: {
          id: PlanType
          name: string
          price_monthly: number
          series_quota: number
          models_available: string[]
          features?: Record<string, unknown>
          created_at?: string | null
        }
        Update: {
          id?: PlanType
          name?: string
          price_monthly?: number
          series_quota?: number
          models_available?: string[]
          features?: Record<string, unknown>
          created_at?: string | null
        }
      }
      forecast_jobs: {
        Row: {
          id: string
          user_id: string
          filename: string
          input_path: string
          file_size_bytes: number | null
          series_count: number | null
          date_column: string | null
          value_columns: string[] | null
          plan_at_run: PlanType
          models_requested: string[] | null
          horizon: number | null
          frequency: string | null
          status: JobStatus | null
          progress: number | null
          current_step: string | null
          error_message: string | null
          results_path: string | null
          series_processed: number | null
          avg_wape: number | null
          avg_smape: number | null
          avg_bias: number | null
          top_champion_model: string | null
          created_at: string | null
          started_at: string | null
          completed_at: string | null
          compute_time_seconds: number | null
          models_evaluated: number | null
        }
        Insert: {
          id?: string
          user_id: string
          filename: string
          input_path: string
          file_size_bytes?: number | null
          series_count?: number | null
          date_column?: string | null
          value_columns?: string[] | null
          plan_at_run: PlanType
          models_requested?: string[] | null
          horizon?: number | null
          frequency?: string | null
          status?: JobStatus | null
          progress?: number | null
          current_step?: string | null
          error_message?: string | null
          results_path?: string | null
          series_processed?: number | null
          avg_wape?: number | null
          avg_smape?: number | null
          avg_bias?: number | null
          top_champion_model?: string | null
          created_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          compute_time_seconds?: number | null
          models_evaluated?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          input_path?: string
          file_size_bytes?: number | null
          series_count?: number | null
          date_column?: string | null
          value_columns?: string[] | null
          plan_at_run?: PlanType
          models_requested?: string[] | null
          horizon?: number | null
          frequency?: string | null
          status?: JobStatus | null
          progress?: number | null
          current_step?: string | null
          error_message?: string | null
          results_path?: string | null
          series_processed?: number | null
          avg_wape?: number | null
          avg_smape?: number | null
          avg_bias?: number | null
          top_champion_model?: string | null
          created_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          compute_time_seconds?: number | null
          models_evaluated?: number | null
        }
      }
      forecast_results: {
        Row: {
          id: string
          job_id: string
          user_id: string
          series_id: string
          abc_class: AbcClass | null
          xyz_class: XyzClass | null
          behavior_tags: string[] | null
          cv_coefficient: number | null
          champion_model: string
          champion_score: number | null
          wape: number | null
          smape: number | null
          mape: number | null
          mase: number | null
          bias_pct: number | null
          mae: number | null
          rmse: number | null
          forecast_horizon: number | null
          forecast_sum: number | null
          forecast_avg: number | null
          confidence_level: number | null
          challengers: Record<string, unknown> | null
          models_tested: number | null
          alerts: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          series_id: string
          abc_class?: AbcClass | null
          xyz_class?: XyzClass | null
          behavior_tags?: string[] | null
          cv_coefficient?: number | null
          champion_model: string
          champion_score?: number | null
          wape?: number | null
          smape?: number | null
          mape?: number | null
          mase?: number | null
          bias_pct?: number | null
          mae?: number | null
          rmse?: number | null
          forecast_horizon?: number | null
          forecast_sum?: number | null
          forecast_avg?: number | null
          confidence_level?: number | null
          challengers?: Record<string, unknown> | null
          models_tested?: number | null
          alerts?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          series_id?: string
          abc_class?: AbcClass | null
          xyz_class?: XyzClass | null
          behavior_tags?: string[] | null
          cv_coefficient?: number | null
          champion_model?: string
          champion_score?: number | null
          wape?: number | null
          smape?: number | null
          mape?: number | null
          mase?: number | null
          bias_pct?: number | null
          mae?: number | null
          rmse?: number | null
          forecast_horizon?: number | null
          forecast_sum?: number | null
          forecast_avg?: number | null
          confidence_level?: number | null
          challengers?: Record<string, unknown> | null
          models_tested?: number | null
          alerts?: string[] | null
          created_at?: string | null
        }
      }
      forecast_results_months: {
        Row: {
          id: string
          job_id: string
          user_id: string
          series_id: string
          ds: string
          yhat: number
          yhat_lower: number | null
          yhat_upper: number | null
          model_name: string
          model_version: string | null
          train_end_ds: string
          freq: string
          confidence_level: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          series_id: string
          ds: string
          yhat: number
          yhat_lower?: number | null
          yhat_upper?: number | null
          model_name: string
          model_version?: string | null
          train_end_ds: string
          freq?: string
          confidence_level?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          series_id?: string
          ds?: string
          yhat?: number
          yhat_lower?: number | null
          yhat_upper?: number | null
          model_name?: string
          model_version?: string | null
          train_end_ds?: string
          freq?: string
          confidence_level?: number | null
          created_at?: string | null
        }
      }
      series_actuals: {
        Row: {
          id: string
          user_id: string
          job_id: string
          series_id: string
          ds: string
          y: number | null
          is_outlier: boolean | null
          is_imputed: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          series_id: string
          ds: string
          y?: number | null
          is_outlier?: boolean | null
          is_imputed?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          series_id?: string
          ds?: string
          y?: number | null
          is_outlier?: boolean | null
          is_imputed?: boolean | null
          created_at?: string | null
        }
      }
      forecast_syntheses: {
        Row: {
          id: string
          job_id: string
          user_id: string
          type: SynthesisType
          title: string
          storage_path: string | null
          content: string | null
          model_used: string | null
          tokens_used: number | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          type: SynthesisType
          title: string
          storage_path?: string | null
          content?: string | null
          model_used?: string | null
          tokens_used?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          type?: SynthesisType
          title?: string
          storage_path?: string | null
          content?: string | null
          model_used?: string | null
          tokens_used?: number | null
          created_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          job_id: string | null
          event_type: string
          series_count: number | null
          period_start: string
          metadata: Record<string, unknown> | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          job_id?: string | null
          event_type: string
          series_count?: number | null
          period_start: string
          metadata?: Record<string, unknown> | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string | null
          event_type?: string
          series_count?: number | null
          period_start?: string
          metadata?: Record<string, unknown> | null
          created_at?: string | null
        }
      }
      api_logs: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          method: string
          request_body: Record<string, unknown> | null
          status_code: number | null
          response_time_ms: number | null
          ip_address: string | null
          user_agent: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          method: string
          request_body?: Record<string, unknown> | null
          status_code?: number | null
          response_time_ms?: number | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          method?: string
          request_body?: Record<string, unknown> | null
          status_code?: number | null
          response_time_ms?: number | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | null
        }
      }
      state_store: {
        Row: {
          id: string
          user_id: string
          series_id: string
          champion_model: string | null
          last_scores: Record<string, unknown> | null
          profile_metrics: Record<string, unknown> | null
          last_eval_ds: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          series_id: string
          champion_model?: string | null
          last_scores?: Record<string, unknown> | null
          profile_metrics?: Record<string, unknown> | null
          last_eval_ds?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          series_id?: string
          champion_model?: string | null
          last_scores?: Record<string, unknown> | null
          profile_metrics?: Record<string, unknown> | null
          last_eval_ds?: string | null
          updated_at?: string | null
        }
      }
      job_summaries: {
        Row: {
          id: string
          job_id: string
          user_id: string
          duration_sec: number | null
          global_wape: number | null
          global_smape: number | null
          global_mape: number | null
          global_bias_pct: number | null
          avg_interval_width_pct: number | null
          n_series_total: number
          n_series_success: number
          n_series_failed: number
          winner_models: Record<string, number> | null
          winner_categories: Record<string, number> | null
          top_model: string | null
          alerts_high: number | null
          alerts_medium: number | null
          alerts_low: number | null
          data_quality: Record<string, unknown> | null
          n_rows_input: number | null
          n_rows_clean: number | null
          schema_version: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          duration_sec?: number | null
          global_wape?: number | null
          global_smape?: number | null
          global_mape?: number | null
          global_bias_pct?: number | null
          avg_interval_width_pct?: number | null
          n_series_total: number
          n_series_success?: number
          n_series_failed?: number
          winner_models?: Record<string, number> | null
          winner_categories?: Record<string, number> | null
          top_model?: string | null
          alerts_high?: number | null
          alerts_medium?: number | null
          alerts_low?: number | null
          data_quality?: Record<string, unknown> | null
          n_rows_input?: number | null
          n_rows_clean?: number | null
          schema_version?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          duration_sec?: number | null
          global_wape?: number | null
          global_smape?: number | null
          global_mape?: number | null
          global_bias_pct?: number | null
          avg_interval_width_pct?: number | null
          n_series_total?: number
          n_series_success?: number
          n_series_failed?: number
          winner_models?: Record<string, number> | null
          winner_categories?: Record<string, number> | null
          top_model?: string | null
          alerts_high?: number | null
          alerts_medium?: number | null
          alerts_low?: number | null
          data_quality?: Record<string, unknown> | null
          n_rows_input?: number | null
          n_rows_clean?: number | null
          schema_version?: string | null
          created_at?: string | null
        }
      }
      job_monthly_aggregates: {
        Row: {
          id: string
          job_id: string
          user_id: string
          ds: string
          actual_sum: number | null
          actual_count: number | null
          forecast_sum: number | null
          forecast_lower_sum: number | null
          forecast_upper_sum: number | null
          forecast_count: number | null
          is_forecast: boolean
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          ds: string
          actual_sum?: number | null
          actual_count?: number | null
          forecast_sum?: number | null
          forecast_lower_sum?: number | null
          forecast_upper_sum?: number | null
          forecast_count?: number | null
          is_forecast: boolean
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          ds?: string
          actual_sum?: number | null
          actual_count?: number | null
          forecast_sum?: number | null
          forecast_lower_sum?: number | null
          forecast_upper_sum?: number | null
          forecast_count?: number | null
          is_forecast?: boolean
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      abc_class: AbcClass
      xyz_class: XyzClass
      job_status: JobStatus
      plan_type: PlanType
      synthesis_type: SynthesisType
    }
  }
}

// ============================================
// Helper Types
// ============================================

export type Profile = Database['lumeniq']['Tables']['profiles']['Row']
export type ProfileInsert = Database['lumeniq']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['lumeniq']['Tables']['profiles']['Update']

export type Plan = Database['lumeniq']['Tables']['plans']['Row']

export type ForecastJob = Database['lumeniq']['Tables']['forecast_jobs']['Row']
export type ForecastJobInsert = Database['lumeniq']['Tables']['forecast_jobs']['Insert']
export type ForecastJobUpdate = Database['lumeniq']['Tables']['forecast_jobs']['Update']

export type ForecastResult = Database['lumeniq']['Tables']['forecast_results']['Row']
export type ForecastResultInsert = Database['lumeniq']['Tables']['forecast_results']['Insert']

export type ForecastResultMonth = Database['lumeniq']['Tables']['forecast_results_months']['Row']
export type ForecastResultMonthInsert = Database['lumeniq']['Tables']['forecast_results_months']['Insert']

export type SeriesActual = Database['lumeniq']['Tables']['series_actuals']['Row']
export type SeriesActualInsert = Database['lumeniq']['Tables']['series_actuals']['Insert']

export type ForecastSynthesis = Database['lumeniq']['Tables']['forecast_syntheses']['Row']
export type ForecastSynthesisInsert = Database['lumeniq']['Tables']['forecast_syntheses']['Insert']

export type UsageLog = Database['lumeniq']['Tables']['usage_logs']['Row']
export type UsageLogInsert = Database['lumeniq']['Tables']['usage_logs']['Insert']

export type ApiLog = Database['lumeniq']['Tables']['api_logs']['Row']
export type ApiLogInsert = Database['lumeniq']['Tables']['api_logs']['Insert']

export type StateStore = Database['lumeniq']['Tables']['state_store']['Row']
export type StateStoreInsert = Database['lumeniq']['Tables']['state_store']['Insert']
export type StateStoreUpdate = Database['lumeniq']['Tables']['state_store']['Update']

export type JobSummary = Database['lumeniq']['Tables']['job_summaries']['Row']
export type JobSummaryInsert = Database['lumeniq']['Tables']['job_summaries']['Insert']

export type JobMonthlyAggregate = Database['lumeniq']['Tables']['job_monthly_aggregates']['Row']
export type JobMonthlyAggregateInsert = Database['lumeniq']['Tables']['job_monthly_aggregates']['Insert']
