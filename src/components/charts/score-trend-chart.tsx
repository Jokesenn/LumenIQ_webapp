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
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-xs text-zinc-400">{dateStr}</p>
      <p className="text-sm font-semibold text-white mt-0.5">
        Score {d.score.toFixed(1)}<span className="text-zinc-500">/100</span>
      </p>
      <p className="text-xs text-zinc-500 mt-0.5">{d.seriesCount} series</p>
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
        <div className="rounded-full bg-indigo-500/10 p-3">
          <TrendingUp className="text-indigo-400" size={24} />
        </div>
        <p className="text-sm text-zinc-400 text-center max-w-[240px]">
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
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="dateLabel"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
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
            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="score"
            stroke="#818cf8"
            strokeWidth={2.5}
            fill="url(#scoreFill)"
            dot={({ cx, cy, index }: { cx?: number; cy?: number; index?: number }) => {
              const i = index ?? 0;
              const isLast = i === chartData.length - 1;
              if (!isLast || cx == null || cy == null) return <circle key={i} cx={0} cy={0} r={0} fill="none" />;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="#818cf8"
                  stroke="#1a1a2e"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{
              r: 5,
              fill: "#818cf8",
              stroke: "#1a1a2e",
              strokeWidth: 2,
            }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
