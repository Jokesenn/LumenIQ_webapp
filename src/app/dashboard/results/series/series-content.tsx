"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Award,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
  Trophy,
  Medal,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard, SeriesNavigator } from "@/components/dashboard";
import { AnimatedAreaChart } from "@/components/charts";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { BadgeWithTooltip } from "@/components/ui/badge-with-tooltip";
import { GLOSSARY } from "@/lib/glossary";
import { cn } from "@/lib/utils";
import { getModelMeta, MODEL_FAMILIES, type ModelFamily } from "@/lib/model-labels";
import { useSeriesNavigation } from "@/hooks/useSeriesNavigation";
import { SeriesAlertBadges } from "@/components/dashboard/results/SeriesAlertBadges";
import { ExportPdfButton } from "@/components/dashboard/results/ExportPdfButton";
import type { SeriesListItem } from "@/types/forecast";
import type { ForecastPoint } from "@/types/export";
import type { ForecastAction } from "@/types/actions";
import { ActionCard } from "@/components/dashboard/action-card";
import { getSeriesAlerts, sortAlertsByPriority } from "@/lib/series-alerts";
import { useThresholds } from "@/lib/thresholds/context";
import { AlertBadge } from "@/components/ui/alert-badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { formatFrequencyLabel } from "@/lib/date-format";
import { formatDateByFrequency } from "@/lib/date-format";

const ALERT_GLOSSARY_MAP: Record<string, string | undefined> = {
  attention: "attention",
  watch: "watch",
  drift: "drift",
  "model-changed": "model_changed",
  gated: "gated",
};

interface SeriesContentProps {
  job: any;
  series: any;
  chartData: any[];
  modelComparison: any;
  allSeries: SeriesListItem[];
  forecastPoints?: ForecastPoint[];
  seriesActions?: ForecastAction[];
}

