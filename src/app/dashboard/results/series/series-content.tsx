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
import { AlertBadge } from "@/components/ui/alert-badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

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

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-emerald-400", Icon: CheckCircle2 };
    if (score >= 70) return { label: "Acceptable", color: "text-amber-400", Icon: Info };
    return { label: "À améliorer", color: "text-red-400", Icon: AlertTriangle };
  };

  const championScoreValue = series.champion_score ?? 0;
  const scoreStatus = getScoreStatus(championScoreValue);
  const ScoreIcon = scoreStatus.Icon;

  // Alertes calculées depuis les flags série (zéro requête supplémentaire)
  const computedAlerts = sortAlertsByPriority(
    getSeriesAlerts({
      wape: series.wape,
      was_gated: series.was_gated,
      drift_detected: series.drift_detected,
      is_first_run: series.is_first_run,
      previous_champion: series.previous_champion,
      champion_model: series.champion_model,
    })
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
                <h1 className="text-2xl font-bold text-white">{series.series_id}</h1>
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
            variant={championScoreValue >= 90 ? "success" : championScoreValue >= 70 ? "warning" : "default"}
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
        <div ref={chartRef} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-semibold text-white">Historique & Prévisions</h2>
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
          {chartData.length > 0 ? (
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
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
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
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-6">
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
                    {championScoreValue >= 90
                      ? " - Excellente précision des prévisions"
                      : championScoreValue >= 70
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
