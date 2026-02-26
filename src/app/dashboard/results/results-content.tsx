"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import { getResultsDownloadUrl } from "./actions";
import { Button } from "@/components/ui/button";
import {
  MetricGaugeCard,
  AnimatedAreaChart,
  AbcXyzMatrix,
} from "@/components/charts";
import { ReliabilityTab } from "@/components/dashboard/reliability-tab";
import { SeriesList, SynthesisCard, SeriesSortDropdown } from "@/components/dashboard";
import { SeriesFiltersDropdown, DEFAULT_FILTERS } from "@/components/dashboard/series-filters-dropdown";
import type { SeriesFilters, SeriesFilterCounts } from "@/components/dashboard/series-filters-dropdown";
import { ActiveFiltersBar } from "@/components/dashboard/active-filters-bar";
import { AlertsSummaryCard } from "@/components/dashboard/AlertsSummaryCard";
import { RESULTS_TAB_EVENT } from "@/components/dashboard/command-palette";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";
import { useSeriesNavigation } from "@/hooks/useSeriesNavigation";
import { getSeriesAlerts } from "@/lib/series-alerts";
import { ResultsTour } from "@/components/onboarding";
import { useOnboarding } from "@/hooks/useOnboarding";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { useThresholds } from "@/lib/thresholds/context";
import { PortfolioView, assignCluster } from "@/components/dashboard/portfolio-view";
import type { ClusterId } from "@/components/dashboard/portfolio-view";
import { formatFrequencyLabel } from "@/lib/date-format";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffSec < 60) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHour < 24) return `il y a ${diffHour}h`;
  if (diffDay < 7) return `il y a ${diffDay}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

type TabType = "overview" | "series" | "portfolio" | "reliability" | "synthesis";

interface ResultsContentProps {
  job: any;
  summary: any;
  metrics: any;
  topPerformers: any[];
  bottomPerformers: any[];
  allSeries: any[];
  chartData: any[];
  abcXyzData: any[];
  modelPerformance: any[];
  synthesis: any;
  initialTab?: TabType;
}

export function ResultsContent({
  job,
  summary,
  metrics,
  topPerformers,
  bottomPerformers,
  allSeries,
  chartData,
  abcXyzData,
  modelPerformance,
  synthesis,
  initialTab,
}: ResultsContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab ?? "overview");
  const [selectedCell, setSelectedCell] = useState<{ abc: string; xyz: string } | null>(null);
  const [modelFilter, setModelFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<SeriesFilters>(DEFAULT_FILTERS);
  const [exporting, setExporting] = useState(false);
  const { showTour, completeTour } = useOnboarding();
  const { thresholds } = useThresholds();
  const [granularity, setGranularity] = useState<"monthly" | "source">("monthly");
  const [sourceChartData, setSourceChartData] = useState<any[] | null>(null);
  const [loadingSource, setLoadingSource] = useState(false);
  const isAggregated = (job as any)?.aggregation_applied === true;

  useEffect(() => {
    if (granularity !== "source" || !isAggregated || sourceChartData) return;

    setLoadingSource(true);
    const fetchDetailData = async () => {
      const supabase = createBrowserClient();
      const frequency = (job as any)?.frequency;

      const [forecastsRes, actualsRes] = await Promise.all([
        supabase
          .schema("lumeniq")
          .from("forecast_results_detail")
          .select("ds, yhat, yhat_lower, yhat_upper")
          .eq("job_id", job?.id)
          .eq("user_id", job?.user_id)
          .order("ds", { ascending: true }),
        supabase
          .schema("lumeniq")
          .from("series_actuals")
          .select("ds, y")
          .eq("job_id", job?.id)
          .eq("user_id", job?.user_id)
          .order("ds", { ascending: true }),
      ]);

      const { formatDateByFrequency } = await import("@/lib/date-format");

      // Aggregate actuals by date
      const actualMap = new Map<string, number>();
      for (const a of actualsRes.data || []) {
        const key = new Date(a.ds).toISOString().split("T")[0];
        actualMap.set(key, (actualMap.get(key) ?? 0) + Number(a.y ?? 0));
      }

      // Aggregate forecasts by date
      const forecastMap = new Map<string, { sum: number; lower: number; upper: number }>();
      for (const f of forecastsRes.data || []) {
        const key = new Date(f.ds).toISOString().split("T")[0];
        const prev = forecastMap.get(key) ?? { sum: 0, lower: 0, upper: 0 };
        forecastMap.set(key, {
          sum: prev.sum + Number(f.yhat),
          lower: prev.lower + Number(f.yhat_lower ?? f.yhat),
          upper: prev.upper + Number(f.yhat_upper ?? f.yhat),
        });
      }

      const allDates = new Set([...actualMap.keys(), ...forecastMap.keys()]);
      const sorted = Array.from(allDates).sort();

      const data = sorted.map((dateKey) => {
        const hasActual = actualMap.has(dateKey);
        const hasForecast = forecastMap.has(dateKey);
        const fc = forecastMap.get(dateKey);
        return {
          date: formatDateByFrequency(dateKey, frequency),
          actual: hasActual ? actualMap.get(dateKey) : undefined,
          forecast: hasForecast ? fc!.sum : undefined,
          forecastLower: hasForecast ? fc!.lower : undefined,
          forecastUpper: hasForecast ? fc!.upper : undefined,
        };
      });

      // Bridge gap
      const lastActualIdx = data.findLastIndex((d) => d.actual !== undefined);
      const firstForecastOnlyIdx = data.findIndex(
        (d) => d.forecast !== undefined && d.actual === undefined,
      );
      if (
        lastActualIdx >= 0 &&
        firstForecastOnlyIdx > lastActualIdx &&
        data[lastActualIdx].forecast === undefined
      ) {
        const actualVal = data[lastActualIdx].actual as number;
        data[lastActualIdx] = {
          ...data[lastActualIdx],
          forecast: actualVal,
          forecastLower: actualVal,
          forecastUpper: actualVal,
        };
      }

      setSourceChartData(data);
    };

    fetchDetailData().catch(() => setSourceChartData([])).finally(() => setLoadingSource(false));
  }, [granularity, isAggregated, sourceChartData, job?.id, job?.user_id]);

  const handleDownload = useCallback(async () => {
    if (!job?.id || exporting) return;
    setExporting(true);
    try {
      const url = await getResultsDownloadUrl(job.id);
      if (url) {
        window.open(url, "_blank");
      }
    } finally {
      setExporting(false);
    }
  }, [job?.id, exporting]);

  // Compute filter counts from allSeries
  const wapeThresholds = useMemo(() => ({
    attention: thresholds.wape.yellow_max,
    watch: thresholds.wape.green_max,
  }), [thresholds]);

  const filterCounts = useMemo<SeriesFilterCounts>(() => {
    const counts: SeriesFilterCounts = {
      attention: 0,
      modelChanged: 0,
      abc: { A: 0, B: 0, C: 0 },
      xyz: { X: 0, Y: 0, Z: 0 },
    };
    for (const s of allSeries) {
      const alerts = getSeriesAlerts({
        wape: s.wape,
        was_gated: s.was_gated,
        drift_detected: s.drift_detected,
        is_first_run: s.is_first_run,
        previous_champion: s.previous_champion,
        champion_model: s.champion_model,
      }, { wapeThresholds });
      if (alerts.includes("attention")) counts.attention++;
      if (alerts.includes("model-changed")) counts.modelChanged++;
      if (s.abc_class) counts.abc[s.abc_class] = (counts.abc[s.abc_class] ?? 0) + 1;
      if (s.xyz_class) counts.xyz[s.xyz_class] = (counts.xyz[s.xyz_class] ?? 0) + 1;
    }
    return counts;
  }, [allSeries, wapeThresholds]);

  // Sync tab when navigating from another page via URL (?tab=...)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Listen for command palette tab-switch events (same-page, no server round-trip)
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent<string>).detail;
      const valid: TabType[] = ["overview", "series", "portfolio", "reliability", "synthesis"];
      if (valid.includes(tab as TabType)) {
        setActiveTab(tab as TabType);
      }
    };
    window.addEventListener(RESULTS_TAB_EVENT, handler);
    return () => window.removeEventListener(RESULTS_TAB_EVENT, handler);
  }, []);

  const seriesNav = useSeriesNavigation({
    allSeries,
    jobId: job?.id ?? "",
  });

  const reliableSeriesPct = useMemo(() => {
    const scored = allSeries.filter((s: any) => s.champion_score != null);
    if (scored.length === 0) return null;
    const reliable = scored.filter((s: any) => s.champion_score >= thresholds.reliability_score.yellow_max);
    return Math.round((reliable.length / scored.length) * 100);
  }, [allSeries, thresholds]);

  const handleModelClick = (modelName: string) => {
    setModelFilter(modelName);
    setSelectedCell(null);
    setActiveTab("series");
  };

  const handleClusterNavigate = (clusterId: ClusterId) => {
    setFilters({ ...DEFAULT_FILTERS, cluster: clusterId });
    setSelectedCell(null);
    setModelFilter(null);
    setActiveTab("series");
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "portfolio", label: "Portfolio" },
    { id: "series", label: "Séries" },
    { id: "synthesis", label: "Synthèse IA" },
    { id: "reliability", label: "Fiabilité" },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/history">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="dash-page-title">{job?.filename ?? "—"}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {job?.created_at
                    ? formatDistanceToNow(new Date(job.created_at))
                    : "—"}
                </span>
                {summary?.duration_sec != null && summary.duration_sec > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(summary.duration_sec)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {metrics?.n_series_total ?? 0} séries
                </span>
                {isAggregated && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                    Données {formatFrequencyLabel((job as any)?.frequency).toLowerCase()} → agrégées en mensuel
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            className="bg-indigo-500 hover:bg-indigo-600"
            onClick={handleDownload}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {exporting ? "Téléchargement…" : "Télécharger"}
          </Button>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1}>
        <div className="dash-tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "dash-tab-active"
                  : "dash-tab-inactive"
              }
              {...(tab.id === "synthesis" ? { "data-onboarding": "synthesis-tab" } : {})}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Tab Content - toujours le même arbre de composants pour éviter "Rendered more hooks" */}
      <div className={cn(activeTab !== "overview" && "hidden")}>
        <div className="space-y-6">
          {/* Metric Gauges */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
              <div data-onboarding="champion-score-gauge">
                <MetricGaugeCard
                  label="Score de fiabilité"
                  value={metrics?.championScore ?? 0}
                  unit="/100"
                  description="Qualité globale de vos prévisions"
                  thresholds={{ good: thresholds.reliability_score.yellow_max, warning: thresholds.reliability_score.green_max }}
                  inverted={false}
                  delay={0}
                  helpKey="championScore"
                />
              </div>
              {metrics?.global_mase != null && (
                <MetricGaugeCard
                  label="Indice prédictif"
                  value={metrics.global_mase * 100}
                  unit="/100"
                  description="< 100 = meilleur que la référence naïve"
                  thresholds={{ good: thresholds.mase.green_max, warning: thresholds.mase.yellow_max }}
                  inverted={true}
                  delay={0.1}
                  helpKey="mase"
                />
              )}
              <div data-onboarding="bias-gauge">
                <MetricGaugeCard
                  label="Biais prévision"
                  value={Math.abs(metrics?.global_bias_pct ?? 0)}
                  unit="%"
                  description={(metrics?.global_bias_pct ?? 0) >= 0 ? "Sur-estimation" : "Sous-estimation"}
                  thresholds={{ good: thresholds.bias.green_max, warning: thresholds.bias.yellow_max }}
                  delay={0.3}
                  helpKey="bias"
                />
              </div>
              <div className="dash-card p-4 sm:p-6">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    {metrics?.n_series_success ?? 0}
                    <span className="text-lg text-zinc-500">/{metrics?.n_series_total ?? 0}</span>
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <p className="text-sm text-zinc-400">Séries analysées avec succès</p>
                    <HelpTooltip termKey="series_count" />
                  </div>
                  {(metrics?.n_series_failed ?? 0) > 0 && (
                    <p className="text-xs text-red-400 mt-1">
                      {metrics.n_series_failed} échecs
                    </p>
                  )}
                </div>
              </div>
              {reliableSeriesPct != null && (
                <MetricGaugeCard
                  label="Séries fiables"
                  value={reliableSeriesPct}
                  unit="%"
                  description={`Séries avec un score ≥ ${thresholds.reliability_score.yellow_max}/100`}
                  thresholds={{ good: thresholds.reliability_score.yellow_max, warning: thresholds.reliability_score.green_max }}
                  inverted={false}
                  delay={0.5}
                  helpKey="reliable_series"
                />
              )}
            </div>
          </FadeIn>

          {/* Main Chart */}
          <FadeIn delay={0.3}>
            <div className="dash-card p-6">
              <div className="flex items-center gap-1.5 mb-6">
                <h2 className="dash-section-title">
                  Prévisions vs Ventes réelles (total)
                </h2>
                <HelpTooltip termKey="forecast_graph" />
              </div>
              {isAggregated && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-flex rounded-lg bg-zinc-800/50 p-0.5">
                    <button
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                        granularity === "monthly"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "text-zinc-400 hover:text-zinc-300"
                      )}
                      onClick={() => setGranularity("monthly")}
                    >
                      Mensuel
                    </button>
                    <button
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                        granularity === "source"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "text-zinc-400 hover:text-zinc-300"
                      )}
                      onClick={() => setGranularity("source")}
                    >
                      {formatFrequencyLabel((job as any)?.frequency)}
                    </button>
                  </div>
                </div>
              )}
              {(granularity === "source" && loadingSource) ? (
                <div className="h-[350px] flex items-center justify-center text-zinc-500">
                  Chargement des données...
                </div>
              ) : (granularity === "source" && sourceChartData && sourceChartData.length > 0) ? (
                <AnimatedAreaChart data={sourceChartData} height={350} showConfidence />
              ) : (
                <>
                  <div className={cn(chartData.length === 0 && "hidden")}>
                    <AnimatedAreaChart data={chartData.length > 0 ? chartData : [{ date: "", actual: 0 }]} height={350} showConfidence />
                  </div>
                  <div className={cn("h-[350px] flex items-center justify-center text-zinc-500", chartData.length > 0 && "hidden")}>
                    Aucune donnée disponible
                  </div>
                </>
              )}
            </div>
          </FadeIn>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top/Bottom Performers */}
            <FadeIn delay={0.4} className="lg:col-span-2">
              <div className="dash-card p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SeriesList
                    series={topPerformers}
                    jobId={job?.id ?? ""}
                    variant="top"
                    title="Meilleures séries"
                    helpKey="top_performers"
                    emptyMessage="Aucune donnée"
                  />
                  <SeriesList
                    series={bottomPerformers}
                    jobId={job?.id ?? ""}
                    variant="bottom"
                    title="À surveiller"
                    helpKey="to_watch"
                    emptyMessage="Aucune donnée"
                  />
                </div>
              </div>
            </FadeIn>

            {/* Alerts Summary */}
            <FadeIn delay={0.45}>
              <div data-onboarding="alerts-panel">
                <AlertsSummaryCard
                  seriesList={allSeries.map((s: any) => ({
                    wape: s.wape,
                    was_gated: s.was_gated,
                    drift_detected: s.drift_detected,
                    is_first_run: s.is_first_run,
                    previous_champion: s.previous_champion,
                    champion_model: s.champion_model,
                  }))}
                  onFilterAlerts={() => setActiveTab("series")}
                />
              </div>
            </FadeIn>
          </div>

          {/* ABC/XYZ Matrix */}
          <FadeIn delay={0.5}>
            <div className="dash-card p-6" data-onboarding="abc-xyz-matrix">
              <div className="flex items-center gap-1.5 mb-6">
                <h2 className="dash-section-title">
                  Classification ABC/XYZ
                </h2>
                <HelpTooltip termKey="abcxyz_matrix" />
              </div>
              <AbcXyzMatrix
                data={abcXyzData}
                selectedCell={selectedCell}
                onCellClick={(abc, xyz) => {
                  setSelectedCell({ abc, xyz });
                  setModelFilter(null);
                  setActiveTab("series");
                }}
              />
            </div>
          </FadeIn>
        </div>
      </div>

      <div className={cn(activeTab !== "series" && "hidden")}>
        <FadeIn>
          <div className="dash-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="dash-section-title">Toutes les séries</h2>
              <div className="flex items-center gap-2">
                <SeriesFiltersDropdown
                  filters={filters}
                  onFiltersChange={setFilters}
                  counts={filterCounts}
                />
                <SeriesSortDropdown
                  value={seriesNav.sortOption}
                  onChange={seriesNav.setSortOption}
                />
              </div>
            </div>
            <ActiveFiltersBar
              filters={filters}
              onFiltersChange={setFilters}
              selectedCell={selectedCell}
              onClearCell={() => setSelectedCell(null)}
              modelFilter={modelFilter}
              onClearModel={() => setModelFilter(null)}
            />
            <SeriesList
              series={seriesNav.sortedSeries.filter((s) => {
                // Existing filters (matrix cell, model click)
                if (selectedCell && (s.abc_class !== selectedCell.abc || s.xyz_class !== selectedCell.xyz)) return false;
                if (modelFilter && s.champion_model !== modelFilter) return false;

                // Dropdown filters — OR within category, AND between categories
                const statusChecks: boolean[] = [];
                if (filters.attention) {
                  statusChecks.push((s.wape ?? 0) > thresholds.wape.yellow_max);
                }
                if (filters.modelChanged) {
                  const changed = !s.is_first_run && !!s.previous_champion && s.previous_champion !== s.champion_model;
                  statusChecks.push(changed);
                }
                if (statusChecks.length > 0 && !statusChecks.some(Boolean)) return false;

                if (filters.abcClasses.length > 0 && !filters.abcClasses.includes(s.abc_class as "A" | "B" | "C")) return false;
                if (filters.xyzClasses.length > 0 && !filters.xyzClasses.includes(s.xyz_class as "X" | "Y" | "Z")) return false;

                // Cluster filter (from portfolio CTA)
                if (filters.cluster) {
                  const seriesCluster = assignCluster(s);
                  if (seriesCluster !== filters.cluster) return false;
                }

                return true;
              })}
              jobId={job?.id ?? ""}
              variant="default"
            />
          </div>
        </FadeIn>
      </div>

      <div className={cn(activeTab !== "portfolio" && "hidden")}>
        <FadeIn>
          <PortfolioView allSeries={allSeries} jobId={job?.id ?? ""} onClusterNavigate={handleClusterNavigate} />
        </FadeIn>
      </div>

      <div className={cn(activeTab !== "reliability" && "hidden")}>
        <ReliabilityTab allSeries={allSeries} onModelClick={handleModelClick} />
      </div>

      <div className={cn(activeTab !== "synthesis" && "hidden")}>
        <FadeIn>
          <SynthesisCard
            synthesis={synthesis}
            jobId={job?.id}
            skuList={allSeries.map((s: any) => s.series_id as string)}
          />
        </FadeIn>
      </div>

      <ResultsTour enabled={showTour} onComplete={completeTour} />
    </div>
  );
}
