import { createClient } from "@/lib/supabase/server";
import { toChampionScore } from "@/lib/metrics";
import { resolveGlobalErrorRatio } from "@/lib/chart-utils";
import type { ForecastAction } from "@/types/actions";

const PLAN_LIMITS: Record<string, number> = {
  standard: 50,
  ml: 150,
  premium: 300,
};

// Stats générales du dashboard (cockpit de décision)
export async function getDashboardStats(userId: string) {
  const supabase = await createClient();

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

  // Champion Score moyen global (basé sur WAPE, fallback SMAPE) — derniers 10 runs
  const { data: scoreData } = await supabase
    .schema("lumeniq")
    .from("job_summaries")
    .select("global_wape, global_smape")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  const avgChampionScore =
    scoreData?.length
      ? scoreData.reduce((sum, d) => {
          const cs = toChampionScore(resolveGlobalErrorRatio(d));
          return sum + (cs ?? 0);
        }, 0) / scoreData.length
      : 0;

  // Scores individuels pour calcul de tendance (dernier run vs avant-dernier)
  const latestScore = scoreData?.[0] ? toChampionScore(resolveGlobalErrorRatio(scoreData[0])) : null;
  const previousScore = scoreData?.[1] ? toChampionScore(resolveGlobalErrorRatio(scoreData[1])) : null;

  // Dernière prévision complétée
  const { data: lastJob } = await supabase
    .schema("lumeniq")
    .from("forecast_jobs")
    .select("created_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Profil utilisateur (quota + nom)
  const { data: profile } = await supabase
    .schema("lumeniq")
    .from("profiles")
    .select("plan, series_used_this_period, full_name, email")
    .eq("id", userId)
    .single();

  const userName = profile?.full_name?.split(" ")[0]
    ?? profile?.email?.split("@")[0]
    ?? "";

  // Jours jusqu'à la fin du mois (reset quota)
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysUntilReset = Math.max(0, Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    userName,
    forecastsThisMonth: forecastsThisMonth || 0,
    avgChampionScore,
    latestScore,
    previousScore,
    lastForecastAt: lastJob?.created_at ?? null,
    daysUntilReset,
    quota: {
      used: profile?.series_used_this_period ?? 0,
      limit: PLAN_LIMITS[profile?.plan ?? "standard"] ?? 100,
      plan: profile?.plan ?? "standard",
    },
  };
}

// Données de tendance pour le sparkline (10 derniers runs)
export interface TrendDataPoint {
  jobId: string;
  score: number;
  date: string | null;
  seriesCount: number;
}

export async function getTrendData(userId: string): Promise<TrendDataPoint[]> {
  const supabase = await createClient();

  // Fetch les 10 plus récents (desc), puis on inverse pour l'affichage chronologique
  const { data } = await supabase
    .schema("lumeniq")
    .from("job_summaries")
    .select("job_id, global_wape, global_smape, created_at, n_series_total")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  return (data ?? []).reverse().map((d) => {
    return {
      jobId: d.job_id,
      score: toChampionScore(resolveGlobalErrorRatio(d)) ?? 0,
      date: d.created_at,
      seriesCount: d.n_series_total ?? 0,
    };
  });
}

// Actions urgentes pour le dashboard
export interface UrgentActionsData {
  counts: { urgent: number; warning: number; info: number };
  total: number;
  topActions: ForecastAction[];
}

export async function getUrgentActions(userId: string): Promise<UrgentActionsData> {
  const supabase = await createClient();

  // Compteur par priorité (actions actives uniquement)
  const { data: allActive } = await supabase
    .schema("lumeniq")
    .from("forecast_actions")
    .select("priority")
    .eq("client_id", userId)
    .eq("status", "active");

  const counts = { urgent: 0, warning: 0, info: 0 };
  (allActive ?? []).forEach((a) => {
    const p = a.priority as keyof typeof counts;
    if (p in counts) counts[p]++;
  });

  // Top 5 actions urgentes/warning
  const { data: topActions } = await supabase
    .schema("lumeniq")
    .from("forecast_actions")
    .select("*")
    .eq("client_id", userId)
    .eq("status", "active")
    .in("priority", ["urgent", "warning"])
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    counts,
    total: (allActive ?? []).length,
    topActions: (topActions ?? []) as ForecastAction[],
  };
}

// Dernières prévisions enrichies (score + actions)
export interface RecentForecastItem {
  id: string;
  filename: string | null;
  status: string;
  createdAt: string | null;
  seriesCount: number;
  score: number | null;
  duration: number | null;
  actions: { urgent: number; warning: number; total: number };
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
      series_count
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!jobs?.length) return [];

  const jobIds = jobs.map((j) => j.id);

  // Enrichir avec les summaries
  const { data: summaries } = await supabase
    .schema("lumeniq")
    .from("job_summaries")
    .select("job_id, global_wape, global_smape, duration_sec")
    .in("job_id", jobIds);

  const summaryMap = new Map(summaries?.map((s) => [s.job_id, s]));

  // Compter les actions par job
  const { data: actionsByJob } = await supabase
    .schema("lumeniq")
    .from("forecast_actions")
    .select("job_id, priority")
    .eq("client_id", userId)
    .eq("status", "active")
    .in("job_id", jobIds);

  const actionCounts: Record<string, { urgent: number; warning: number; total: number }> = {};
  (actionsByJob ?? []).forEach((a) => {
    if (!actionCounts[a.job_id]) actionCounts[a.job_id] = { urgent: 0, warning: 0, total: 0 };
    actionCounts[a.job_id].total++;
    if (a.priority === "urgent") actionCounts[a.job_id].urgent++;
    if (a.priority === "warning") actionCounts[a.job_id].warning++;
  });

  return jobs.map((job) => {
    const summary = summaryMap.get(job.id);
    const ratio = summary ? resolveGlobalErrorRatio(summary) : null;

    return {
      id: job.id,
      filename: job.filename,
      status: job.status ?? "pending",
      createdAt: job.created_at,
      seriesCount: job.series_count || 0,
      score: toChampionScore(ratio),
      duration: summary?.duration_sec ?? null,
      actions: actionCounts[job.id] ?? { urgent: 0, warning: 0, total: 0 },
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
  championScore: number | null;
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

  // Enrichir avec job_summaries pour fallback global_wape quand avg_smape est null
  const jobIds = jobs.map((j) => j.id);
  const { data: summaries } = await supabase
    .schema("lumeniq")
    .from("job_summaries")
    .select("job_id, global_smape, global_wape")
    .in("job_id", jobIds);

  const summaryMap = new Map(summaries?.map((s) => [s.job_id, s]));

  return jobs.map((job) => {
    const summary = summaryMap.get(job.id);
    // Priority: job-level avg → summary-level global (wape → smape fallback)
    const ratio = resolveGlobalErrorRatio({
      global_wape: job.avg_wape ?? summary?.global_wape,
      global_smape: job.avg_smape ?? summary?.global_smape,
    });

    return {
      id: job.id,
      filename: job.filename,
      status: job.status ?? "pending",
      createdAt: job.created_at,
      completedAt: job.completed_at,
      seriesCount: job.series_count || 0,
      championScore: toChampionScore(ratio),
      smape: ratio != null ? ratio * 100 : null,
      duration: job.compute_time_seconds != null ? Number(job.compute_time_seconds) : null,
      topModel: job.top_champion_model,
    };
  });
}
