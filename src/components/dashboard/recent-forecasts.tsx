"use client";

import Link from "next/link";
import { FileText, ChevronRight, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { ForecastJob } from "@/types/database";

export type RecentForecastRow = Pick<ForecastJob, "id" | "filename" | "status"> & {
  created_at?: string | null;
  createdAt?: string | null;
  series_count?: number;
  seriesCount?: number;
  avg_smape?: number | null;
  smape?: number | null;
};

interface RecentForecastsProps {
  forecasts: (ForecastJob | RecentForecastRow)[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadge(status: string, smape: number | null | undefined) {
  switch (status) {
    case "completed":
      return (
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold">
          {smape != null ? `SMAPE ${Number(smape).toFixed(1)}%` : "Terminé"}
        </span>
      );
    case "processing":
      return (
        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <Loader2 size={12} className="animate-spin" />
          En cours
        </span>
      );
    case "pending":
    case "queued":
      return (
        <span className="px-2.5 py-1 bg-zinc-500/10 text-zinc-500 rounded-full text-xs font-semibold">
          En attente
        </span>
      );
    case "failed":
      return (
        <span className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <AlertCircle size={12} />
          Échec
        </span>
      );
    default:
      return null;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 size={18} className="text-emerald-500" />;
    case "processing":
      return <Loader2 size={18} className="text-amber-500 animate-spin" />;
    case "failed":
      return <AlertCircle size={18} className="text-red-500" />;
    default:
      return <FileText size={18} className="text-indigo-400" />;
  }
}

export function RecentForecasts({ forecasts }: RecentForecastsProps) {
  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-semibold text-white">Derniers forecasts</h2>
        <Link
          href="/dashboard/history"
          className="text-indigo-400 text-sm flex items-center gap-1 hover:text-indigo-300 transition-colors"
        >
          Voir tout <ChevronRight size={16} />
        </Link>
      </div>

      <div className="space-y-2">
        {forecasts.map((item) => {
          const created = "created_at" in item ? item.created_at : item.createdAt;
          const seriesCount = "series_count" in item ? item.series_count : item.seriesCount;
          const smape = "avg_smape" in item ? item.avg_smape : item.smape;
          return (
            <Link
              key={item.id}
              href={`/dashboard/results?job=${item.id}`}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  {getStatusIcon(item.status ?? "pending")}
                </div>
                <div>
                  <p className="font-medium text-sm text-white">{item.filename ?? "Sans nom"}</p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(created ?? null)} • {seriesCount ?? 0} séries
                  </p>
                </div>
              </div>
              {getStatusBadge(item.status ?? "pending", smape ?? null)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
