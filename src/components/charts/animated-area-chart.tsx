"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  actual?: number;
  forecast?: number;
  forecastLower?: number;
  forecastUpper?: number;
  /** Upper minus Lower — used for the stacked confidence band */
  forecastBand?: number;
}

interface AnimatedAreaChartProps {
  data: DataPoint[];
  height?: number;
  showConfidence?: boolean;
  className?: string;
}

const HIDDEN_TOOLTIP_NAMES = new Set(["CI lower", "CI upper", "Intervalle"]);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const visible = payload.filter(
    (e: any) => !HIDDEN_TOOLTIP_NAMES.has(e.name) && e.value != null,
  );
  if (visible.length === 0) return null;

  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-xs text-zinc-400 mb-2">{label}</p>
      {visible.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-zinc-300">{entry.name}:</span>
          <span className="font-medium text-white">
            {typeof entry.value === "number"
              ? entry.value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function AnimatedAreaChart({
  data,
  height = 350,
  showConfidence = true,
  className,
}: AnimatedAreaChartProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  // Compute the band delta (upper - lower) for stacked confidence rendering
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        forecastBand:
          d.forecastUpper != null && d.forecastLower != null
            ? d.forecastUpper - d.forecastLower
            : undefined,
      })),
    [data],
  );

  // Trouver la date de séparation actuals/forecast
  const splitIndex = chartData.findIndex((d) => d.forecast !== undefined && d.actual === undefined);
  const splitDate = splitIndex > 0 ? chartData[splitIndex - 1]?.date : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {/* Gradient pour actuals */}
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            {/* Gradient pour forecast */}
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            {/* Gradient pour confidence interval band */}
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString("fr-FR", { notation: "compact" })}
            dx={-10}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
          />

          {/* Ligne de séparation actuals/forecast */}
          {splitDate && (
            <ReferenceLine
              x={splitDate}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="5 5"
              label={{
                value: "Prévisions →",
                position: "top",
                fill: "#71717a",
                fontSize: 11,
              }}
            />
          )}

          {/* Confidence interval band (si activé) — lower is invisible base, band fills the gap */}
          {showConfidence && (
            <>
              <Area
                type="monotone"
                dataKey="forecastLower"
                stackId="confidence"
                stroke="none"
                fill="transparent"
                fillOpacity={0}
                legendType="none"
                name="CI lower"
                activeDot={false}
                dot={false}
                tooltipType="none"
              />
              <Area
                type="monotone"
                dataKey="forecastBand"
                stackId="confidence"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={1}
                legendType="none"
                name="Intervalle"
                activeDot={false}
                dot={false}
                tooltipType="none"
              />
            </>
          )}

          {/* Actuals */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#actualGradient)"
            fillOpacity={1}
            name="Réel"
            dot={false}
            activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
            onMouseEnter={() => setHoveredArea("actual")}
            onMouseLeave={() => setHoveredArea(null)}
          />

          {/* Forecast */}
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#forecastGradient)"
            fillOpacity={1}
            name="Prévision"
            dot={false}
            activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
            onMouseEnter={() => setHoveredArea("forecast")}
            onMouseLeave={() => setHoveredArea(null)}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
