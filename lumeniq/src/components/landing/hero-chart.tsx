"use client";

import {
  AreaChart,
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
        <h3 className="text-base font-semibold">Forecast Q1 2025</h3>
        <span className="px-3 py-1 bg-[var(--success)]/20 text-[var(--success)] rounded-full text-xs font-semibold">
          SMAPE 8.2%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={forecastData}>
          <defs>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="var(--accent-muted)"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="var(--bg-secondary)"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--text-secondary)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="var(--accent)"
            strokeWidth={3}
            dot={false}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <MetricMini label="Séries" value="47" />
        <MetricMini label="Champion" value="AutoARIMA" />
        <MetricMini label="Horizon" value="12 sem" />
      </div>
    </>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[11px] text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
