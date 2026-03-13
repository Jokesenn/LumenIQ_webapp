"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { MODEL_FAMILIES, type ModelFamily } from "@/lib/model-labels";
import type { EnrichedModelData } from "@/lib/reliability-utils";
import { cn } from "@/lib/utils";
import { useThresholds } from "@/lib/thresholds/context";

interface ReliabilityBubbleChartProps {
  data: EnrichedModelData[];
  className?: string;
}

interface TooltipPayload {
  payload: EnrichedModelData;
}

function BubbleTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as EnrichedModelData | undefined;
  if (!d) return null;

  return (
    <div className="bg-white backdrop-blur-xl border border-[var(--color-border)] rounded-xl p-3 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: d.familyHex }}
        />
        <p className="text-sm font-medium text-[var(--color-text)]">{d.label}</p>
      </div>
      <p className="text-xs text-[var(--color-text-tertiary)] ml-[18px]">{d.technicalName}</p>
      <div className="mt-2 pt-2 border-t border-[var(--color-border)] space-y-1 text-xs text-[var(--color-text)]">
        <div className="flex items-center justify-between gap-4">
          <span>{d.seriesCount} séries</span>
          <span className="text-[var(--color-text)] font-medium">Score: {d.avgScore.toFixed(0)}/100</span>
        </div>
        <div>{d.percentage.toFixed(0)}% de vos produits</div>
        <div className="text-[var(--color-text-tertiary)]">Famille : {d.family}</div>
      </div>
    </div>
  );
}

const FAMILY_ORDER: (ModelFamily | "other")[] = ["decomposition", "classical", "ml", "advanced", "other"];

export function ReliabilityBubbleChart({ data, className }: ReliabilityBubbleChartProps) {
  const { thresholds } = useThresholds();
  const reliabilityThreshold = thresholds.reliability_score?.green_max ?? 80;

  const familyGroups = useMemo(() => {
    const groups: Record<string, EnrichedModelData[]> = {};
    for (const d of data) {
      const key = d.familyKey;
      if (!groups[key]) groups[key] = [];
      groups[key].push(d);
    }
    return FAMILY_ORDER
      .filter((k) => groups[k]?.length)
      .map((k) => ({
        key: k,
        label: k === "other" ? "Autre" : MODEL_FAMILIES[k].label,
        hex: k === "other" ? "#71717a" : MODEL_FAMILIES[k].hex,
        data: groups[k],
      }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-[var(--color-text-tertiary)]">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn("w-full", className)}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper)]" />
        <h3 className="text-sm font-medium text-[var(--color-text)]">
          Couverture et fiabilité par méthode
        </h3>
      </div>
      <div
        role="img"
        aria-label="Graphique de fiabilité par série montrant la couverture et la fiabilité de chaque méthode de prévision"
      >
        <span className="sr-only">
          Graphique de fiabilité par série. Ce graphique montre la couverture et la fiabilité de chaque méthode de prévision, avec les bulles dimensionnées par leur poids relatif.
        </span>
        <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 20 }}>
          <defs>
            {familyGroups.map((g) => (
              <radialGradient key={g.key} id={`bubble-glow-${g.key}`}>
                <stop offset="0%" stopColor={g.hex} stopOpacity={0.95} />
                <stop offset="70%" stopColor={g.hex} stopOpacity={0.6} />
                <stop offset="100%" stopColor={g.hex} stopOpacity={0.2} />
              </radialGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0,0,0,0.06)"
            vertical={false}
          />
          <XAxis
            type="number"
            dataKey="seriesCount"
            name="Séries"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            type="number"
            dataKey="avgScore"
            name="Score"
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            dx={-5}
          />
          <ZAxis
            type="number"
            dataKey="normalizedBubbleSize"
            range={[300, 2500]}
            name="Poids"
          />
          <ReferenceLine
            y={reliabilityThreshold}
            stroke="rgba(0,0,0,0.1)"
            strokeDasharray="6 4"
            label={{
              value: `Seuil de fiabilité ${reliabilityThreshold}%`,
              position: "insideTopLeft",
              fill: "#52525b",
              fontSize: 10,
            }}
          />
          <Tooltip content={<BubbleTooltip />} cursor={false} />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value: string) => (
              <span className="text-[var(--color-text-secondary)] text-xs">{value}</span>
            )}
          />
          {familyGroups.map((group) => (
            <Scatter
              key={group.key}
              name={group.label}
              data={group.data}
              fill={`url(#bubble-glow-${group.key})`}
              stroke={group.hex}
              strokeWidth={1}
              strokeOpacity={0.4}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
