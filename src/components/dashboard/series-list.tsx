"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import type { SeriesListItem } from "@/types/forecast";
import { SeriesAlertBadges } from "@/components/dashboard/results/SeriesAlertBadges";
import { Sparkline } from "@/components/ui/sparkline";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { BadgeWithTooltip } from "@/components/ui/badge-with-tooltip";
import { GLOSSARY } from "@/lib/glossary";
import { getChampionScoreColor } from "@/lib/metrics";
import { getModelMeta } from "@/lib/model-labels";
import { useThresholds } from "@/lib/thresholds/context";

interface SeriesListProps {
  series: SeriesListItem[];
  jobId: string;
  variant?: "top" | "bottom" | "default";
  title?: string;
  helpKey?: string;
  emptyMessage?: string;
  className?: string;
}

const classColors: Record<string, string> = {
  A: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  B: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  C: "bg-red-500/20 text-red-400 border-red-500/30",
  X: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Y: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Z: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function SeriesList({
  series,
  jobId,
  variant = "default",
  title,
  helpKey,
  emptyMessage = "Aucune série",
  className,
}: SeriesListProps) {
  const { thresholds } = useThresholds();
  const getScoreColor = (score: number | null) =>
    getChampionScoreColor(score, {
      green: thresholds.reliability_score.green_max,
      yellow: thresholds.reliability_score.yellow_max,
    });

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {variant === "top" && <TrendingUp className="w-5 h-5 text-emerald-400" />}
          {variant === "bottom" && <TrendingDown className="w-5 h-5 text-red-400" />}
          <h3 className="font-semibold text-white">{title}</h3>
          {helpKey && <HelpTooltip termKey={helpKey} />}
        </div>
      )}

      {series.length > 0 ? (
        <div className="space-y-2">
          {series.map((s, index) => (
            <motion.div
              key={s.series_id}
              initial={{ opacity: 0, x: variant === "top" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/dashboard/results/series?job=${jobId}&series=${encodeURIComponent(s.series_id)}`}>
                <div className="group flex items-center justify-between p-3 lg:p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-transparent hover:border-white/[0.08] transition-all gap-2">
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                    {/* Rank indicator */}
                    <div
                      className={cn(
                        "w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center text-xs lg:text-sm font-bold shrink-0",
                        variant === "top"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : variant === "bottom"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {index + 1}
                    </div>

                    {/* Series info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 lg:gap-2">
                        <p className="font-medium text-sm lg:text-base text-white truncate group-hover:text-indigo-400 transition-colors">
                          {s.series_id}
                        </p>
                        <div className="hidden xl:flex shrink-0">
                          <SeriesAlertBadges
                            series={{
                              wape: s.wape,
                              was_gated: s.was_gated,
                              drift_detected: s.drift_detected,
                              is_first_run: s.is_first_run,
                              previous_champion: s.previous_champion,
                              champion_model: s.champion_model,
                            }}
                            maxBadges={2}
                            size="sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <BadgeWithTooltip tooltip={GLOSSARY.abc}>
                          <span
                            className={cn(
                              "text-xs px-1 py-0.5 rounded border",
                              classColors[s.abc_class] ?? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                            )}
                          >
                            {s.abc_class}
                          </span>
                        </BadgeWithTooltip>
                        <BadgeWithTooltip tooltip={GLOSSARY.xyz}>
                          <span
                            className={cn(
                              "text-xs px-1 py-0.5 rounded border",
                              classColors[s.xyz_class] ?? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                            )}
                          >
                            {s.xyz_class}
                          </span>
                        </BadgeWithTooltip>
                        <span className="text-xs text-zinc-500 truncate hidden lg:inline">
                          {getModelMeta(s.champion_model).label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Sparkline + Champion Score */}
                  <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                    <div className="hidden xl:block">
                      <Sparkline
                        history={s.history_sample}
                        forecast={s.forecast_sample}
                        width={80}
                        height={24}
                      />
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm lg:text-base font-semibold font-display", getScoreColor(s.champion_score))}>
                        {s.champion_score != null ? s.champion_score.toFixed(1) : "N/A"}
                      </p>
                      <p className="text-xs text-zinc-500">Fiabilité</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors hidden lg:block" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-500">{emptyMessage}</div>
      )}
    </div>
  );
}
