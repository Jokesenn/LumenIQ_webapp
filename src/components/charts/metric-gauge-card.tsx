"use client";

import { motion } from "framer-motion";
import { AnimatedGauge } from "./animated-gauge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricGaugeCardProps {
  label: string;
  value: number;
  unit?: string;
  description?: string;
  benchmark?: {
    value: number;
    label: string;
  };
  thresholds?: {
    good: number;
    warning: number;
  };
  inverted?: boolean; // true si plus bas = mieux (WAPE, SMAPE)
  delay?: number;
  className?: string;
}

export function MetricGaugeCard({
  label,
  value,
  unit = "%",
  description,
  benchmark,
  thresholds = { good: 10, warning: 20 },
  inverted = true,
  delay = 0,
  className,
}: MetricGaugeCardProps) {
  // Calculer le status
  const getStatus = () => {
    if (inverted) {
      if (value <= thresholds.good) return { label: "Excellent", color: "text-emerald-400" };
      if (value <= thresholds.warning) return { label: "Acceptable", color: "text-amber-400" };
      return { label: "À améliorer", color: "text-red-400" };
    } else {
      if (value >= thresholds.warning) return { label: "Excellent", color: "text-emerald-400" };
      if (value >= thresholds.good) return { label: "Acceptable", color: "text-amber-400" };
      return { label: "À améliorer", color: "text-red-400" };
    }
  };

  const status = getStatus();

  // Comparer au benchmark
  const getBenchmarkComparison = () => {
    if (!benchmark) return null;
    const diff = value - benchmark.value;

    if (inverted) {
      // Pour WAPE/SMAPE, plus bas = mieux
      if (diff < 0) return { direction: "down" as const, value: `${Math.abs(diff).toFixed(1)}${unit} mieux`, isGood: true };
      if (diff > 0) return { direction: "up" as const, value: `${diff.toFixed(1)}${unit} au-dessus`, isGood: false };
    } else {
      if (diff > 0) return { direction: "up" as const, value: `+${diff.toFixed(1)}${unit}`, isGood: true };
      if (diff < 0) return { direction: "down" as const, value: `${diff.toFixed(1)}${unit}`, isGood: false };
    }
    return { direction: "neutral" as const, value: "Égal", isGood: true };
  };

  const comparison = getBenchmarkComparison();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all",
        className
      )}
    >
      <div className="flex flex-col items-center">
        {/* Gauge */}
        <AnimatedGauge
          value={value}
          label=""
          unit={unit}
          size="lg"
          thresholds={thresholds}
        />

        {/* Label */}
        <h3 className="text-lg font-semibold text-white mt-4">{label}</h3>

        {/* Status badge */}
        <span className={cn("text-sm font-medium mt-1", status.color)}>
          {status.label}
        </span>

        {/* Description */}
        {description && (
          <p className="text-xs text-zinc-500 mt-2 text-center">{description}</p>
        )}

        {/* Benchmark comparison */}
        {comparison && benchmark && (
          <div className="mt-4 pt-4 border-t border-white/5 w-full">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">vs {benchmark.label}</span>
              <div className={cn(
                "flex items-center gap-1",
                comparison.isGood ? "text-emerald-400" : "text-red-400"
              )}>
                {comparison.direction === "up" && <TrendingUp className="w-4 h-4" />}
                {comparison.direction === "down" && <TrendingDown className="w-4 h-4" />}
                {comparison.direction === "neutral" && <Minus className="w-4 h-4" />}
                <span>{comparison.value}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
