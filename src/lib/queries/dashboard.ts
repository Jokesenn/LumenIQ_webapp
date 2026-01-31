import { createClient } from "@/lib/supabase/server";

const PLAN_LIMITS: Record<string, number> = {
  standard: 50,
  ml: 150,
  premium: 300,
};

// Stats générales du dashboard
export async function getDashboardStats(userId: string) {
  const supabase = await createClient();

  // Nombre total de séries analysées (tous jobs)
  const { count: totalSeries } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Nombre de forecasts ce mois
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: forecastsThisMonth } = await supabase
    .schema("lumeniq")
    .from("forecast_jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("created_at", startOfMonth.toISOString());

  // WAPE moyen global
  const { data: wapeData } = await supabase
    .schema("lumeniq")
    .from("job_summaries")
    .select("global_wape")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  const avgWape =
    wapeData?.length
      ? (wapeData.reduce((sum, d) => sum + (Number(d.global_wape) || 0), 0) / wapeData.length) * 100
      : 0;

  // Temps moyen de traitement
  const { data: durationData } = await supabase
    .schema("lumeniq")
    .from("job_summaries")
    .select("duration_sec")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  const avgDuration =
    durationData?.length
      ? durationData.reduce((sum, d) => sum + (d.duration_sec || 0), 0) / durationData.length
      : 0;

  // Quota utilisateur (depuis profiles)
  const { data: profile } = await supabase
    .schema("lumeniq")
    .from("profiles")
    .select("plan, series_used_this_period")
    .eq("id", userId)
    .single();

  // Jours jusqu'à la fin du mois (reset quota)
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysUntilReset = Math.max(0, Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    totalSeries: totalSeries || 0,
    forecastsThisMonth: forecastsThisMonth || 0,
    avgWape,
    avgDuration,
    daysUntilReset,
    quota: {
      used: profile?.series_used_this_period ?? 0,
      limit: PLAN_LIMITS[profile?.plan ?? "standard"] ?? 100,
      plan: profile?.plan ?? "standard",
    },
  };
}

// Performance des modèles
export interface ModelPerformanceItem {
  model: string;
  count: number;
  percentage: number;
  avgWape?: number;
}

export async function getModelPerformance(userId: string): Promise<ModelPerformanceItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("champion_model, wape")
    .eq("user_id", userId);

  if (!data?.length) return [];

  // Agréger par modèle
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
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8); // Top 8 modèles
}

// Distribution ABC/XYZ
export interface AbcXyzCell {
  abc: "A" | "B" | "C";
  xyz: "X" | "Y" | "Z";
  count: number;
  percentage: number;
}

export async function getAbcXyzDistribution(
  userId: string,
  jobId?: string
): Promise<AbcXyzCell[]> {
  const supabase = await createClient();

  let query = supabase
    .schema("lumeniq")
    .from("forecast_results")
    .select("abc_class, xyz_class")
    .eq("user_id", userId);

  if (jobId) {
    query = query.eq("job_id", jobId);
  }

  const { data } = await query;

  if (!data?.length) return [];

  // Compter par cellule
  const cells: Record<string, number> = {};
  const total = data.length;

  data.forEach((row) => {
    const key = `${row.abc_class}-${row.xyz_class}`;
    cells[key] = (cells[key] || 0) + 1;
  });

  // Formater pour la matrice
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

// Données pour le graphique Forecast vs Actuals agrégé
export interface ChartDataPoint {
  date: string;
  actual?: number;
  forecast?: number;
  forecastLower?: number;
  forecastUpper?: number;
}

export async function getAggregatedChartData(
  userId: string,
  jobId?: string
): Promise<ChartDataPoint[]> {
  const supabase = await createClient();

  let query = supabase
    .schema("lumeniq")
    .from("job_monthly_aggregates")
    .select("ds, actual_sum, forecast_sum, forecast_lower_sum, forecast_upper_sum, is_forecast")
    .eq("user_id", userId)
    .order("ds", { ascending: true });

  if (jobId) {
    query = query.eq("job_id", jobId);
  } else {
    // Prendre le dernier job
    const { data: lastJob } = await supabase
      .schema("lumeniq")
      .from("forecast_jobs")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (lastJob) {
      query = query.eq("job_id", lastJob.id);
    }
  }

  const { data } = await query;

  if (!data?.length) return [];

  return data.map((row) => ({
    date: new Date(row.ds).toLocaleDateString("fr-FR", {
      month: "short",
      year: "2-digit",
    }),
    actual: row.is_forecast ? undefined : row.actual_sum,
    forecast: row.is_forecast ? row.forecast_sum : undefined,
    forecastLower: row.is_forecast ? row.forecast_lower_sum : undefined,
    forecastUpper: row.is_forecast ? row.forecast_upper_sum : undefined,
  }));
}

// Recent forecasts avec plus de détails
export interface RecentForecastItem {
  id: string;
  filename: string | null;
  status: string;
  createdAt: string | null;
  completedAt: string | null;
  seriesCount: number;
  wape?: number;
  smape?: number;
  duration?: number;
}

export async function getRecentForecasts(
  userId: string,
  limit = 5
): Promise<RecentForecastItem[]> {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .schema("lumeniq")
    .from("forecast_jobs")
    .select(`
      id,
      filename,
      status,
      created_at,
      completed_at,
      series_count
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!jobs?.length) return [];

  // Enrichir avec les summaries
  const jobIds = jobs.map((j) => j.id);
  const { data: summaries } = await supabase
    .schema("lumeniq")
    .from("job_summaries")
    .select("job_id, global_wape, global_smape, duration_sec")
    .in("job_id", jobIds);

  const summaryMap = new Map(summaries?.map((s) => [s.job_id, s]));

  return jobs.map((job) => {
    const summary = summaryMap.get(job.id);
    return {
      id: job.id,
      filename: job.filename,
      status: job.status,
      createdAt: job.created_at,
      completedAt: job.completed_at,
      seriesCount: job.series_count || 0,
      wape: summary?.global_wape != null ? Number(summary.global_wape) * 100 : undefined,
      smape: summary?.global_smape != null ? Number(summary.global_smape) * 100 : undefined,
      duration: summary?.duration_sec,
    };
  });
}

// Historique complet des jobs pour la page /dashboard/history
export interface HistoryJob {
  id: string;
  filename: string | null;
  status: string;
  createdAt: string | null;
  completedAt: string | null;
  seriesCount: number;
  wape: number | null;
  smape: number | null;
  duration: number | null;
  topModel: string | null;
}

export async function getJobHistory(userId: string): Promise<HistoryJob[]> {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .schema("lumeniq")
    .from("forecast_jobs")
    .select(`
      id,
      filename,
      status,
      created_at,
      completed_at,
      series_count,
      avg_wape,
      avg_smape,
      compute_time_seconds,
      top_champion_model
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!jobs?.length) return [];

  return jobs.map((job) => ({
    id: job.id,
    filename: job.filename,
    status: job.status ?? "pending",
    createdAt: job.created_at,
    completedAt: job.completed_at,
    seriesCount: job.series_count || 0,
    wape: job.avg_wape != null ? Number(job.avg_wape) * 100 : null,
    smape: job.avg_smape != null ? Number(job.avg_smape) * 100 : null,
    duration: job.compute_time_seconds != null ? Number(job.compute_time_seconds) : null,
    topModel: job.top_champion_model,
  }));
}
