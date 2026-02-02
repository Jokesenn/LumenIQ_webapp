import { createClient } from "@/lib/supabase/server";
import { ForecastJob, JobSummary } from "@/types/database";

// Récupérer un job par ID avec son summary
export async function getJobWithSummary(jobId: string, userId: string) {
  const supabase = await createClient();

  const [jobResult, summaryResult] = await Promise.all([
    supabase
      .schema("lumeniq")
      .from("forecast_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", userId)
      .single(),
    supabase
      .schema("lumeniq")
      .from("job_summaries")
      .select("*")
      .eq("job_id", jobId)
      .eq("user_id", userId)
      .single(),
  ]);

  return {
    job: jobResult.data,
    summary: summaryResult.data,
  };
}

// Métriques par jauge (WAPE, SMAPE, MAPE, BIAS)
// Note : les valeurs en DB sont en ratio (0-1), le frontend attend des % (0-100)
export async function getJobMetrics(jobId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("job_summaries")
    .select("global_wape, global_smape, global_mape, global_bias_pct, n_series_total, n_series_success, n_series_failed")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .single();

  if (!data) return null;

  return {
    ...data,
    global_wape: data.global_wape != null ? Number(data.global_wape) * 100 : null,
    global_smape: data.global_smape != null ? Number(data.global_smape) * 100 : null,
    global_mape: data.global_mape != null ? Number(data.global_mape) * 100 : null,
    global_bias_pct: data.global_bias_pct != null ? Number(data.global_bias_pct) : data.global_bias_pct,
  };
}

// Top et bottom performers (séries)
export async function getTopBottomSeries(jobId: string, userId: string, limit = 5) {
  const supabase = await createClient();

  const [topResult, bottomResult] = await Promise.all([
    supabase
      .schema("lumeniq")
      .from("forecast_results")
      .select("series_id, wape, smape, champion_model, abc_class, xyz_class, was_gated, drift_detected, is_first_run, previous_champion, cv")
      .eq("job_id", jobId)
      .eq("user_id", userId)
      .not("wape", "is", null)
      .order("wape", { ascending: true })
      .limit(limit),
    supabase
      .schema("lumeniq")
      .from("forecast_results")
      .select("series_id, wape, smape, champion_model, abc_class, xyz_class, alerts, was_gated, drift_detected, is_first_run, previous_champion, cv")
      .eq("job_id", jobId)
      .eq("user_id", userId)
      .not("wape", "is", null)
      .order("wape", { ascending: false })
      .limit(limit),
  ]);

  const toPercent = (rows: typeof topResult.data) =>
    (rows || []).map((r) => ({
      ...r,
      wape: r.wape != null ? Number(r.wape) * 100 : r.wape,
      smape: r.smape != null ? Number(r.smape) * 100 : r.smape,
    }));

  return {
    top: toPercent(topResult.data),
    bottom: toPercent(bottomResult.data),
  };
}

// Données graphique agrégé pour un job
export async function getJobChartData(jobId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("job_monthly_aggregates")
    .select("ds, actual_sum, forecast_sum, forecast_lower_sum, forecast_upper_sum, is_forecast")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .order("ds", { ascending: true });

  if (!data?.length) return [];

  return data.map((row) => ({
    date: new Date(row.ds).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
    actual: !row.is_forecast ? row.actual_sum : undefined,
    forecast: row.is_forecast ? row.forecast_sum : undefined,
    forecastLower: row.is_forecast ? row.forecast_lower_sum : undefined,
    forecastUpper: row.is_forecast ? row.forecast_upper_sum : undefined,
  }));
}

// Distribution ABC/XYZ pour un job spécifique
export async function getJobAbcXyzMatrix(jobId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("abc_class, xyz_class")
    .eq("job_id", jobId)
    .eq("user_id", userId);

  if (!data?.length) return [];

  const cells: Record<string, number> = {};
  const total = data.length;

  data.forEach((row) => {
    const key = `${row.abc_class}-${row.xyz_class}`;
    cells[key] = (cells[key] || 0) + 1;
  });

  const abcValues: ("A" | "B" | "C")[] = ["A", "B", "C"];
  const xyzValues: ("X" | "Y" | "Z")[] = ["X", "Y", "Z"];

  return abcValues.flatMap((abc) =>
    xyzValues.map((xyz) => ({
      abc,
      xyz,
      count: cells[`${abc}-${xyz}`] || 0,
      percentage: ((cells[`${abc}-${xyz}`] || 0) / total) * 100,
    }))
  );
}

