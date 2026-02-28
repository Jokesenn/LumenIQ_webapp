"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { forecastData } from "@/lib/mock-data";

const LABEL_MAP: Record<string, { label: string; color: string }> = {
  actual:   { label: "Réel",      color: "#a1a1aa" },
  forecast: { label: "Prévision", color: "#6366f1" },
  lower:    { label: "Borne basse", color: "#6366f180" },
  upper:    { label: "Borne haute", color: "#6366f180" },
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const items = payload.filter((p) => p.value != null && LABEL_MAP[p.dataKey]);
  if (!items.length) return null;
  return (
    <div className="bg-zinc-900/95 border border-white/10 rounded-lg px-3 py-2.5 text-xs shadow-xl backdrop-blur-sm">
      <p className="text-zinc-400 mb-1.5 font-medium">{label}</p>
      {items.map((item) => {
        const meta = LABEL_MAP[item.dataKey];
        return (
          <p key={item.dataKey} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
            <span className="text-zinc-300">{meta.label}</span>
            <span className="ml-auto font-semibold text-white">{Math.round(item.value).toLocaleString("fr-FR")}</span>
          </p>
        );
      })}
    </div>
  );
}

// Index of the junction month (last actual = first forecast): "déc. 24"
const JUNCTION_INDEX = 23;

export function HeroChart() {
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-semibold text-white">Prévisions 2025</h3>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-semibold">
          Fiabilité 91.8/100
        </span>
      </div>

      <div
        role="img"
        aria-label="Graphique de prévisions 2025 montrant les valeurs réelles et prévues avec intervalles de confiance"
      >
        <span className="sr-only">
          Graphique de prévisions pour l'année 2025. Affiche les données réelles historiques en gris et les prévisions futures en indigo avec des intervalles de confiance.
        </span>
        <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={forecastData}>
          <defs>
            <linearGradient id="ciBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#52525b"
            fontSize={11}
            tickLine={false}
            interval={5}
          />
          <YAxis
            stroke="#52525b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(v: number) => v.toLocaleString("fr-FR")}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "#52525b", strokeDasharray: "3 3" }}
          />
          {/* Confidence interval: stacked areas (ciBase transparent + ciBand colored) */}
          <Area
            type="monotone"
            dataKey="ciBase"
            stackId="ci"
            stroke="none"
            fill="transparent"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="ciBand"
            stackId="ci"
            stroke="none"
            fill="url(#ciBand)"
            fillOpacity={1}
            isAnimationActive={false}
          />
          {/* Actual line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#a1a1aa"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          {/* Forecast line */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            strokeDasharray="6 4"
            connectNulls={false}
          />
          {/* Junction vertical marker */}
          <ReferenceLine
            x={forecastData[JUNCTION_INDEX].date}
            stroke="#6366f1"
            strokeDasharray="3 3"
            strokeOpacity={0.4}
          />
        </ComposedChart>
      </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <MetricMini label="Séries" value="47" />
        <MetricMini label="Méthode" value="AutoARIMA" />
        <MetricMini label="Horizon" value="12 mois" />
      </div>
    </>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[11px] text-zinc-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
