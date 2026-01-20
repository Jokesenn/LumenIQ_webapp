"use client";

import Link from "next/link";
import { FileText, ChevronRight, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { ForecastJob } from "@/types/database";

interface RecentForecastsProps {
  forecasts: ForecastJob[];
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

function getStatusBadge(status: ForecastJob["status"], smape: number | null) {
  switch (status) {
    case "completed":
      return (
        <span className="px-2.5 py-1 bg-[var(--success)]/20 text-[var(--success)] rounded-full text-xs font-semibold">
          {smape !== null ? `SMAPE ${smape}%` : "Terminé"}
        </span>
      );
    case "processing":
      return (
        <span className="px-2.5 py-1 bg-[var(--accent)]/20 text-[var(--accent)] rounded-full text-xs font-semibold flex items-center gap-1">
          <Loader2 size={12} className="animate-spin" />
          En cours
        </span>
      );
    case "pending":
    case "queued":
      return (
        <span className="px-2.5 py-1 bg-[var(--text-muted)]/20 text-[var(--text-muted)] rounded-full text-xs font-semibold">
          En attente
        </span>
      );
    case "failed":
      return (
        <span className="px-2.5 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-semibold flex items-center gap-1">
          <AlertCircle size={12} />
          Échec
        </span>
      );
    default:
      return null;
  }
}

function getStatusIcon(status: ForecastJob["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle2 size={18} className="text-[var(--success)]" />;
    case "processing":
      return <Loader2 size={18} className="text-[var(--accent)] animate-spin" />;
    case "failed":
      return <AlertCircle size={18} className="text-red-500" />;
    default:
      return <FileText size={18} className="text-[var(--accent)]" />;
  }
}

export function RecentForecasts({ forecasts }: RecentForecastsProps) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-semibold">Derniers forecasts</h2>
        <Link
          href="/dashboard/history"
          className="text-[var(--accent)] text-sm flex items-center gap-1 hover:underline"
        >
          Voir tout <ChevronRight size={16} />
        </Link>
      </div>

      <div className="space-y-3">
        {forecasts.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/results?job=${item.id}`}
            className="flex items-center justify-between p-4 bg-[var(--bg-surface)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
                {getStatusIcon(item.status)}
              </div>
              <div>
                <p className="font-medium text-sm">{item.filename}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {formatDate(item.created_at)} • {item.series_count ?? 0} séries
                </p>
              </div>
            </div>
            {getStatusBadge(item.status, item.avg_smape)}
          </Link>
        ))}
      </div>
    </div>
  );
}
