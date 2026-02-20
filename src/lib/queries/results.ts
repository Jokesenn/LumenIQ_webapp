import { createClient } from "@/lib/supabase/server";
import { ForecastJob, JobSummary } from "@/types/database";
import { toChampionScore, resolveSeriesErrorRatio } from "@/lib/metrics";
import type { ForecastAction } from "@/types/actions";

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
    .select("global_wape, global_smape, global_mase, global_bias_pct, n_series_total, n_series_success, n_series_failed")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .single();

  if (!data) return null;

  return {
    ...data,
    global_wape: data.global_wape != null ? Number(data.global_wape) * 100 : null,
    global_smape: data.global_smape != null ? Number(data.global_smape) * 100 : null,
    global_mase: data.global_mase != null ? Number(data.global_mase) : null,
    global_bias_pct: data.global_bias_pct != null ? Number(data.global_bias_pct) : null,
    championScore: toChampionScore(
      data.global_wape != null ? Number(data.global_wape)
        : data.global_smape != null ? Number(data.global_smape)
        : null
    ),
  };
}

// Enrichissement sparkline — utilise les échantillons pré-calculés par le backend
// dans forecast_series (history_sample / forecast_sample en JSONB)
async function enrichWithSparklines(
  supabase: Awaited<ReturnType<typeof createClient>>,
  jobId: string,
  userId: string,
  rows: Record<string, unknown>[],
) {
  if (rows.length === 0) return;
  const ids = rows.map((r) => r.series_id as string);

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_series")
    .select("series_id, history_sample, forecast_sample")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .in("series_id", ids);

  if (!data) return;

  const sampleMap = new Map(
    data.map((r) => [r.series_id as string, r])
  );

  for (const row of rows) {
    const sample = sampleMap.get(row.series_id as string);
    row.history_sample = (sample?.history_sample as number[] | null) ?? null;
    row.forecast_sample = (sample?.forecast_sample as number[] | null) ?? null;
  }
}

// Top et bottom performers (séries)
export async function getTopBottomSeries(jobId: string, userId: string, limit = 5) {
  const supabase = await createClient();

  // Récupérer toutes les séries avec au moins une métrique d'erreur disponible
  const { data: allRows } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("series_id, wape, smape, champion_score, champion_model, abc_class, xyz_class, alerts, was_gated, drift_detected, is_first_run, previous_champion, cv")
    .eq("job_id", jobId)
    .eq("user_id", userId);

  // Convertir en % et calculer le champion_score avec fallback
  const scored = (allRows || [])
    .map((r) => ({
      ...r,
      wape: r.wape != null ? Number(r.wape) * 100 : r.wape,
      smape: r.smape != null ? Number(r.smape) * 100 : r.smape,
      champion_score: toChampionScore(resolveSeriesErrorRatio(r)),
    }))
    .filter((r) => r.champion_score != null)
    .sort((a, b) => (b.champion_score ?? 0) - (a.champion_score ?? 0));

  const top = scored.slice(0, limit);
  const bottom = scored.slice(-limit).reverse();

  // Enrichissement sparkline — échoue silencieusement si colonnes absentes
  await enrichWithSparklines(supabase, jobId, userId, [...top, ...bottom] as Record<string, unknown>[]);

  return { top, bottom };
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

  // Find the boundary between actuals and forecast
  const firstForecastIdx = data.findIndex((r) => r.is_forecast);
  const lastActualIdx = firstForecastIdx > 0 ? firstForecastIdx - 1 : -1;

  return data.map((row, idx) => {
    const isBridge = idx === lastActualIdx && firstForecastIdx < data.length;
    const firstForecast = isBridge ? data[firstForecastIdx] : null;

    return {
      date: new Date(row.ds).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      actual: !row.is_forecast ? row.actual_sum : undefined,
      // Bridge: the last actual row also carries forecast values so the lines connect
      forecast: row.is_forecast
        ? row.forecast_sum
        : isBridge && firstForecast
          ? row.actual_sum
          : undefined,
      forecastLower: row.is_forecast
        ? row.forecast_lower_sum
        : isBridge && firstForecast
          ? row.actual_sum
          : undefined,
      forecastUpper: row.is_forecast
        ? row.forecast_upper_sum
        : isBridge && firstForecast
          ? row.actual_sum
          : undefined,
    };
  });
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
    .select("champion_model, champion_score, smape, wape")
    .eq("job_id", jobId)
    .eq("user_id", userId);

  if (!data?.length) return [];

  const modelStats: Record<string, { count: number; totalChampionScore: number }> = {};

  data.forEach((row) => {
    const model = row.champion_model || "Unknown";
    if (!modelStats[model]) {
      modelStats[model] = { count: 0, totalChampionScore: 0 };
    }
    modelStats[model].count++;
    modelStats[model].totalChampionScore += toChampionScore(resolveSeriesErrorRatio(row)) ?? 0;
  });

  const total = data.length;

  return Object.entries(modelStats)
    .map(([model, stats]) => ({
      model,
      count: stats.count,
      percentage: (stats.count / total) * 100,
      avgChampionScore: stats.totalChampionScore / stats.count,
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
    .select("series_id, abc_class, xyz_class, wape, smape, champion_score, champion_model, behavior_tags, alerts, was_gated, drift_detected, is_first_run, previous_champion, cv, forecast_sum, forecast_avg")
    .eq("job_id", jobId)
    .eq("user_id", userId);

  if (filters?.abc) {
    query = query.eq("abc_class", filters.abc);
  }
  if (filters?.xyz) {
    query = query.eq("xyz_class", filters.xyz);
  }

  const { data } = await query.order("series_id", { ascending: true });

  const rows = (data || []).map((r) => ({
    ...r,
    wape: r.wape != null ? Number(r.wape) * 100 : r.wape,
    smape: r.smape != null ? Number(r.smape) * 100 : r.smape,
    champion_score: toChampionScore(resolveSeriesErrorRatio(r)),
    forecast_sum: r.forecast_sum != null ? Number(r.forecast_sum) : null,
    forecast_avg: r.forecast_avg != null ? Number(r.forecast_avg) : null,
  }));

  // Enrichissement sparkline — échoue silencieusement si colonnes absentes
  await enrichWithSparklines(supabase, jobId, userId, rows as Record<string, unknown>[]);

  return rows;
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
    champion_score: toChampionScore(resolveSeriesErrorRatio(data)),
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
      actual: Number(a.y),
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
      forecast: Number(f.yhat),
      forecastLower: f.yhat_lower != null ? Number(f.yhat_lower) : undefined,
      forecastUpper: f.yhat_upper != null ? Number(f.yhat_upper) : undefined,
    });
  });

  const sorted = Array.from(dataMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  // Bridge the gap between actuals and forecast so the lines connect visually.
  // Find the last point that has an actual value and the first point that has
  // only a forecast value, then copy the forecast value onto that last-actual
  // point so Recharts draws a continuous transition.
  const lastActualIdx = sorted.findLastIndex((d) => d.actual !== undefined);
  const firstForecastOnlyIdx = sorted.findIndex(
    (d) => d.forecast !== undefined && d.actual === undefined,
  );
  if (
    lastActualIdx >= 0 &&
    firstForecastOnlyIdx > lastActualIdx &&
    sorted[lastActualIdx].forecast === undefined
  ) {
    const actualVal = sorted[lastActualIdx].actual as number;
    sorted[lastActualIdx] = {
      ...sorted[lastActualIdx],
      forecast: actualVal,
      forecastLower: actualVal,
      forecastUpper: actualVal,
    };
  }

  return sorted;
}

