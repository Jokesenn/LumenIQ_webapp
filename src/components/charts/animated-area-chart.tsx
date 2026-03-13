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
  ReferenceArea,
} from "recharts";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { PulseDot } from "./pulse-dot";

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

interface TooltipEntry {
  name: string;
  value: number | string | null;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const visible = payload.filter(
    (e: TooltipEntry) => !HIDDEN_TOOLTIP_NAMES.has(e.name) && e.value != null,
  );
  if (visible.length === 0) return null;

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-3 shadow-[var(--shadow-card)]">
      <p className="text-xs text-[var(--color-text-secondary)] mb-2">{label}</p>
      {visible.map((entry: TooltipEntry, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--color-text)]">{entry.name}:</span>
          <span className="font-medium text-[var(--color-text)]">
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

  // Index of last data point with an actual value (for PulseDot)
  const lastActualIndex = useMemo(() => {
    let last = -1;
    for (let i = 0; i < chartData.length; i++) {
      if (chartData[i].actual != null) last = i;
    }
    return last;
  }, [chartData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      <div
        role="img"
        aria-label="Graphique de tendance des prévisions montrant les valeurs réelles et prévues au fil du temps"
      >
        <span className="sr-only">
          Graphique de tendance des prévisions. Ce graphique affiche les valeurs historiques réelles et les prévisions futures en cuivre, avec des intervalles de confiance optionnels.
        </span>
        <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {/* Gradient pour actuals */}
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#141414" stopOpacity={0.08} />
              <stop offset="95%" stopColor="#141414" stopOpacity={0} />
            </linearGradient>
            {/* Gradient pour forecast */}
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B45309" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#B45309" stopOpacity={0} />
            </linearGradient>
            {/* Gradient pour confidence interval band */}
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B45309" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#B45309" stopOpacity={0.05} />
            </linearGradient>
            {/* Dot grid — zone de prévision (Brand Device #4) */}
            <pattern id="forecast-dot-grid" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.5" fill="#8A8A82" opacity="0.35" />
            </pattern>
          </defs>

          <CartesianGrid
            stroke="var(--color-chart-grid)"
            strokeWidth={0.5}
            vertical={false}
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-text-tertiary)", fontSize: 9, fontFamily: "var(--font-mono)" }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-text-tertiary)", fontSize: 9, fontFamily: "var(--font-mono)" }}
            tickFormatter={(value) => value.toLocaleString("fr-FR", { notation: "compact" })}
            dx={-10}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => <span className="text-[var(--color-text-secondary)] text-sm">{value}</span>}
          />

          {/* Dot grid — zone de prévision (Brand Device #4) */}
          {splitDate && (
            <ReferenceArea
              x1={splitDate}
              fill="url(#forecast-dot-grid)"
              fillOpacity={1}
              stroke="none"
              ifOverflow="hidden"
            />
          )}

          {/* Ligne de séparation actuals/forecast */}
          {splitDate && (
            <ReferenceLine
              x={splitDate}
              stroke="var(--color-copper)"
              strokeWidth={2}
              label={{
                value: "RÉFÉRENCE",
                position: "top",
                fill: "var(--color-copper)",
                fontSize: 8,
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
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
            stroke="var(--color-chart-actual)"
            strokeWidth={2}
            fill="url(#actualGradient)"
            fillOpacity={1}
            name="Réel"
            dot={<PulseDot lastIndex={lastActualIndex} />}
            activeDot={{ r: 5, fill: "var(--color-copper)", stroke: "#fff", strokeWidth: 2 }}
            onMouseEnter={() => setHoveredArea("actual")}
            onMouseLeave={() => setHoveredArea(null)}
          />

          {/* Forecast */}
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="var(--color-chart-forecast)"
            strokeWidth={2}
            strokeDasharray="6 3"
            fill="url(#forecastGradient)"
            fillOpacity={1}
            name="Prévision"
            dot={false}
            activeDot={{ r: 5, fill: "var(--color-copper)", stroke: "#fff", strokeWidth: 2 }}
            onMouseEnter={() => setHoveredArea("forecast")}
            onMouseLeave={() => setHoveredArea(null)}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
