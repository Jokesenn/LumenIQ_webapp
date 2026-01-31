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
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  actual?: number;
  forecast?: number;
  forecastLower?: number;
  forecastUpper?: number;
}

interface AnimatedAreaChartProps {
  data: DataPoint[];
  height?: number;
  showConfidence?: boolean;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-zinc-400 mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
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

  // Trouver la date de séparation actuals/forecast
  const splitIndex = data.findIndex((d) => d.forecast !== undefined && d.actual === undefined);
  const splitDate = splitIndex > 0 ? data[splitIndex - 1]?.date : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            {/* Gradient pour confidence interval */}
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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

          {/* Confidence interval (si activé) */}
          {showConfidence && (
            <Area
              type="monotone"
              dataKey="forecastUpper"
              stroke="none"
              fill="url(#confidenceGradient)"
              fillOpacity={1}
              name="Intervalle"
              legendType="none"
            />
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
