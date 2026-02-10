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
} from "recharts";
import { forecastData } from "@/lib/mock-data";

export function HeroChart() {
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-semibold text-white">Prévision T1 2025</h3>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-semibold">
          Fiabilité 91.8/100
        </span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={forecastData}>
          <defs>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="#6366f1"
            fillOpacity={0.15}
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#18181b"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#a1a1aa"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <MetricMini label="Séries" value="47" />
        <MetricMini label="Méthode" value="Auto-régressif" />
        <MetricMini label="Horizon" value="12 sem" />
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
