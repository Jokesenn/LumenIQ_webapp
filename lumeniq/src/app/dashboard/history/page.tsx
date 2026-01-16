"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { recentForecasts } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold mb-2">Historique</h1>
        <p className="text-[var(--text-secondary)]">
          Tous vos forecasts passés
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Fichier
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Séries
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  SMAPE
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentForecasts.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--bg-surface)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-[var(--text-muted)]" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">
                    {item.date}
                  </td>
                  <td className="px-5 py-4">{item.series}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-[var(--success)]/20 text-[var(--success)] rounded-full text-xs font-semibold">
                      {item.smape}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link href="/dashboard/results">
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Download size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination placeholder */}
      <div className="mt-6 flex justify-center">
        <p className="text-sm text-[var(--text-muted)]">
          Affichage de {recentForecasts.length} résultats
        </p>
      </div>
    </div>
  );
}
