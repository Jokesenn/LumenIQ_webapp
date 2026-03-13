"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PulseDot } from "./pulse-dot";
import type { TrendDataPoint } from "@/lib/queries/dashboard";

interface ScoreTrendChartProps {
  data: TrendDataPoint[];
  height?: number;
  className?: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: TrendDataPoint }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  const dateStr = d.date ? format(parseISO(d.date), "dd MMM yyyy", { locale: fr }) : "—";

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl px-3 py-2 shadow-[var(--shadow-card)]">
      <p className="text-xs text-[var(--color-text-secondary)]">{dateStr}</p>
      <p className="text-sm font-semibold text-[var(--color-text)] mt-0.5">
        Score {d.score.toFixed(1)}<span className="text-[var(--color-text-tertiary)]">/100</span>
      </p>
      <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{d.seriesCount} series</p>
    </div>
  );
}

export function ScoreTrendChart({ data, height = 250, className }: ScoreTrendChartProps) {
  if (data.length < 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}
      >
        <div className="rounded-full bg-[var(--color-copper)]/10 p-3">
          <TrendingUp className="text-[var(--color-copper)]" size={24} />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] text-center max-w-[240px]">
          Lancez au moins 2 previsions pour voir la tendance
        </p>
      </motion.div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: d.date ? format(parseISO(d.date), "dd/MM", { locale: fr }) : "—",
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      <div
        role="img"
        aria-label="Graphique de tendance des scores montrant l'évolution du score de fiabilité au fil du temps"
      >
        <span className="sr-only">
          Graphique de tendance des scores. Ce graphique affiche l'évolution du score moyen de fiabilité au fil du temps avec une ligne de référence à 80 points.
        </span>
        <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B45309" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#B45309" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="dateLabel"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-text-tertiary)", fontSize: 9, fontFamily: "var(--font-mono)" }}
            dy={8}
          />
          <YAxis
            domain={[0, 100]}
            hide
          />

          <ReferenceLine
            y={80}
            stroke="#34d399"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="score"
            stroke="#B45309"
            strokeWidth={2}
            fill="url(#scoreFill)"
            dot={<PulseDot lastIndex={chartData.length - 1} />}
            activeDot={{
              r: 5,
              fill: "var(--color-copper)",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
