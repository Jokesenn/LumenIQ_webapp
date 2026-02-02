"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModelData {
  model: string;
  count: number;
  percentage: number;
  avgWape?: number;
}

interface ModelPerformanceChartProps {
  data: ModelData[];
  onModelClick?: (modelName: string) => void;
  className?: string;
}

function getModelWapeColor(wape: number): string {
  if (wape < 5) return "text-emerald-400";
  if (wape < 15) return "text-amber-400";
  return "text-red-400";
}

const modelColors: Record<string, string> = {
  XGBoost: "from-indigo-500 to-indigo-600",
  LightGBM: "from-violet-500 to-violet-600",
  Prophet: "from-cyan-500 to-cyan-600",
  ARIMA: "from-emerald-500 to-emerald-600",
  Theta: "from-amber-500 to-amber-600",
  CES: "from-rose-500 to-rose-600",
  ETS: "from-blue-500 to-blue-600",
  default: "from-zinc-500 to-zinc-600",
};

export function ModelPerformanceChart({ data, onModelClick, className }: ModelPerformanceChartProps) {
  const maxPercentage = data.length > 0 ? Math.max(...data.map((d) => d.percentage)) : 0;

  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-zinc-500 border border-white/5 rounded-xl bg-white/5">
        Aucune donnée de performance disponible
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {data.map((item, index) => {
        const colorClass = modelColors[item.model] || modelColors.default;
        const barWidth = (item.percentage / maxPercentage) * 100;

        return (
          <motion.div
            key={item.model}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={cn(
              "group rounded-xl px-3 py-2 -mx-3 transition-colors",
              onModelClick && "cursor-pointer hover:bg-white/5"
            )}
            onClick={() => onModelClick?.(item.model)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{item.model}</span>
                <span className="text-xs text-zinc-500">({item.count})</span>
              </div>
              <div className="flex items-center gap-3">
                {item.avgWape !== undefined && (
                  <span className={cn("text-xs", getModelWapeColor(item.avgWape))}>
                    WAPE: {item.avgWape.toFixed(1)}%
                  </span>
                )}
                <span className="text-sm font-semibold text-white tabular-nums">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
                  colorClass
                )}
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              />

              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
