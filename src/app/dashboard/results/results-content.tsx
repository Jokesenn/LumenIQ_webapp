"use client";

import { useState, useReducer, useEffect, useMemo, useCallback } from "react";
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
import { SectionErrorBoundary } from "@/components/ui/section-error-boundary";
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
import type {
  ResultsJob,
  ResultsSummary,
  JobMetrics,
  SeriesRow,
  ResultsChartPoint,
  AbcXyzCell,
  ModelPerformanceRow,
  SynthesisRow,
} from "@/types/results";

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

interface SourceChartDataPoint {
  date: string;
  actual?: number;
  forecast?: number;
  forecastLower?: number;
  forecastUpper?: number;
  [key: string]: unknown;
}

interface ResultsViewState {
  granularity: "monthly" | "source";
  sourceChartData: SourceChartDataPoint[] | null;
  loadingSource: boolean;
  activeTab: TabType;
  selectedCell: { abc: string; xyz: string } | null;
  modelFilter: string | null;
  filters: SeriesFilters;
}

type ResultsViewAction =
  | { type: "SET_GRANULARITY"; payload: "monthly" | "source" }
  | { type: "SET_SOURCE_DATA"; payload: SourceChartDataPoint[] | null }
  | { type: "SET_LOADING_SOURCE"; payload: boolean }
  | { type: "SET_ACTIVE_TAB"; payload: TabType }
  | { type: "SET_SELECTED_CELL"; payload: { abc: string; xyz: string } | null }
  | { type: "SET_MODEL_FILTER"; payload: string | null }
  | { type: "SET_FILTERS"; payload: SeriesFilters }
  | { type: "RESET_SELECTION" };

