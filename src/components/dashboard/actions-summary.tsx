"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { ActionsSummary } from "@/types/actions";

interface ActionsSummaryCardProps {
  summary: ActionsSummary | null;
  loading?: boolean;
}

export function ActionsSummaryCard({ summary, loading }: ActionsSummaryCardProps) {
  if (loading) {
    return (
      <div className="dash-card p-5 space-y-3">
        <Skeleton className="w-32 h-5 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />
        <Skeleton className="w-5/6 h-4 rounded" />
      </div>
    );
  }

  if (!summary?.lines?.length) return null;

  return (
    <div className="dash-card p-5">
      <h3 className="text-sm font-semibold font-display text-white/60 uppercase tracking-wider mb-3">
        Résumé
      </h3>
      <ul className="space-y-2">
        {summary.lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
            <span className="shrink-0 mt-0.5">{line.icon}</span>
            <span>{line.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