// Comparaison des modèles pour une série (challengers)
export async function getSeriesModelComparison(jobId: string, seriesId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("champion_model, champion_score, smape, wape, challengers, models_tested")
    .eq("job_id", jobId)
    .eq("series_id", seriesId)
    .eq("user_id", userId)
    .single();

  if (!data) return null;

  // challengers peut être :
  //  - un dict {model_name: score}  (nouveau format)
  //  - une liste [{name, score, status}, ...]  (ancien format candidates_topk)
  //  - une string JSON de l'un des deux
  let challengers: Record<string, number> = {};
  if (data.challengers != null) {
    let raw: unknown = data.challengers;
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { raw = null; }
    }
    if (Array.isArray(raw)) {
      // Ancien format : liste d'objets [{name, score, status}, ...]
      for (const c of raw) {
        const entry = c as Record<string, unknown>;
        if (typeof entry.name === "string" && entry.score != null) {
          challengers[entry.name] = Number(entry.score);
        }
      }
    } else if (raw != null && typeof raw === "object") {
      // Nouveau format : dict {model_name: score}
      challengers = (raw as Record<string, number>) || {};
    }
  }

  const championScoreValue = toChampionScore(resolveSeriesErrorRatio(data)) ?? 0;
  const championName = data.champion_model ?? "—";
  const sortedChallengers = Object.entries(challengers)
    .filter(([model]) => model !== championName)
    .map(([model, score]) => ({ model, score: toChampionScore(Number(score)) ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const modelRanking = [
    { model: championName, score: championScoreValue, rank: 1 },
    ...sortedChallengers.map((c, i) => ({ ...c, rank: i + 2 })),
  ];

  return {
    champion: data.champion_model,
    championScore: championScoreValue,
    modelsTested: data.models_tested != null ? Number(data.models_tested) : 0,
    ranking: modelRanking,
  };
}

// Actions spécifiques à une série (depuis forecast_actions)
export async function getSeriesActions(jobId: string, seriesId: string, userId: string): Promise<ForecastAction[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_actions")
    .select("*")
    .eq("job_id", jobId)
    .eq("series_id", seriesId)
    .eq("status", "active")
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  return (data || []) as ForecastAction[];
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
    avgSmape: r.avgChampionScore ?? 0,
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