function resultsViewReducer(state: ResultsViewState, action: ResultsViewAction): ResultsViewState {
  switch (action.type) {
    case "SET_GRANULARITY":
      return {
        ...state,
        granularity: action.payload,
        sourceChartData: null,
        loadingSource: false,
      };
    case "SET_SOURCE_DATA":
      return { ...state, sourceChartData: action.payload };
    case "SET_LOADING_SOURCE":
      return { ...state, loadingSource: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload, selectedCell: null };
    case "SET_SELECTED_CELL":
      return { ...state, selectedCell: action.payload };
    case "SET_MODEL_FILTER":
      return { ...state, modelFilter: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    case "RESET_SELECTION":
      return {
        ...state,
        selectedCell: null,
        modelFilter: null,
      };
    default:
      return state;
  }
}

interface ResultsContentProps {
  job: ResultsJob;
  summary: ResultsSummary | null;
  metrics: JobMetrics | null;
  topPerformers: SeriesRow[];
  bottomPerformers: SeriesRow[];
  allSeries: SeriesRow[];
  chartData: ResultsChartPoint[];
  abcXyzData: AbcXyzCell[];
  modelPerformance: ModelPerformanceRow[];
  synthesis: SynthesisRow | null;
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
  const [exporting, setExporting] = useState(false);
  const { showTour, completeTour } = useOnboarding();
  const { thresholds } = useThresholds();

  const [viewState, dispatch] = useReducer(resultsViewReducer, {
    granularity: "monthly",
    sourceChartData: null,
    loadingSource: false,
    activeTab: (initialTab ?? "overview") as TabType,
    selectedCell: null,
    modelFilter: null,
    filters: DEFAULT_FILTERS,
  });

  const isAggregated = job?.aggregation_applied === true;

  useEffect(() => {
    if (viewState.granularity !== "source" || !isAggregated || viewState.sourceChartData) return;

    dispatch({ type: "SET_LOADING_SOURCE", payload: true });
    const fetchDetailData = async () => {
      const supabase = createBrowserClient();
      const frequency = job?.frequency;

      // Use server-side RPC to aggregate across all series by date.
      // This avoids the Supabase PostgREST 1000-row default limit
      // (e.g. 50 series × 156 weeks = 7800 raw rows → ~215 aggregated rows).
      const { data: rpcData, error } = await supabase
        .schema("lumeniq")
        .rpc("get_job_source_chart_data", {
          p_job_id: job?.id,
          p_user_id: job?.user_id,
        });

      if (error || !rpcData?.length) {
        dispatch({ type: "SET_SOURCE_DATA", payload: [] });
        return;
      }

      const { formatDateByFrequency } = await import("@/lib/date-format");
      const { bridgeChartGap } = await import("@/lib/chart-utils");

      interface RpcChartDataRow {
        ds: string;
        actual_sum?: number;
        forecast_sum?: number;
        forecast_lower_sum?: number;
        forecast_upper_sum?: number;
        is_forecast: boolean;
      }

      const data = (rpcData as RpcChartDataRow[]).map((row: RpcChartDataRow) => ({
        date: formatDateByFrequency(row.ds, frequency),
        actual: !row.is_forecast ? row.actual_sum : undefined,
        forecast: row.is_forecast ? row.forecast_sum : undefined,
        forecastLower: row.is_forecast ? row.forecast_lower_sum : undefined,
        forecastUpper: row.is_forecast ? row.forecast_upper_sum : undefined,
      }));

      bridgeChartGap(data);

      dispatch({ type: "SET_SOURCE_DATA", payload: data });
    };

    fetchDetailData().catch(() => dispatch({ type: "SET_SOURCE_DATA", payload: [] })).finally(() => dispatch({ type: "SET_LOADING_SOURCE", payload: false }));
  }, [viewState.granularity, isAggregated, viewState.sourceChartData, job?.id, job?.user_id]);

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
      dispatch({ type: "SET_ACTIVE_TAB", payload: initialTab });
    }
  }, [initialTab]);

  // Listen for command palette tab-switch events (same-page, no server round-trip)
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent<string>).detail;
      const valid: TabType[] = ["overview", "series", "portfolio", "reliability", "synthesis"];
      if (valid.includes(tab as TabType)) {
        dispatch({ type: "SET_ACTIVE_TAB", payload: tab as TabType });
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
    const scored = allSeries.filter((s) => s.champion_score != null);
    if (scored.length === 0) return null;
    const reliable = scored.filter((s) => (s.champion_score ?? 0) >= thresholds.reliability_score.yellow_max);
    return Math.round((reliable.length / scored.length) * 100);
  }, [allSeries, thresholds]);

  const handleModelClick = (modelName: string) => {
    dispatch({ type: "SET_MODEL_FILTER", payload: modelName });
    dispatch({ type: "SET_SELECTED_CELL", payload: null });
    dispatch({ type: "SET_ACTIVE_TAB", payload: "series" });
  };

  const handleClusterNavigate = (clusterId: ClusterId) => {
    dispatch({ type: "SET_FILTERS", payload: { ...DEFAULT_FILTERS, cluster: clusterId } });
    dispatch({ type: "SET_SELECTED_CELL", payload: null });
    dispatch({ type: "SET_MODEL_FILTER", payload: null });
    dispatch({ type: "SET_ACTIVE_TAB", payload: "series" });
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
                    Données {formatFrequencyLabel(job?.frequency).toLowerCase()} → agrégées en mensuel
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
        <div className="dash-tab-bar" role="tablist" aria-label="Sections des résultats">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={viewState.activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: tab.id })}
              className={
                viewState.activeTab === tab.id
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
      <div role="tabpanel" id="tabpanel-overview" aria-labelledby="tab-overview" className={cn(viewState.activeTab !== "overview" && "hidden")}>
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
                      {metrics!.n_series_failed} échecs
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
            <SectionErrorBoundary
              sectionName="graphique-prévisions"
              fallbackTitle="Le graphique n'a pas pu être affiché"
            >
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
                          viewState.granularity === "monthly"
                            ? "bg-indigo-500/20 text-indigo-400"
                            : "text-zinc-400 hover:text-zinc-300"
                        )}
                        onClick={() => dispatch({ type: "SET_GRANULARITY", payload: "monthly" })}
                      >
                        Mensuel
                      </button>
                      <button
                        className={cn(
                          "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                          viewState.granularity === "source"
                            ? "bg-indigo-500/20 text-indigo-400"
                            : "text-zinc-400 hover:text-zinc-300"
                        )}
                        onClick={() => dispatch({ type: "SET_GRANULARITY", payload: "source" })}
                      >
                        {formatFrequencyLabel(job?.frequency)}
                      </button>
                    </div>
                  </div>
                )}
                {(viewState.granularity === "source" && viewState.loadingSource) ? (
                  <div className="h-[350px] flex items-center justify-center text-zinc-500">
                    Chargement des données...
                  </div>
                ) : (viewState.granularity === "source" && viewState.sourceChartData && viewState.sourceChartData.length > 0) ? (
                  <AnimatedAreaChart data={viewState.sourceChartData} height={350} showConfidence />
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
            </SectionErrorBoundary>
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
                <SectionErrorBoundary
                  sectionName="alertes-résumé"
                  fallbackTitle="Le panneau d'alertes n'a pas pu être chargé"
                >
                  <AlertsSummaryCard
                    seriesList={allSeries.map((s) => ({
                      wape: s.wape,
                      was_gated: s.was_gated,
                      drift_detected: s.drift_detected,
                      is_first_run: s.is_first_run,
                      previous_champion: s.previous_champion,
                      champion_model: s.champion_model,
                    }))}
                    onFilterAlerts={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "series" })}
                  />
                </SectionErrorBoundary>
              </div>
            </FadeIn>
          </div>

          {/* ABC/XYZ Matrix */}
          <FadeIn delay={0.5}>
            <SectionErrorBoundary
              sectionName="matrice-abc-xyz"
              fallbackTitle="La matrice ABC/XYZ n'a pas pu être affichée"
            >
              <div className="dash-card p-6" data-onboarding="abc-xyz-matrix">
                <div className="flex items-center gap-1.5 mb-6">
                  <h2 className="dash-section-title">
                    Classification ABC/XYZ
                  </h2>
                  <HelpTooltip termKey="abcxyz_matrix" />
                </div>
                <AbcXyzMatrix
                  data={abcXyzData}
                  selectedCell={viewState.selectedCell}
                  onCellClick={(abc, xyz) => {
                    dispatch({ type: "SET_SELECTED_CELL", payload: { abc, xyz } });
                    dispatch({ type: "SET_MODEL_FILTER", payload: null });
                    dispatch({ type: "SET_ACTIVE_TAB", payload: "series" });
                  }}
                />
              </div>
            </SectionErrorBoundary>
          </FadeIn>
        </div>
      </div>

      <div role="tabpanel" id="tabpanel-series" aria-labelledby="tab-series" className={cn(viewState.activeTab !== "series" && "hidden")}>
        <FadeIn>
          <SectionErrorBoundary
            sectionName="liste-séries"
            fallbackTitle="La liste des séries n'a pas pu être chargée"
          >
            <div className="dash-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="dash-section-title">Toutes les séries</h2>
                <div className="flex items-center gap-2">
                  <SeriesFiltersDropdown
                    filters={viewState.filters}
                    onFiltersChange={(newFilters) => dispatch({ type: "SET_FILTERS", payload: newFilters })}
                    counts={filterCounts}
                  />
                  <SeriesSortDropdown
                    value={seriesNav.sortOption}
                    onChange={seriesNav.setSortOption}
                  />
                </div>
              </div>
              <ActiveFiltersBar
                filters={viewState.filters}
                onFiltersChange={(newFilters) => dispatch({ type: "SET_FILTERS", payload: newFilters })}
                selectedCell={viewState.selectedCell}
                onClearCell={() => dispatch({ type: "SET_SELECTED_CELL", payload: null })}
                modelFilter={viewState.modelFilter}
                onClearModel={() => dispatch({ type: "SET_MODEL_FILTER", payload: null })}
              />
              <SeriesList
                series={seriesNav.sortedSeries.filter((s) => {
                  // Existing filters (matrix cell, model click)
                  if (viewState.selectedCell && (s.abc_class !== viewState.selectedCell.abc || s.xyz_class !== viewState.selectedCell.xyz)) return false;
                  if (viewState.modelFilter && s.champion_model !== viewState.modelFilter) return false;

                  // Dropdown filters — OR within category, AND between categories
                  const statusChecks: boolean[] = [];
                  if (viewState.filters.attention) {
                    statusChecks.push((s.wape ?? 0) > thresholds.wape.yellow_max);
                  }
                  if (viewState.filters.modelChanged) {
                    const changed = !s.is_first_run && !!s.previous_champion && s.previous_champion !== s.champion_model;
                    statusChecks.push(changed);
                  }
                  if (statusChecks.length > 0 && !statusChecks.some(Boolean)) return false;

                  if (viewState.filters.abcClasses.length > 0 && !viewState.filters.abcClasses.includes(s.abc_class as "A" | "B" | "C")) return false;
                  if (viewState.filters.xyzClasses.length > 0 && !viewState.filters.xyzClasses.includes(s.xyz_class as "X" | "Y" | "Z")) return false;

                  // Cluster filter (from portfolio CTA)
                  if (viewState.filters.cluster) {
                    const seriesCluster = assignCluster(s);
                    if (seriesCluster !== viewState.filters.cluster) return false;
                  }

                  return true;
                })}
                jobId={job?.id ?? ""}
                variant="default"
              />
            </div>
          </SectionErrorBoundary>
        </FadeIn>
      </div>

      <div role="tabpanel" id="tabpanel-portfolio" aria-labelledby="tab-portfolio" className={cn(viewState.activeTab !== "portfolio" && "hidden")}>
        <FadeIn>
          <SectionErrorBoundary
            sectionName="portfolio-vue"
            fallbackTitle="La vue portfolio n'a pas pu être chargée"
          >
            <PortfolioView allSeries={allSeries} jobId={job?.id ?? ""} onClusterNavigate={handleClusterNavigate} />
          </SectionErrorBoundary>
        </FadeIn>
      </div>

      <div role="tabpanel" id="tabpanel-reliability" aria-labelledby="tab-reliability" className={cn(viewState.activeTab !== "reliability" && "hidden")}>
        <SectionErrorBoundary
          sectionName="fiabilité-tab"
          fallbackTitle="L'onglet Fiabilité n'a pas pu être chargé"
        >
          <ReliabilityTab allSeries={allSeries} onModelClick={handleModelClick} />
        </SectionErrorBoundary>
      </div>

      <div role="tabpanel" id="tabpanel-synthesis" aria-labelledby="tab-synthesis" className={cn(viewState.activeTab !== "synthesis" && "hidden")}>
        <FadeIn>
          <SectionErrorBoundary
            sectionName="synthèse-ia"
            fallbackTitle="La synthèse IA n'a pas pu être chargée"
          >
            <SynthesisCard
              synthesis={synthesis}
              jobId={job?.id}
              skuList={allSeries.map((s) => s.series_id)}
            />
          </SectionErrorBoundary>
        </FadeIn>
      </div>

      <ResultsTour enabled={showTour} onComplete={completeTour} />
    </div>
  );
}
