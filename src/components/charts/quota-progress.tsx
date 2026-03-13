"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuotaProgressProps {
  used: number;
  total: number;
  label?: string;
  showValues?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function QuotaProgress({
  used,
  total,
  label = "Quota utilisé",
  showValues = true,
  size = "md",
  className,
}: QuotaProgressProps) {
  const percentage = Math.min((used / total) * 100, 100);

  const getColor = () => {
    if (percentage < 60) return "from-amber-700 to-amber-800";
    if (percentage < 85) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
        {showValues && (
          <span className="text-sm font-medium">
            <span className="text-[var(--color-text)]">{used.toLocaleString()}</span>
            <span className="text-[var(--color-text-tertiary)]"> / {total.toLocaleString()}</span>
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className={cn(
        "relative w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden",
        size === "sm" ? "h-2" : "h-3"
      )}>
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 bg-gradient-to-r rounded-full",
            getColor()
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </div>

      {/* Percentage */}
      <div className="flex justify-end mt-1">
        <span className={cn(
          "text-xs font-medium",
          percentage >= 85 ? "text-red-400" : percentage >= 60 ? "text-amber-400" : "text-[var(--color-text-tertiary)]"
        )}>
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
