"use client";

import { motion } from "framer-motion";
import type { EnrichedModelData } from "@/lib/reliability-utils";
import { cn } from "@/lib/utils";

interface ReliabilityDetailTableProps {
  data: EnrichedModelData[];
  onModelClick: (modelName: string) => void;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function getScoreDotBg(score: number): string {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 50) return "bg-amber-400";
  return "bg-red-400";
}

function getScoreDotShadow(score: number): string {
  if (score >= 80) return "shadow-[0_0_4px_rgba(52,211,153,0.5)]";
  if (score >= 50) return "shadow-[0_0_4px_rgba(251,191,36,0.5)]";
  return "shadow-[0_0_4px_rgba(248,113,113,0.4)]";
}

function ScoreDots({ score }: { score: number }) {
  const filled = Math.round(score / 10);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-2 h-2 rounded-full transition-all",
            i < filled
              ? cn(getScoreDotBg(score), getScoreDotShadow(score))
              : "bg-white/10"
          )}
        />
      ))}
    </div>
  );
}

export function ReliabilityDetailTable({ data, onModelClick }: ReliabilityDetailTableProps) {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-zinc-500">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        <h3 className="text-sm font-medium text-zinc-300 font-display">
          Détail par méthode
        </h3>
      </div>
      <div className="divide-y divide-white/5">
        {data.map((item, index) => (
          <motion.button
            key={item.technicalName}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={() => onModelClick(item.technicalName)}
            className={cn(
              "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200",
              "hover:bg-white/5 cursor-pointer text-left",
              "border-l-2 border-l-transparent hover:border-l-current"
            )}
            style={{ color: item.familyHex } as React.CSSProperties}
          >
            {/* Family color dot with glow */}
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                backgroundColor: item.familyHex,
                boxShadow: `0 0 6px ${item.familyHex}40`,
              }}
            />

            {/* Labels */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{item.label}</p>
              <p className="text-xs text-zinc-500 truncate">{item.technicalName}</p>
            </div>

            {/* Series count */}
            <div className="text-xs text-zinc-400 shrink-0 w-16 text-right">
              {item.seriesCount} {item.seriesCount > 1 ? "séries" : "série"}
            </div>

            {/* Score dots */}
            <div className="hidden sm:flex shrink-0">
              <ScoreDots score={item.avgScore} />
            </div>

            {/* Numeric score */}
            <div className={cn("text-sm font-semibold tabular-nums shrink-0 w-14 text-right", getScoreColor(item.avgScore))}>
              {item.avgScore.toFixed(0)}/100
            </div>

            {/* Percentage */}
            <div className="text-xs text-zinc-500 tabular-nums shrink-0 w-10 text-right">
              {item.percentage.toFixed(0)}%
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