// Performance modèles pour un job
export async function getJobModelPerformance(jobId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("champion_model, wape")
    .eq("job_id", jobId)
    .eq("user_id", userId);

  if (!data?.length) return [];

  const modelStats: Record<string, { count: number; totalWape: number }> = {};

  data.forEach((row) => {
    const model = row.champion_model || "Unknown";
    if (!modelStats[model]) {
      modelStats[model] = { count: 0, totalWape: 0 };
    }
    modelStats[model].count++;
    modelStats[model].totalWape += Number(row.wape || 0) * 100;
  });

  const total = data.length;

  return Object.entries(modelStats)
    .map(([model, stats]) => ({
      model,
      count: stats.count,
      percentage: (stats.count / total) * 100,
      avgWape: stats.totalWape / stats.count,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

// Synthèse IA pour un job
export async function getJobSynthesis(jobId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_syntheses")
    .select("type, title, content, created_at")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data || [];
}

// Liste toutes les séries d'un job (pour filtrage)
export async function getJobSeriesList(
  jobId: string,
  userId: string,
  filters?: { abc?: string; xyz?: string }
) {
  const supabase = await createClient();

  let query = supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("series_id, abc_class, xyz_class, wape, smape, champion_model, behavior_tags, alerts, was_gated, drift_detected, is_first_run, previous_champion, cv")
    .eq("job_id", jobId)
    .eq("user_id", userId);

  if (filters?.abc) {
    query = query.eq("abc_class", filters.abc);
  }
  if (filters?.xyz) {
    query = query.eq("xyz_class", filters.xyz);
  }

  const { data } = await query.order("wape", { ascending: true });

  return (data || []).map((r) => ({
    ...r,
    wape: r.wape != null ? Number(r.wape) * 100 : r.wape,
    smape: r.smape != null ? Number(r.smape) * 100 : r.smape,
  }));
}

// ========== QUERIES POUR VUE SÉRIE ==========

// Détails d'une série spécifique
// Note : wape/smape sont en ratio (0-1) en DB, convertis en % (0-100) pour le frontend
export async function getSeriesDetails(jobId: string, seriesId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("*")
    .eq("job_id", jobId)
    .eq("series_id", seriesId)
    .eq("user_id", userId)
    .single();

  if (!data) return null;

  return {
    ...data,
    wape: data.wape != null ? Number(data.wape) * 100 : data.wape,
    smape: data.smape != null ? Number(data.smape) * 100 : data.smape,
    cv_coefficient: data.cv_coefficient != null ? Number(data.cv_coefficient) : null,
    cv: data.cv != null ? Number(data.cv) : null,
    champion_score: data.champion_score != null ? Number(data.champion_score) : null,
    forecast_sum: data.forecast_sum != null ? Number(data.forecast_sum) : null,
  };
}

// Données de forecast mensuelles pour une série
export async function getSeriesForecastData(jobId: string, seriesId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_results_months")
    .select("ds, yhat, yhat_lower, yhat_upper, model_name")
    .eq("job_id", jobId)
    .eq("series_id", seriesId)
    .eq("user_id", userId)
    .order("ds", { ascending: true });

  return data || [];
}

// Données actuals pour une série
export async function getSeriesActuals(jobId: string, seriesId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("series_actuals")
    .select("ds, y, is_outlier")
    .eq("job_id", jobId)
    .eq("series_id", seriesId)
    .eq("user_id", userId)
    .order("ds", { ascending: true });

  return data || [];
}

// Combine actuals + forecast pour le graphique série
export async function getSeriesChartData(jobId: string, seriesId: string, userId: string) {
  const [actuals, forecasts] = await Promise.all([
    getSeriesActuals(jobId, seriesId, userId),
    getSeriesForecastData(jobId, seriesId, userId),
  ]);

  const dataMap = new Map<string, Record<string, unknown>>();

  actuals.forEach((a) => {
    const dateKey = new Date(a.ds).toISOString().split("T")[0];
    dataMap.set(dateKey, {
      date: new Date(a.ds).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      actual: a.y,
      isOutlier: a.is_outlier,
    });
  });

  forecasts.forEach((f) => {
    const dateKey = new Date(f.ds).toISOString().split("T")[0];
    const existing = dataMap.get(dateKey) || {
      date: new Date(f.ds).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
    };
    dataMap.set(dateKey, {
      ...existing,
      forecast: f.yhat,
      forecastLower: f.yhat_lower,
      forecastUpper: f.yhat_upper,
    });
  });

  return Array.from(dataMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
}

// Comparaison des modèles pour une série (challengers)
export async function getSeriesModelComparison(jobId: string, seriesId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("champion_model, champion_score, challengers, models_tested")
    .eq("job_id", jobId)
    .eq("series_id", seriesId)
    .eq("user_id", userId)
    .single();

  if (!data) return null;

  // challengers peut être un objet JSON ou une string JSON (Supabase)
  let challengers: Record<string, number> = {};
  if (data.challengers != null) {
    if (typeof data.challengers === "string") {
      try {
        challengers = (JSON.parse(data.challengers) as Record<string, number>) || {};
      } catch {
        challengers = {};
      }
    } else if (typeof data.challengers === "object" && !Array.isArray(data.challengers)) {
      challengers = (data.challengers as Record<string, number>) || {};
    }
  }

  const championScore = data.champion_score != null ? Number(data.champion_score) : 0;
  const modelRanking = [
    { model: data.champion_model ?? "—", score: championScore, rank: 1 },
    ...Object.entries(challengers)
      .map(([model, score], i) => ({ model, score: Number(score) || 0, rank: i + 2 }))
      .sort((a, b) => a.score - b.score),
  ];

  return {
    champion: data.champion_model,
    championScore,
    modelsTested: data.models_tested != null ? Number(data.models_tested) : 0,
    ranking: modelRanking.slice(0, 5),
  };
}

// ========== COMPATIBILITÉ PAGE RESULTS ==========

export interface AbcDistribution {
  class: "A" | "B" | "C";
  count: number;
  percentage: number;
}

export interface XyzDistribution {
  class: "X" | "Y" | "Z";
  count: number;
  percentage: number;
}

export interface ModelPerformance {
  model: string;
  count: number;
  avgSmape: number;
}

export interface AbcXyzMatrix {
  abcClass: "A" | "B" | "C";
  xyzClass: "X" | "Y" | "Z";
  count: number;
}

export interface AggregatedChartData {
  ds: string;
  date: string;
  actual: number | null;
  forecast: number | null;
  lower: number | null;
  upper: number | null;
}

// Dernier job terminé (pour affichage par défaut sur /dashboard/results)
export async function getLatestCompletedJob(userId: string): Promise<ForecastJob | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_jobs")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (data as ForecastJob) ?? null;
}

// Derniers jobs (pour la page results)
export async function getRecentJobs(userId: string, limit = 10): Promise<ForecastJob[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("lumeniq")
    .from("forecast_jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as ForecastJob[]) ?? [];
}

// Résultats par série d'un job
export async function getJobResults(jobId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("*")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .order("series_id", { ascending: true });

  if (error) return [];
  return data ?? [];
}

// Toutes les données d'un job (forme attendue par la page results)
export async function getJobFullData(jobId: string, userId: string) {
  const [withSummary, chartRows, matrixRows, modelRows, results] = await Promise.all([
    getJobWithSummary(jobId, userId),
    getJobChartData(jobId, userId),
    getJobAbcXyzMatrix(jobId, userId),
    getJobModelPerformance(jobId, userId),
    getJobResults(jobId, userId),
  ]);

  const job = withSummary.job as ForecastJob | null;
  const summary = withSummary.summary as JobSummary | null;

  // Déduire abcDistribution et xyzDistribution depuis la matrice
  const abcDistribution: AbcDistribution[] = ["A", "B", "C"].map((cls) => {
    const count = matrixRows.filter((r) => r.abc === cls).reduce((s, r) => s + r.count, 0);
    const total = matrixRows.reduce((s, r) => s + r.count, 0);
    return { class: cls as "A" | "B" | "C", count, percentage: total ? Math.round((count / total) * 100) : 0 };
  });
  const xyzDistribution: XyzDistribution[] = ["X", "Y", "Z"].map((cls) => {
    const count = matrixRows.filter((r) => r.xyz === cls).reduce((s, r) => s + r.count, 0);
    const total = matrixRows.reduce((s, r) => s + r.count, 0);
    return { class: cls as "X" | "Y" | "Z", count, percentage: total ? Math.round((count / total) * 100) : 0 };
  });

  const abcXyzMatrix: AbcXyzMatrix[] = matrixRows.map((r) => ({
    abcClass: r.abc,
    xyzClass: r.xyz,
    count: r.count,
  }));

  const modelPerformance: ModelPerformance[] = modelRows.map((r) => ({
    model: r.model,
    count: r.count,
    avgSmape: r.avgWape ?? 0,
  }));

  const chartData: AggregatedChartData[] = chartRows.map((row: { date: string; actual?: number; forecast?: number; forecastLower?: number; forecastUpper?: number }) => {
    const ds = (row as { date: string }).date;
    return {
      ds,
      date: ds,
      actual: row.actual ?? null,
      forecast: row.forecast ?? null,
      lower: row.forecastLower ?? null,
      upper: row.forecastUpper ?? null,
    };
  });

  return {
    job,
    summary,
    abcDistribution,
    xyzDistribution,
    abcXyzMatrix,
    modelPerformance,
    chartData,
    results,
  };
}
