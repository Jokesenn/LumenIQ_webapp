"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Treemap,
} from "recharts";
import { PieChart as PieChartIcon, LayoutGrid } from "lucide-react";
import type { FamilyAggregation } from "@/lib/reliability-utils";
import { cn } from "@/lib/utils";

interface ReliabilityFamilyVizProps {
  families: FamilyAggregation[];
  globalAvgScore: number;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FamilyTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as FamilyAggregation | undefined;
  if (!d) return null;

  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.hex }} />
        <p className="text-sm font-medium text-white">{d.family}</p>
      </div>
      <div className="mt-1 space-y-0.5 text-xs text-zinc-300 ml-[18px]">
        <div>{d.seriesCount} séries ({d.percentage.toFixed(0)}%)</div>
        <div>Score moyen : {d.avgScore.toFixed(0)}/100</div>
      </div>
    </div>
  );
}

function truncateLabel(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTreemapContent(props: Record<string, any>) {
  const { x, y, width, height, family, seriesCount, hex } = props;
  if (width < 4 || height < 4) return null;

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        rx={8}
        fill={hex}
        fillOpacity={0.15}
        stroke={hex}
        strokeWidth={1}
        strokeOpacity={0.4}
      />
      {width > 70 && height > 35 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 7}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontWeight={600}
          >
            {truncateLabel(family ?? "", 18)}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize={10}
          >
            {seriesCount} séries
          </text>
        </>
      )}
      {width > 35 && width <= 70 && height > 25 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 2}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize={10}
        >
          {seriesCount}
        </text>
      )}
    </g>
  );
}

export function ReliabilityFamilyViz({
  families,
  globalAvgScore,
  className,
}: ReliabilityFamilyVizProps) {
  const [mode, setMode] = useState<"donut" | "treemap">("donut");

  if (families.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-zinc-500">
        Aucune donnée disponible
      </div>
    );
  }

  const treemapData = families.map((f) => ({
    name: f.family,
    family: f.family,
    seriesCount: f.seriesCount,
    hex: f.hex,
    size: f.seriesCount,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn("w-full", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <h3 className="text-sm font-medium text-zinc-300">
            Répartition par famille
          </h3>
        </div>
        <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg">
          <button
            onClick={() => setMode("donut")}
            className={cn(
              "p-1.5 rounded-md transition-all duration-200",
              mode === "donut"
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
            title="Vue donut"
          >
            <PieChartIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode("treemap")}
            className={cn(
              "p-1.5 rounded-md transition-all duration-200",
              mode === "treemap"
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
            title="Vue treemap"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="transition-all duration-300">
        {mode === "donut" ? (
          <div className="relative">
            {/* Glow effect behind the donut */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-28 h-28 rounded-full bg-indigo-500/10 blur-2xl" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data={families as unknown as Record<string, any>[]}
                  dataKey="seriesCount"
                  nameKey="family"
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={2}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={1}
                >
                  {families.map((f) => (
                    <Cell key={f.family} fill={f.hex} fillOpacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<FamilyTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* HTML center label — more reliable than SVG <text> */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white tabular-nums">
                {globalAvgScore.toFixed(0)}
              </span>
              <span className="text-xs text-zinc-500">/100</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <Treemap
              data={treemapData}
              dataKey="size"
              nameKey="name"
              stroke="none"
              content={<CustomTreemapContent />}
            />
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
        {families.map((f) => (
          <div key={f.family} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-1 ring-offset-transparent"
              style={{ backgroundColor: f.hex, boxShadow: `0 0 6px ${f.hex}40` }}
            />
            <span className="text-zinc-300">{f.family}</span>
            <span className="text-zinc-500">
              {f.seriesCount} ({f.percentage.toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