export function SeriesContent({
  job,
  series,
  chartData,
  modelComparison,
  allSeries,
  forecastPoints = [],
  seriesActions = [],
}: SeriesContentProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const seriesNav = useSeriesNavigation({
    allSeries,
    currentSeriesId: series.series_id,
    jobId: job.id,
  });

  // Raccourcis clavier ← / → pour naviguer entre séries
  const { hasPrevious, hasNext, goToPrevious, goToNext } = seriesNav;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si focus dans un input, textarea ou contenteditable
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return;

      if (e.key === "ArrowLeft" && hasPrevious) {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrevious, hasNext, goToPrevious, goToNext]);
  const classColors: Record<string, string> = {
    A: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    B: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    C: "bg-red-500/20 text-red-400 border-red-500/30",
    X: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Y: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Z: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const { thresholds } = useThresholds();
  const [granularity, setGranularity] = useState<"monthly" | "source">("monthly");
  const [sourceChartData, setSourceChartData] = useState<any[] | null>(null);
  const [loadingSource, setLoadingSource] = useState(false);
  const isAggregated = job?.aggregation_applied === true;

  // Reset source chart data when navigating to a different series
  const [prevSeriesId, setPrevSeriesId] = useState(series?.series_id);
  if (series?.series_id !== prevSeriesId) {
    setPrevSeriesId(series?.series_id);
    setSourceChartData(null);
  }

  useEffect(() => {
    if (granularity !== "source" || !isAggregated || sourceChartData) return;

    setLoadingSource(true);
    const fetchDetailData = async () => {
      const supabase = createClient();

      const [actualsRes, forecastsRes] = await Promise.all([
        supabase
          .schema("lumeniq")
          .from("series_actuals")
          .select("ds, y, is_outlier")
          .eq("job_id", job.id)
          .eq("series_id", series.series_id)
          .order("ds", { ascending: true }),
        supabase
          .schema("lumeniq")
          .from("forecast_results_detail")
          .select("ds, yhat, yhat_lower, yhat_upper")
          .eq("job_id", job.id)
          .eq("series_id", series.series_id)
          .order("ds", { ascending: true }),
      ]);

      const actuals = actualsRes.data || [];
      const forecasts = forecastsRes.data || [];

      const dataMap = new Map<string, Record<string, unknown>>();

      actuals.forEach((a: any) => {
        const dateKey = new Date(a.ds).toISOString().split("T")[0];
        dataMap.set(dateKey, {
          date: formatDateByFrequency(a.ds, job.frequency),
          actual: Number(a.y),
          isOutlier: a.is_outlier,
        });
      });

      forecasts.forEach((f: any) => {
        const dateKey = new Date(f.ds).toISOString().split("T")[0];
        const existing = dataMap.get(dateKey) || {
          date: formatDateByFrequency(f.ds, job.frequency),
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

      // Bridge gap
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

      setSourceChartData(sorted);
    };

    fetchDetailData().catch(() => setSourceChartData([])).finally(() => setLoadingSource(false));
  }, [granularity, isAggregated, sourceChartData, job?.id, series?.series_id, job?.frequency]);

  const reliabilityGreen = thresholds.reliability_score.green_max;
  const reliabilityYellow = thresholds.reliability_score.yellow_max;

  const getScoreStatus = (score: number) => {
    if (score >= reliabilityGreen) return { label: "Excellent", color: "text-emerald-400", Icon: CheckCircle2 };
    if (score >= reliabilityYellow) return { label: "Acceptable", color: "text-amber-400", Icon: Info };
    return { label: "À améliorer", color: "text-red-400", Icon: AlertTriangle };
  };

  const championScoreValue = series.champion_score ?? 0;
  const scoreStatus = getScoreStatus(championScoreValue);
  const ScoreIcon = scoreStatus.Icon;

  const wapeThresholds = {
    attention: thresholds.wape.yellow_max,
    watch: thresholds.wape.green_max,
  };

  // Alertes calculées depuis les flags série (zéro requête supplémentaire)
  const computedAlerts = sortAlertsByPriority(
    getSeriesAlerts({
      wape: series.wape,
      was_gated: series.was_gated,
      drift_detected: series.drift_detected,
      is_first_run: series.is_first_run,
      previous_champion: series.previous_champion,
      champion_model: series.champion_model,
    }, { wapeThresholds })
  );

  // Actions riches depuis forecast_actions (état local pour dismiss optimiste)
  const [liveActions, setLiveActions] = useState<ForecastAction[]>(seriesActions);

  // Synchroniser quand on navigue vers une autre série
  useEffect(() => {
    setLiveActions(seriesActions);
  }, [seriesActions]);

  const handleDismissAction = useCallback(async (id: string) => {
    setLiveActions((prev) => prev.filter((a) => a.id !== id));
    const supabase = createClient();
    const { error: updateError } = await supabase
      .schema("lumeniq")
      .from("forecast_actions")
      .update({ status: "dismissed" as const, dismissed_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      toast.error("Erreur lors de la suppression");
      setLiveActions(seriesActions);
      return;
    }
    toast("Action ignorée", { duration: 3000 });
  }, [seriesActions]);

  // Parse behavior_tags si c'est une string JSON
  const behaviorTags =
    typeof series.behavior_tags === "string"
      ? (() => {
          try {
            return JSON.parse(series.behavior_tags || "[]");
          } catch {
            return [];
          }
        })()
      : series.behavior_tags || [];

  const abcClass = series.abc_class ?? "A";
  const xyzClass = series.xyz_class ?? "X";

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/results?job=${job.id}&sort=${seriesNav.sortOption}`}>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="dash-page-title">{series.series_id}</h1>
                <BadgeWithTooltip tooltip={GLOSSARY.abc}>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-lg border text-sm font-medium",
                      classColors[abcClass]
                    )}
                  >
                    {abcClass}
                  </span>
                </BadgeWithTooltip>
                <BadgeWithTooltip tooltip={GLOSSARY.xyz}>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-lg border text-sm font-medium",
                      classColors[xyzClass]
                    )}
                  >
                    {xyzClass}
                  </span>
                </BadgeWithTooltip>
                <SeriesAlertBadges
                  series={{
                    wape: series.wape,
                    was_gated: series.was_gated,
                    drift_detected: series.drift_detected,
                    is_first_run: series.is_first_run,
                    previous_champion: series.previous_champion,
                    champion_model: series.champion_model,
                  }}
                />
              </div>
              <p className="text-sm text-zinc-400 mt-1">Analyse: {job.filename}</p>
            </div>
          </div>

          {/* Navigation inter-séries + Export */}
          <div className="flex items-center gap-3">
            <ExportPdfButton
              series={{
                series_id: series.series_id,
                abc_class: abcClass,
                xyz_class: xyzClass,
                smape: series.smape ?? 0,
                wape: series.wape ?? series.smape ?? 0,
                champion_score: series.champion_score,
                mape: series.mape,
                champion_model: series.champion_model ?? "N/A",
                cv: series.cv ?? series.cv_coefficient,
                horizon: series.forecast_horizon ?? 12,
                total_value: series.forecast_sum,
                was_gated: series.was_gated,
                drift_detected: series.drift_detected,
              }}
              jobName={job.filename}
              forecasts={forecastPoints}
              chartRef={chartRef}
            />
            <SeriesNavigator
              sortedSeries={seriesNav.sortedSeries}
              currentSeriesId={series.series_id}
              sortOption={seriesNav.sortOption}
              onSortChange={seriesNav.setSortOption}
              hasPrevious={seriesNav.hasPrevious}
              hasNext={seriesNav.hasNext}
              previousSeries={seriesNav.previousSeries}
              nextSeries={seriesNav.nextSeries}
              onPrevious={seriesNav.goToPrevious}
              onNext={seriesNav.goToNext}
              onSelectSeries={seriesNav.goToSeries}
              currentIndex={seriesNav.currentIndex}
            />
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerChildren staggerDelay={0.1} className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <StaggerItem>
          <StatCard
            label="Score de fiabilité"
            value={championScoreValue.toFixed(1)}
            icon={TrendingUp}
            subtitle={`/100 · ${getModelMeta(series.champion_model ?? "").label}`}
            variant={championScoreValue >= reliabilityGreen ? "success" : championScoreValue >= reliabilityYellow ? "warning" : "default"}
            helpKey="championScore"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Variabilité"
            value={(series.cv_coefficient ?? 0).toFixed(2)}
            icon={Activity}
            helpKey="cv"
            subtitle={
              (series.cv_coefficient ?? 0) < 0.5
                ? "Stable"
                : (series.cv_coefficient ?? 0) < 1
                  ? "Variable"
                  : "Erratique"
            }
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Horizon"
            value={`${series.forecast_horizon ?? 12} périodes`}
            icon={Target}
            helpKey="horizon"
            subtitle={`Total prévu: ${(series.forecast_sum ?? 0).toLocaleString("fr-FR", {
              maximumFractionDigits: 0,
            })} unités`}
          />
        </StaggerItem>
      </StaggerChildren>

      {/* Main Chart */}
      <FadeIn delay={0.3}>
        <div ref={chartRef} className="dash-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              <h2 className="dash-section-title">Historique & Prévisions</h2>
              <HelpTooltip termKey="forecast_graph" />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-zinc-400">Réel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-zinc-400">Prévision</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-violet-500/20 border border-violet-500/30" />
                <span className="text-zinc-400">Intervalle de confiance</span>
              </div>
            </div>
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
                  {formatFrequencyLabel(job?.frequency)}
                </button>
              </div>
              <span className="text-xs text-zinc-500">
                Données {formatFrequencyLabel(job?.frequency).toLowerCase()} agrégées en mensuel
              </span>
            </div>
          )}
          {(granularity === "source" && loadingSource) ? (
            <div className="h-[400px] flex items-center justify-center text-zinc-500">
              Chargement des données...
            </div>
          ) : (granularity === "source" && sourceChartData && sourceChartData.length > 0) ? (
            <AnimatedAreaChart data={sourceChartData} height={400} showConfidence />
          ) : chartData.length > 0 ? (
            <AnimatedAreaChart data={chartData} height={400} showConfidence />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-zinc-500">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </FadeIn>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Comparison */}
        <FadeIn delay={0.4}>
          <div className="dash-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="dash-section-title">
                Comparaison des modèles
              </h2>
              {modelComparison?.modelsTested > 0 && (
                <span className="text-xs text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full">
                  {modelComparison.modelsTested} testés
                </span>
              )}
            </div>
            {modelComparison?.ranking && modelComparison.ranking.length > 0 ? (
              <div className="space-y-4">
                {/* Podium – Top 3 */}
                <div className="space-y-2">
                  {modelComparison.ranking.slice(0, 3).map((model: any, index: number) => {
                    const meta = getModelMeta(model.model);
                    const maxScore = modelComparison.ranking[0]?.score ?? 100;
                    const barWidth = maxScore > 0 ? (model.score / maxScore) * 100 : 0;
                    const podiumStyles = [
                      { bg: "bg-indigo-500/10", border: "border-indigo-500/30", badge: "bg-indigo-500 text-white", text: "text-indigo-400", icon: Crown },
                      { bg: "bg-zinc-800/60", border: "border-zinc-700/50", badge: "bg-zinc-600 text-zinc-200", text: "text-zinc-300", icon: Medal },
                      { bg: "bg-zinc-800/40", border: "border-zinc-700/30", badge: "bg-zinc-700 text-zinc-300", text: "text-zinc-400", icon: Medal },
                    ];
                    const style = podiumStyles[index];
                    const Icon = style.icon;
                    return (
                      <motion.div
                        key={model.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "relative overflow-hidden p-3 sm:p-4 rounded-xl border",
                          style.bg,
                          style.border,
                        )}
                      >
                        {/* Barre de score en arrière-plan */}
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 opacity-[0.07]",
                            index === 0 ? "bg-indigo-400" : "bg-zinc-400",
                          )}
                          style={{ width: `${barWidth}%` }}
                        />
                        <div className="relative flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0", style.badge)}>
                              {index === 0 ? <Icon className="w-4 h-4" /> : model.rank}
                            </div>
                            <div className="min-w-0">
                              <p className={cn("font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-none", style.text)} title={model.model}>
                                {meta.label}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {index === 0 && <span className="text-xs text-indigo-300 font-medium">Champion</span>}
                                <span className={cn("text-xs", meta.familyColor)}>{meta.family}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-white tabular-nums">
                              {model.score != null ? model.score.toFixed(1) : "N/A"}
                            </p>
                            <p className="text-xs text-zinc-500">/100</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Autres modèles */}
                {modelComparison.ranking.length > 3 && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-2 px-1">Autres modèles</p>
                    <div className="max-h-[240px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                      {modelComparison.ranking.slice(3).map((model: any, index: number) => {
                        const meta = getModelMeta(model.model);
                        const familyKey = Object.entries(MODEL_FAMILIES).find(
                          ([, v]) => v.label === meta.family
                        )?.[0] as ModelFamily | undefined;
                        const familyHex = familyKey ? MODEL_FAMILIES[familyKey].hex : "#71717a";
                        const maxScore = modelComparison.ranking[0]?.score ?? 100;
                        const barWidth = maxScore > 0 ? (model.score / maxScore) * 100 : 0;
                        return (
                          <motion.div
                            key={model.rank}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.03 }}
                            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            <span className="text-xs text-zinc-600 w-5 text-right tabular-nums shrink-0">{model.rank}</span>
                            <div
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: familyHex }}
                            />
                            <p className="text-sm text-zinc-400 group-hover:text-zinc-300 truncate min-w-0 flex-1" title={model.model}>
                              {meta.label}
                            </p>
                            <div className="w-16 h-1.5 rounded-full bg-zinc-800 shrink-0 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-zinc-600"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-500 tabular-nums w-10 text-right shrink-0">
                              {model.score != null ? model.score.toFixed(1) : "—"}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                Aucune donnée de comparaison
              </div>
            )}
          </div>
        </FadeIn>

        {/* Alerts & Insights */}
        <FadeIn delay={0.5}>
          <div className="dash-card p-6">
            <h2 className="dash-section-title mb-6">
              Alertes et observations
            </h2>
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                <ScoreIcon className={cn("w-5 h-5 mt-0.5", scoreStatus.color)} />
                <div>
                  <p className={cn("font-medium", scoreStatus.color)}>
                    Qualité: {scoreStatus.label}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Score de fiabilité de {championScoreValue.toFixed(1)}/100
                    {championScoreValue >= reliabilityGreen
                      ? " - Excellente précision des prévisions"
                      : championScoreValue >= reliabilityYellow
                        ? " - Précision acceptable, surveiller les écarts"
                        : " - Précision insuffisante, analyse recommandée"}
                  </p>
                </div>
              </div>

              {/* Alertes calculées (badges avec tooltips explicatifs) */}
              {computedAlerts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {computedAlerts.map((alert) => {
                    const glossaryKey = ALERT_GLOSSARY_MAP[alert];
                    const tooltip = glossaryKey ? GLOSSARY[glossaryKey] : undefined;
                    if (tooltip) {
                      return (
                        <BadgeWithTooltip key={alert} tooltip={tooltip}>
                          <AlertBadge type={alert} />
                        </BadgeWithTooltip>
                      );
                    }
                    return <AlertBadge key={alert} type={alert} />;
                  })}
                </div>
              )}

              {/* Actions riches depuis forecast_actions */}
              {liveActions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Recommandations
                  </p>
                  <AnimatePresence mode="popLayout">
                    {liveActions.map((action) => (
                      <ActionCard
                        key={action.id}
                        action={action}
                        compact
                        onDismiss={handleDismissAction}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Aucune alerte */}
              {computedAlerts.length === 0 && liveActions.length === 0 && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <p className="text-sm text-zinc-300">
                    Aucune alerte détectée pour cette série
                  </p>
                </div>
              )}

              {/* Tags */}
              {behaviorTags.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-zinc-500 mb-2">Tags de comportement</p>
                  <div className="flex flex-wrap gap-2">
                    {behaviorTags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-white/5 text-zinc-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
