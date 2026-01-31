"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard";
import { AnimatedAreaChart } from "@/components/charts";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";

interface SeriesContentProps {
  job: any;
  series: any;
  chartData: any[];
  modelComparison: any;
}

export function SeriesContent({
  job,
  series,
  chartData,
  modelComparison,
}: SeriesContentProps) {
  const classColors: Record<string, string> = {
    A: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    B: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    C: "bg-red-500/20 text-red-400 border-red-500/30",
    X: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Y: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Z: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const getWapeStatus = (wape: number) => {
    if (wape < 10) return { label: "Excellent", color: "text-emerald-400", Icon: CheckCircle2 };
    if (wape < 20) return { label: "Acceptable", color: "text-amber-400", Icon: Info };
    return { label: "À améliorer", color: "text-red-400", Icon: AlertTriangle };
  };

  const wapeValue = series.wape ?? 0;
  const wapeStatus = getWapeStatus(wapeValue);
  const WapeIcon = wapeStatus.Icon;

  // Parse alerts si c'est une string JSON
  const alerts =
    typeof series.alerts === "string"
      ? (() => {
          try {
            return JSON.parse(series.alerts || "[]");
          } catch {
            return [];
          }
        })()
      : series.alerts || [];

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
            <Link href={`/dashboard/results?job=${job.id}`}>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{series.series_id}</h1>
                <span
                  className={cn(
                    "px-2 py-1 rounded-lg border text-sm font-medium",
                    classColors[abcClass]
                  )}
                >
                  {abcClass}
                </span>
                <span
                  className={cn(
                    "px-2 py-1 rounded-lg border text-sm font-medium",
                    classColors[xyzClass]
                  )}
                >
                  {xyzClass}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">Job: {job.filename}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerChildren staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem>
          <StatCard
            label="WAPE"
            value={`${wapeValue.toFixed(1)}%`}
            icon={TrendingUp}
            variant={wapeValue < 10 ? "success" : wapeValue < 20 ? "warning" : "default"}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Champion"
            value={series.champion_model || "N/A"}
            icon={Award}
            subtitle={`Score: ${(series.champion_score ?? 0).toFixed(2)}`}
            variant="highlight"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="CV Coefficient"
            value={(series.cv_coefficient ?? 0).toFixed(2)}
            icon={Activity}
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
            value={`${series.forecast_horizon ?? 12} mois`}
            icon={Target}
            subtitle={`Total: ${(series.forecast_sum ?? 0).toLocaleString("fr-FR", {
              maximumFractionDigits: 0,
            })}`}
          />
        </StaggerItem>
      </StaggerChildren>

      {/* Main Chart */}
      <FadeIn delay={0.3}>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Historique & Prévisions</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-zinc-400">Réel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-zinc-400">Prévision</span>
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
            <h2 className="text-lg font-semibold text-white mb-6">
              Comparaison des modèles
            </h2>
            {modelComparison?.ranking ? (
              <div className="space-y-3">
                {modelComparison.ranking.map((model: any, index: number) => (
                  <motion.div
                    key={model.model}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl",
                      index === 0
                        ? "bg-indigo-500/10 border border-indigo-500/30"
                        : "bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                          index === 0
                            ? "bg-indigo-500 text-white"
                            : "bg-zinc-800 text-zinc-400"
                        )}
                      >
                        {model.rank}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            index === 0 ? "text-indigo-400" : "text-white"
                          )}
                        >
                          {model.model}
                        </p>
                        {index === 0 && (
                          <p className="text-xs text-indigo-300">Champion</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {model.score != null ? model.score.toFixed(2) : "N/A"}
                      </p>
                      <p className="text-xs text-zinc-500">Score</p>
                    </div>
                  </motion.div>
                ))}
                <p className="text-xs text-zinc-500 text-center mt-4">
                  {modelComparison.modelsTested} modèles testés au total
                </p>
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
              Alertes & Insights
            </h2>
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                <WapeIcon className={cn("w-5 h-5 mt-0.5", wapeStatus.color)} />
                <div>
                  <p className={cn("font-medium", wapeStatus.color)}>
                    Qualité: {wapeStatus.label}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    WAPE de {wapeValue.toFixed(1)}%
                    {wapeValue < 10
                      ? " - Excellente précision des prévisions"
                      : wapeValue < 20
                        ? " - Précision acceptable, surveiller les écarts"
                        : " - Précision insuffisante, analyse recommandée"}
                  </p>
                </div>
              </div>

              {/* Alerts from series */}
              {alerts.length > 0 ? (
                alerts.map((alert: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <p className="text-sm text-zinc-300">{alert}</p>
                  </div>
                ))
              ) : (
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
