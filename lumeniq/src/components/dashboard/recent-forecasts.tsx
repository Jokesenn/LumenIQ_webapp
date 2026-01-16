"use client";

import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { recentForecasts } from "@/lib/mock-data";

export function RecentForecasts() {
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
        {recentForecasts.map((item) => (
          <Link
            key={item.id}
            href="/dashboard/results"
            className="flex items-center justify-between p-4 bg-[var(--bg-surface)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
                <FileText size={18} className="text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {item.date} • {item.series} séries
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-[var(--success)]/20 text-[var(--success)] rounded-full text-xs font-semibold">
              SMAPE {item.smape}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
