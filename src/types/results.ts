/**
 * Types pour les données retournées par les fonctions de query du module results.
 * Utilisés comme props typées dans ResultsContent et SeriesContent.
 */

import type { ForecastJob as ForecastJobRow, JobSummary as JobSummaryRow } from "./database";
import type { ChartPoint } from "@/lib/chart-utils";

// ---- Job & Summary ----

/** Row brute de forecast_jobs (select *) */
export type ResultsJob = ForecastJobRow;

/** Row brute de job_summaries (select *) */
export type ResultsSummary = JobSummaryRow;

// ---- Metrics (retour de getJobMetrics) ----

export interface JobMetrics {
  global_wape: number | null;
  global_smape: number | null;
  global_mase: number | null;
  global_bias_pct: number | null;
  n_series_total: number;
  n_series_success: number;
  n_series_failed: number;
  championScore: number | null;
}

// ---- Series items (retour de getTopBottomSeries / getJobSeriesList) ----
// Étend SeriesListItem (forecast.ts) avec les champs additionnels pour le portfolio

import type { SeriesListItem } from "./forecast";

export interface SeriesRow extends SeriesListItem {
  // Override optional fields from SeriesListItem to match PortfolioView.SeriesData
  behavior_tags: string[] | null;
  alerts: string[] | null;
  was_gated: boolean | null;
  drift_detected: boolean | null;
  is_first_run: boolean | null;
  previous_champion: string | null;
  cv: number | null;
  history_sample: number[] | null;
  forecast_sample: number[] | null;
  // Additional fields from getJobSeriesList
  forecast_sum: number | null;
  forecast_avg: number | null;
  // Index signature for compatibility with PortfolioView.SeriesData
  [key: string]: unknown;
}

// ---- Chart data ----

export interface ResultsChartPoint extends ChartPoint {
  date: string;
}

// ---- ABC/XYZ matrix ----

export interface AbcXyzCell {
  abc: "A" | "B" | "C";
  xyz: "X" | "Y" | "Z";
  count: number;
  percentage: number;
}

// ---- Model performance ----

export interface ModelPerformanceRow {
  model: string;
  count: number;
  percentage: number;
  avgChampionScore: number;
}

// ---- Synthesis ----

export interface SynthesisRow {
  type: string;
  title: string;
  content: string;
  created_at: string;
}

// ---- Series detail (retour de getSeriesDetails) ----

export interface SeriesDetail {
  series_id: string;
  abc_class: string | null;
  xyz_class: string | null;
  wape: number | null;
  smape: number | null;
  mape: number | null;
  champion_score: number | null;
  champion_model: string;
  behavior_tags?: string[] | null;
  alerts?: string[] | null;
  was_gated?: boolean | null;
  drift_detected?: boolean | null;
  is_first_run?: boolean | null;
  previous_champion?: string | null;
  gating_reason?: string | null;
  cv?: number | null;
  cv_coefficient?: number | null;
  bias_pct?: number | null;
  mase?: number | null;
  forecast_horizon?: number | null;
  forecast_sum?: number | null;
  forecast_avg?: number | null;
  confidence_level?: number | null;
  models_tested?: number | null;
}

// ---- Model comparison (retour de getSeriesModelComparison) ----

export interface ModelRankingEntry {
  model: string;
  score: number;
  rank: number;
}

export interface ModelComparisonData {
  champion: string;
  championScore: number;
  modelsTested: number;
  ranking: ModelRankingEntry[];
}
