"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { recentForecasts } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white mb-2">Historique</h1>
        <p className="text-zinc-400">
          Tous vos forecasts passés
        </p>
      </div>

      <div className="bg-zinc-900/50 rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Fichier
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Séries
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  SMAPE
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentForecasts.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/[0.08] hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-zinc-500" />
                      <span className="font-medium text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {item.date}
                  </td>
                  <td className="px-5 py-4 text-zinc-300">{item.series}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-semibold">
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
        <p className="text-sm text-zinc-500">
          Affichage de {recentForecasts.length} résultats
        </p>
      </div>
    </div>
  );
}
