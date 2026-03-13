"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ForecastAction, ActionPriority, ActionTrend } from "@/types/actions";

interface ActionCardProps {
  action: ForecastAction;
  compact?: boolean;
  onDismiss?: (id: string) => void;
  onNavigate?: (seriesId: string, jobId: string) => void;
}

const PRIORITY_CONFIG: Record<
  ActionPriority,
  { bg: string; border: string; text: string; icon: typeof AlertTriangle }
> = {
  urgent: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: AlertTriangle,
  },
  warning: {
    bg: "bg-[var(--color-copper-bg)]",
    border: "border-[var(--color-copper)]/30",
    text: "text-[var(--color-copper)]",
    icon: AlertCircle,
  },
  info: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    icon: Info,
  },
  clear: {
    bg: "bg-[var(--color-bg-surface)]",
    border: "border-[var(--color-border)]",
    text: "text-[var(--color-text-tertiary)]",
    icon: CheckCircle2,
  },
};

const TREND_CONFIG: Record<ActionTrend, { icon: typeof TrendingUp; label: string; color: string }> = {
  worsening: { icon: TrendingUp, label: "Dégradation", color: "text-red-400" },
  stable: { icon: Minus, label: "Stable", color: "text-[var(--color-text-secondary)]" },
  improving: { icon: TrendingDown, label: "Amélioration", color: "text-emerald-400" },
};

export { PRIORITY_CONFIG, TREND_CONFIG };

export function ActionCard({ action, compact, onDismiss, onNavigate }: ActionCardProps) {
  const config = PRIORITY_CONFIG[action.priority];
  const Icon = config.icon;
  const trend = action.trend ? TREND_CONFIG[action.trend] : null;
  const TrendIcon = trend?.icon;

  const metricValue = action.context?.metric_value as number | undefined;
  const metricLabel = action.context?.metric_label as string | undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl border p-4",
        config.bg,
        config.border,
        "transition-colors"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("shrink-0 mt-0.5", config.text)} size={18} />

        <div className="flex-1 min-w-0">
          {/* Title + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-medium font-display text-[var(--color-text)] truncate">
              {action.title}
            </h4>
            {(action.recurrence_count ?? 0) > 1 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]">
                <RotateCcw size={10} />
                {action.recurrence_count}x
              </span>
            )}
            {trend && TrendIcon && (
              <span className={cn("flex items-center gap-0.5 text-[10px]", trend.color)}>
                <TrendIcon size={10} />
                {trend.label}
              </span>
            )}
          </div>

          {/* Message (hidden in compact mode) */}
          {!compact && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
              {action.message}
            </p>
          )}

          {/* Suggestion */}
          {action.suggestion && !compact && (
            <p className="text-xs text-[var(--color-text)] mt-1.5 italic">
              {action.suggestion}
            </p>
          )}

          {/* Metric value + actions */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              {metricValue !== undefined && (
                <span className={cn("text-xs font-mono font-medium copper-num", config.text)}>
                  {metricLabel || ""}{" "}
                  {typeof metricValue === "number"
                    ? `${(metricValue * 100).toFixed(1)}%`
                    : metricValue}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {action.series_id && onNavigate && (
                <button
                  onClick={() => onNavigate(action.series_id!, action.job_id)}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-surface)] transition-colors"
                >
                  Voir
                  <ArrowRight size={12} />
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(action.id)}
                  className="p-1 rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-surface)] transition-colors"
                  aria-label="Ignorer cette action"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
