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
  ReferenceArea,
} from "recharts";
import { forecastData } from "@/lib/mock-data";

const LABEL_MAP: Record<string, { label: string; color: string }> = {
  actual:   { label: "Réel",      color: "#141414" },
  forecast: { label: "Prévision", color: "#B45309" },
  lower:    { label: "Borne basse", color: "#B4530980" },
  upper:    { label: "Borne haute", color: "#B4530980" },
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const items = payload.filter((p) => p.value != null && LABEL_MAP[p.dataKey]);
  if (!items.length) return null;
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-xs shadow-[var(--shadow-card)]">
      <p className="text-[var(--color-text-tertiary)] mb-1.5 font-medium">{label}</p>
      {items.map((item) => {
        const meta = LABEL_MAP[item.dataKey];
        return (
          <p key={item.dataKey} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
            <span className="text-[var(--color-text-secondary)]">{meta.label}</span>
            <span className="ml-auto font-semibold text-[var(--color-text)]">{Math.round(item.value).toLocaleString("fr-FR")}</span>
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
        <h3 className="text-base font-semibold text-[var(--color-text)]">Prévisions 2025</h3>
        <span className="px-3 py-1 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-full text-xs font-semibold">
          Fiabilité 91.8/100
        </span>
      </div>

      <div
        role="img"
        aria-label="Graphique de prévisions 2025 montrant les valeurs réelles et prévues avec intervalles de confiance"
      >
        <span className="sr-only">
          Graphique de prévisions pour l'année 2025. Affiche les données réelles historiques et les prévisions futures en cuivre avec des intervalles de confiance.
        </span>
        <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={forecastData}>
          <defs>
            <linearGradient id="ciBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B45309" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#B45309" stopOpacity={0.03} />
            </linearGradient>
            {/* Dot grid — zone de prévision (Brand Device #4) */}
            <pattern id="hero-dot-grid" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.5" fill="#8A8A82" opacity="0.35" />
            </pattern>
          </defs>
          <CartesianGrid stroke="var(--color-chart-grid)" strokeWidth={0.5} vertical={false} />
          <XAxis
            dataKey="date"
            stroke="var(--color-border-med)"
            fontSize={11}
            tickLine={false}
            interval={5}
          />
          <YAxis
            stroke="var(--color-border-med)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(v: number) => v.toLocaleString("fr-FR")}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "var(--color-border-med)", strokeDasharray: "3 3" }}
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
            stroke="var(--color-chart-actual)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          {/* Forecast line */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="var(--color-chart-forecast)"
            strokeWidth={2}
            dot={false}
            strokeDasharray="6 3"
            connectNulls={false}
          />
          {/* Dot grid — zone de prévision (Brand Device #4) */}
          <ReferenceArea
            x1={forecastData[JUNCTION_INDEX].date}
            fill="url(#hero-dot-grid)"
            fillOpacity={1}
            stroke="none"
            ifOverflow="hidden"
          />

          {/* Junction vertical marker */}
          <ReferenceLine
            x={forecastData[JUNCTION_INDEX].date}
            stroke="var(--color-chart-forecast)"
            strokeWidth={2}
            strokeOpacity={0.6}
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
      <p className="text-[11px] text-[var(--color-text-tertiary)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[var(--color-text)]">{value}</p>
    </div>
  );
}
