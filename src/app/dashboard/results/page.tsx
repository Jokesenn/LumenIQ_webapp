"use client";

import { useState, useEffect, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Brain, Check, Loader2, AlertCircle, ArrowRight, ChevronRight } from "lucide-react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-supabase";
import { useJobStatus, getJobStatusLabel, getJobStatusColor } from "@/hooks/useJobStatus";
import {
  getJobFullData,
  getRecentJobs,
  type AbcDistribution,
  type ModelPerformance,
  type AbcXyzMatrix,
  type AggregatedChartData,
} from "@/lib/queries/results";
import type { ForecastJob, JobSummary } from "@/types/database";

const tabs = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "charts", label: "Graphiques" },
  { id: "classification", label: "Classification" },
  { id: "synthesis", label: "Synthèse IA" },
];

// Couleurs pour les classes ABC
const ABC_COLORS = {
  A: "#4F5BD5",
  B: "#6370E8",
  C: "#8B94E8",
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const jobIdFromUrl = searchParams.get("job");

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobIdFromUrl);
  const [recentJobs, setRecentJobs] = useState<ForecastJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Données du job sélectionné
  const [jobData, setJobData] = useState<{
    job: ForecastJob | null;
    summary: JobSummary | null;
    abcDistribution: AbcDistribution[];
    modelPerformance: ModelPerformance[];
    abcXyzMatrix: AbcXyzMatrix[];
    chartData: AggregatedChartData[];
  } | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const { user } = useUser();

  // Hook pour poller le statut si le job est en cours
  const { job: polledJob, isComplete, isFailed, isProcessing } = useJobStatus(
    selectedJobId,
    5000,
    selectedJobId !== null && jobData?.job?.status !== "completed"
  );

  // Charger les jobs récents
  useEffect(() => {
    const fetchRecentJobs = async () => {
      if (!user) return;

      setLoadingJobs(true);
      const supabase = createClient();
      const jobs = await getRecentJobs(supabase, user.id, 10);
      setRecentJobs(jobs);
      setLoadingJobs(false);

      // Si pas de job sélectionné et des jobs existent, sélectionner le premier complété
      if (!selectedJobId && jobs.length > 0) {
        const completedJob = jobs.find((j) => j.status === "completed");
        if (completedJob) {
          setSelectedJobId(completedJob.id);
        } else {
          setSelectedJobId(jobs[0].id);
        }
      }
    };

    fetchRecentJobs();
  }, [user, selectedJobId]);

  // Charger les données du job sélectionné
  useEffect(() => {
    const fetchJobData = async () => {
      if (!selectedJobId) return;

      setLoadingData(true);
      const supabase = createClient();
      const data = await getJobFullData(supabase, selectedJobId);
      setJobData({
        job: data.job,
        summary: data.summary,
        abcDistribution: data.abcDistribution,
        modelPerformance: data.modelPerformance,
        abcXyzMatrix: data.abcXyzMatrix,
        chartData: data.chartData,
      });
      setLoadingData(false);
    };

    fetchJobData();
  }, [selectedJobId]);

  // Mettre à jour les données quand le job pollé change
  useEffect(() => {
    if (polledJob && jobData) {
      setJobData((prev) => (prev ? { ...prev, job: polledJob } : null));
    }
  }, [polledJob]);

  // Recharger les données quand le job est complété
  useEffect(() => {
    if (isComplete && selectedJobId) {
      const fetchJobData = async () => {
        const supabase = createClient();
        const data = await getJobFullData(supabase, selectedJobId);
        setJobData({
          job: data.job,
          summary: data.summary,
          abcDistribution: data.abcDistribution,
          modelPerformance: data.modelPerformance,
          abcXyzMatrix: data.abcXyzMatrix,
          chartData: data.chartData,
        });
      };
      fetchJobData();
    }
  }, [isComplete, selectedJobId]);

  const currentJob = jobData?.job || polledJob;
  const summary = jobData?.summary;
  const isJobComplete = currentJob?.status === "completed";
  const isJobFailed = currentJob?.status === "failed" || currentJob?.status === "cancelled";
  const isJobProcessing =
    currentJob?.status === "processing" ||
    currentJob?.status === "queued" ||
    currentJob?.status === "pending";

  // Formater la date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Extraire le modèle le plus fréquent depuis winner_models
  const getTopModelFromWinners = (winners: Record<string, number> | null): string => {
    if (!winners) return "";
    const entries = Object.entries(winners);
    if (entries.length === 0) return "";
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  };

  // Formater la répartition des catégories
  const getCategoryBreakdown = (categories: Record<string, number> | null): string => {
    if (!categories) return "—";
    const ml = categories.ml ?? 0;
    const stat = categories.statistical ?? 0;
    const found = categories.foundation ?? 0;
    const total = ml + stat + found;
    if (total === 0) return "—";
    return `${stat}S / ${ml}ML / ${found}F`;
  };

  // Si pas de job sélectionné et chargement en cours
  if (loadingJobs && !selectedJobId) {
    return (
      <div className="animate-fade">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
        </div>
      </div>
    );
  }

  // Si pas de jobs du tout
  if (!loadingJobs && recentJobs.length === 0 && !selectedJobId) {
    return (
      <div className="animate-fade">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-2">Résultats forecast</h1>
          <p className="text-[var(--text-secondary)]">
            Visualisez et analysez vos forecasts
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-6">
            <Brain size={36} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Aucun forecast</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Lancez votre premier forecast pour voir les résultats ici.
          </p>
          <Link href="/dashboard/forecast">
            <Button>
              Nouveau forecast
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold mb-2">Résultats forecast</h1>
          {currentJob && (
            <p className="text-[var(--text-secondary)]">
              {currentJob.filename} • {currentJob.series_count ?? 0} séries •{" "}
              {formatDate(currentJob.created_at ?? null)}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {/* Sélecteur de job */}
          {recentJobs.length > 1 && (
            <select
              value={selectedJobId || ""}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm"
            >
              {recentJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.filename} ({formatDate(job.created_at ?? null)})
                </option>
              ))}
            </select>
          )}
          <Button disabled={!isJobComplete}>
            <Download size={18} />
            Télécharger ZIP
          </Button>
        </div>
      </div>

      {/* Job en cours de traitement */}
      {isJobProcessing && currentJob && (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Loader2 size={24} className="text-[var(--accent)] animate-spin" />
            <div>
              <h3 className="font-semibold">Traitement en cours...</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {getJobStatusLabel(currentJob.status)}
                {currentJob.current_step && ` • ${currentJob.current_step}`}
              </p>
            </div>
          </div>
          <div className="bg-[var(--bg-surface)] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
              style={{ width: `${currentJob.progress ?? 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-[var(--text-muted)]">
            <span>
              {currentJob.series_processed ?? 0}/{currentJob.series_count ?? 0} séries
            </span>
            <span>{currentJob.progress ?? 0}%</span>
          </div>
        </div>
      )}

      {/* Job échoué */}
      {isJobFailed && currentJob && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-500">Erreur de traitement</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {currentJob.error_message || "Une erreur est survenue lors du traitement."}
              </p>
              <Link href="/dashboard/forecast" className="inline-block mt-4">
                <Button variant="secondary">
                  Relancer un forecast
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tabs - visible seulement si job complété */}
      {isJobComplete && (
        <>
          <div className="flex gap-1 mb-6 bg-[var(--bg-secondary)] p-1 rounded-lg w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loadingData && (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
            </div>
          )}

          {/* Overview Tab */}
          {!loadingData && activeTab === "overview" && (
            <>
              {/* Key Metrics - utilise summary en priorité, fallback sur currentJob */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <MetricCard
                  label="WAPE"
                  value={
                    summary?.global_wape != null
                      ? `${(Number(summary.global_wape) * 100).toFixed(1)}%`
                      : currentJob?.avg_wape != null
                      ? `${Number(currentJob.avg_wape).toFixed(1)}%`
                      : "—"
                  }
                  description="Weighted Absolute Percentage Error"
                  status={
                    summary?.global_wape != null
                      ? Number(summary.global_wape) < 0.10
                        ? "excellent"
                        : Number(summary.global_wape) < 0.15
                        ? "good"
                        : "poor"
                      : currentJob?.avg_wape != null
                      ? Number(currentJob.avg_wape) < 10
                        ? "excellent"
                        : Number(currentJob.avg_wape) < 15
                        ? "good"
                        : "poor"
                      : "neutral"
                  }
                />
                <MetricCard
                  label="Biais"
                  value={
                    summary?.global_bias_pct != null
                      ? `${Number(summary.global_bias_pct).toFixed(1)}%`
                      : "—"
                  }
                  description="Biais moyen des prévisions"
                  status={
                    summary?.global_bias_pct != null
                      ? Math.abs(Number(summary.global_bias_pct)) < 5
                        ? "excellent"
                        : Math.abs(Number(summary.global_bias_pct)) < 10
                        ? "good"
                        : "poor"
                      : "neutral"
                  }
                />
                <MetricCard
                  label="Séries"
                  value={
                    summary?.n_series_total != null
                      ? `${summary.n_series_success}/${summary.n_series_total}`
                      : currentJob?.series_count != null
                      ? String(currentJob.series_count)
                      : "—"
                  }
                  description={
                    summary?.n_series_failed && summary.n_series_failed > 0
                      ? `${summary.n_series_failed} échec(s)`
                      : "Séries traitées avec succès"
                  }
                  status={
                    summary?.n_series_failed && summary.n_series_failed > 0
                      ? "poor"
                      : summary?.n_series_total
                      ? "good"
                      : "neutral"
                  }
                />
                <MetricCard
                  label="Durée"
                  value={
                    summary?.duration_sec != null
                      ? `${Math.round(Number(summary.duration_sec))}s`
                      : currentJob?.compute_time_seconds
                      ? `${Math.round(currentJob.compute_time_seconds)}s`
                      : "—"
                  }
                  description="Temps de calcul total"
                  status={summary?.duration_sec || currentJob?.compute_time_seconds ? "good" : "neutral"}
                />
              </div>

              {/* Secondary Metrics Row */}
              {summary && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  <MetricCard
                    label="IC Largeur"
                    value={
                      summary.avg_interval_width_pct != null
                        ? `${Number(summary.avg_interval_width_pct).toFixed(0)}%`
                        : "—"
                    }
                    description="Largeur moyenne intervalle de confiance"
                    status={
                      summary.avg_interval_width_pct != null
                        ? Number(summary.avg_interval_width_pct) < 50
                          ? "excellent"
                          : Number(summary.avg_interval_width_pct) < 100
                          ? "good"
                          : "poor"
                        : "neutral"
                    }
                  />
                  <MetricCard
                    label="Alertes"
                    value={`${summary.alerts_high ?? 0}`}
                    description={`${summary.alerts_medium ?? 0} medium, ${summary.alerts_low ?? 0} low`}
                    status={
                      (summary.alerts_high ?? 0) > 0
                        ? "poor"
                        : (summary.alerts_medium ?? 0) > 0
                        ? "good"
                        : "excellent"
                    }
                  />
                  <MetricCard
                    label="Top Modèle"
                    value={summary.top_model || getTopModelFromWinners(summary.winner_models) || "—"}
                    description="Modèle champion le plus fréquent"
                    status="good"
                  />
                  <MetricCard
                    label="Catégories"
                    value={getCategoryBreakdown(summary.winner_categories)}
                    description="Répartition ML / Statistical / Foundation"
                    status="good"
                  />
                </div>
              )}

              {/* Main Chart */}
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6 mb-6">
                <h3 className="text-base font-semibold mb-5">
                  Forecast agrégé (somme toutes séries)
                </h3>
                {jobData?.chartData && jobData.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={jobData.chartData}>
                      <defs>
                        <linearGradient id="colorForecastArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="date"
                        stroke="var(--text-muted)"
                        fontSize={11}
                        tickLine={false}
                        interval={Math.max(0, Math.floor((jobData.chartData.length - 1) / 8))}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        stroke="var(--text-muted)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => 
                          value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="none"
                        fill="var(--chart-ic-sup)"
                        fillOpacity={0.22}
                        name="IC sup"
                        connectNulls={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="none"
                        fill="var(--chart-ic-inf)"
                        fillOpacity={0.22}
                        name="IC inf"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--text-secondary)"
                        strokeWidth={2}
                        dot={false}
                        name="Historique"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="var(--accent)"
                        strokeWidth={3}
                        dot={false}
                        name="Forecast"
                        connectNulls={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[350px] text-[var(--text-muted)]">
                    <p>Aucune donnée de graphique disponible</p>
                  </div>
                )}
              </div>

              {/* Model Champions */}
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
                <h3 className="text-base font-semibold mb-5">Modèles champions par série</h3>
                {jobData?.modelPerformance && jobData.modelPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={jobData.modelPerformance.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="model" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} name="count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)] mb-2">
                      Données de modèles non disponibles
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Les statistiques par modèle seront disponibles une fois le traitement des résultats terminé.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Classification Tab */}
          {!loadingData && activeTab === "classification" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
                <h3 className="text-base font-semibold mb-5">Classification ABC</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-5">
                  Distribution des produits par contribution au chiffre d&apos;affaires
                </p>
                {jobData?.abcDistribution && jobData.abcDistribution.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={jobData.abcDistribution.map((d) => ({
                          name: d.class,
                          value: d.percentage,
                          count: d.count,
                        }))}
                        layout="vertical"
                      >
                        <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          stroke="var(--text-muted)"
                          fontSize={12}
                          width={30}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--bg-surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {jobData.abcDistribution.map((entry) => (
                            <Cell key={`cell-${entry.class}`} fill={ABC_COLORS[entry.class]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {jobData.abcDistribution.map((item) => (
                        <div key={item.class} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: ABC_COLORS[item.class] }}
                          />
                          <span className="text-sm">
                            Classe {item.class} : {item.count} séries ({item.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)] mb-2">
                      Classification ABC non disponible
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      La classification sera générée lors du prochain traitement complet.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
                <h3 className="text-base font-semibold mb-5">Matrice ABC/XYZ</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-5">
                  Croisement valeur × volatilité pour allocation compute
                </p>
                {jobData?.abcXyzMatrix && jobData.abcXyzMatrix.some(m => m.count > 0) ? (
                  <>
                    <div className="grid grid-cols-4 gap-1">
                      <div />
                      {["X", "Y", "Z"].map((col) => (
                        <div key={col} className="text-center p-2 font-semibold text-sm">
                          {col}
                        </div>
                      ))}
                      {(["A", "B", "C"] as const).map((row) => (
                        <Fragment key={row}>
                          <div className="p-2 font-semibold text-sm flex items-center">{row}</div>
                          {(["X", "Y", "Z"] as const).map((col) => {
                            const cell = jobData.abcXyzMatrix.find(
                              (m) => m.abcClass === row && m.xyzClass === col
                            );
                            const value = cell?.count ?? 0;
                            const intensity =
                              row === "A"
                                ? col === "X"
                                  ? 1
                                  : col === "Y"
                                  ? 0.7
                                  : 0.4
                                : row === "B"
                                ? col === "X"
                                  ? 0.6
                                  : col === "Y"
                                  ? 0.4
                                  : 0.2
                                : col === "X"
                                ? 0.3
                                : col === "Y"
                                ? 0.2
                                : 0.1;
                            return (
                              <div
                                key={`${row}-${col}`}
                                className="rounded-md p-4 text-center text-sm font-semibold"
                                style={{
                                  backgroundColor: `rgba(79, 91, 213, ${intensity})`,
                                }}
                              >
                                {value}
                              </div>
                            );
                          })}
                        </Fragment>
                      ))}
                    </div>
                    <div className="mt-5 p-3 bg-[var(--bg-surface)] rounded-lg">
                      <p className="text-xs text-[var(--text-secondary)]">
                        <strong className="text-[var(--text-primary)]">AX/AY :</strong> Modèles
                        sophistiqués (AutoARIMA, ETS) •
                        <strong className="text-[var(--text-primary)]"> CZ :</strong> Modèles
                        rapides (Naive, SMA)
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)] mb-2">
                      Matrice ABC/XYZ non disponible
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Le croisement ABC/XYZ sera calculé lors du prochain traitement complet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Synthesis Tab */}
          {!loadingData && activeTab === "synthesis" && (
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
                  <Brain size={20} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Synthèse IA</h3>
                  <p className="text-xs text-[var(--text-muted)]">Générée par Claude AI</p>
                </div>
              </div>

              <div className="p-6 bg-[var(--bg-surface)] rounded-xl border-l-4 border-[var(--accent)] leading-relaxed space-y-4">
                <p>
                  <strong>Vue d&apos;ensemble :</strong> L&apos;analyse de vos{" "}
                  {currentJob?.series_count ?? 0} séries de données révèle une précision de
                  prévision{" "}
                  {currentJob?.avg_smape !== null && currentJob?.avg_smape !== undefined
                    ? currentJob.avg_smape < 10
                      ? "excellente"
                      : currentJob.avg_smape < 15
                      ? "bonne"
                      : "à améliorer"
                    : "—"}{" "}
                  (SMAPE{" "}
                  {currentJob?.avg_smape !== null && currentJob?.avg_smape !== undefined
                    ? `${currentJob.avg_smape.toFixed(1)}%`
                    : "—"}
                  ).
                  {currentJob?.top_champion_model && (
                    <> Le modèle {currentJob.top_champion_model} s&apos;est imposé comme champion
                    sur la majorité des séries.</>
                  )}
                </p>
                <p>
                  <strong>Insights clés :</strong> Les résultats montrent une distribution des
                  modèles champions variée, indiquant que différentes séries ont des
                  caractéristiques distinctes. Le routing ABC/XYZ a permis d&apos;optimiser
                  l&apos;allocation du budget compute.
                </p>
                <p>
                  <strong>Recommandations :</strong> Consultez la classification ABC/XYZ pour
                  identifier les produits stratégiques nécessitant une attention particulière.
                  Les séries de classe A méritent un suivi plus fréquent des prévisions.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="secondary">Copier le texte</Button>
                <Button variant="secondary">Exporter en PDF</Button>
              </div>
            </div>
          )}

          {/* Charts Tab */}
          {!loadingData && activeTab === "charts" && (
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
              <p className="text-[var(--text-secondary)] text-center py-16">
                Sélectionnez une série dans la liste pour afficher son graphique détaillé
              </p>
            </div>
          )}
        </>
      )}

      {/* Si pas de contenu à afficher et job non complété */}
      {!isJobComplete && !isJobProcessing && !isJobFailed && !loadingData && (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-16 text-center">
          <p className="text-[var(--text-muted)]">Sélectionnez un forecast pour voir les résultats</p>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  status: "excellent" | "good" | "poor" | "neutral";
}

function MetricCard({ label, value, description, status }: MetricCardProps) {
  const statusColors = {
    excellent: "text-[var(--success)]",
    good: "text-[var(--accent)]",
    poor: "text-[var(--danger)]",
    neutral: "text-[var(--text-muted)]",
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-5">
      <p className="text-xs text-[var(--text-muted)] mb-2">{label}</p>
      <p className={`text-[32px] font-bold mb-2 ${statusColors[status]}`}>{value}</p>
      <p className="text-[11px] text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
