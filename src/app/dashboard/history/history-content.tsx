"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Clock,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThresholds } from "@/lib/thresholds/context";
import type { HistoryJob } from "@/lib/queries/dashboard";

interface HistoryContentProps {
  jobs: HistoryJob[];
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

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const rounded = Math.round(seconds);
  if (rounded < 60) return `${rounded}s`;
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}m ${secs}s`;
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold">
          <CheckCircle2 size={12} />
          Terminé
        </span>
      );
    case "processing":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold">
          <Loader2 size={12} className="animate-spin" />
          En cours
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-semibold">
          <AlertCircle size={12} />
          Échec
        </span>
      );
    case "pending":
    case "queued":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-500/10 text-zinc-400 rounded-full text-xs font-semibold">
          <Clock size={12} />
          En attente
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 bg-zinc-500/10 text-zinc-500 rounded-full text-xs font-semibold">
          {status}
        </span>
      );
  }
}

function ChampionScoreBadge({ score, green, yellow }: { score: number | null; green: number; yellow: number }) {
  if (score == null) return <span className="text-zinc-600">—</span>;
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-semibold",
        score >= green
          ? "bg-emerald-500/10 text-emerald-500"
          : score >= yellow
            ? "bg-amber-500/10 text-amber-400"
            : "bg-red-500/10 text-red-400"
      )}
    >
      {score.toFixed(1)}
    </span>
  );
}

export function HistoryContent({ jobs }: HistoryContentProps) {
  const { thresholds } = useThresholds();
  const reliabilityGreen = thresholds.reliability_score.green_max;
  const reliabilityYellow = thresholds.reliability_score.yellow_max;

  if (jobs.length === 0) {
    return (
      <div className="animate-fade">
        <div className="mb-8">
          <h1 className="dash-page-title mb-2">Historique</h1>
          <p className="text-zinc-400">Toutes vos prévisions passées</p>
        </div>

        <div className="dash-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Inbox size={28} className="text-zinc-600" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Aucune prévision
          </h2>
          <p className="text-zinc-400 mb-6">
            Lancez votre première prévision pour la voir apparaître ici.
          </p>
          <Link href="/dashboard/forecast">
            <Button>Nouvelle prévision</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h1 className="dash-page-title mb-2">Historique</h1>
        <p className="text-zinc-400">
          Toutes vos prévisions passées ({jobs.length} analyse{jobs.length > 1 ? "s" : ""})
        </p>
      </div>

      <div className="dash-card overflow-hidden">
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
                  Statut
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-white/[0.08] hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-zinc-500 shrink-0" />
                      <span className="font-medium text-white truncate max-w-[250px]">
                        {job.filename ?? "Sans nom"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400 text-sm whitespace-nowrap">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-zinc-300 text-sm">
                    {job.seriesCount}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-5 py-4">
                    <ChampionScoreBadge score={job.championScore} green={reliabilityGreen} yellow={reliabilityYellow} />
                  </td>
                  <td className="px-5 py-4 text-zinc-400 text-sm whitespace-nowrap">
                    {formatDuration(job.duration)}
                  </td>
                  <td className="px-5 py-4">
                    {job.status === "completed" && (
                      <Link href={`/dashboard/results?job=${job.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Eye size={14} />
                          Voir
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <p className="text-sm text-zinc-500">
          Affichage de {jobs.length} résultat{jobs.length > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
