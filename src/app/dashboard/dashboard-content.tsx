"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LineChart,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Gauge,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { StatCard, EmptyDashboard } from "@/components/dashboard";
import { ActionCard } from "@/components/dashboard/action-card";
import { QuotaProgress } from "@/components/charts";
import { ScoreTrendChart } from "@/components/charts/score-trend-chart";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { cn } from "@/lib/utils";
import type { TrendDataPoint, UrgentActionsData, RecentForecastItem } from "@/lib/queries/dashboard";

interface DashboardContentProps {
  stats: {
    userName: string;
    forecastsThisMonth: number;
    avgChampionScore: number;
    latestScore: number | null;
    previousScore: number | null;
    lastForecastAt: string | null;
    daysUntilReset: number;
    quota: { used: number; limit: number; plan: string };
  };
  trendData: TrendDataPoint[];
  urgentActions: UrgentActionsData;
  recentForecasts: RecentForecastItem[];
}

function formatDuration(seconds: number | null): string {
  if (seconds == null || seconds <= 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function getScoreColor(score: number | null): string {
  if (score == null) return "text-zinc-500";
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function getScoreBg(score: number | null): string {
  if (score == null) return "bg-zinc-500/10";
  if (score >= 80) return "bg-emerald-500/10";
  if (score >= 60) return "bg-amber-500/10";
  return "bg-red-500/10";
}

function getScoreVariant(score: number): "success" | "warning" | "default" {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "default";
}

export function DashboardContent({
  stats,
  trendData,
  urgentActions,
  recentForecasts,
}: DashboardContentProps) {
  const router = useRouter();

  const lastForecastText = stats.lastForecastAt
    ? `Derniere prevision ${formatDistanceToNow(parseISO(stats.lastForecastAt), { addSuffix: true, locale: fr })}`
    : null;

  // Calcul tendance score : dernier run vs avant-dernier run
  const scoreTrend = (() => {
    if (stats.latestScore == null || stats.previousScore == null) return undefined;
    const delta = stats.latestScore - stats.previousScore;
    if (Math.abs(delta) < 0.1) return undefined;
    return {
      value: `${delta > 0 ? "+" : ""}${delta.toFixed(1)} vs precedent`,
      direction: delta > 0 ? "up" as const : "down" as const,
      isGood: true,
    };
  })();

  // Actions subtitle
  const actionsSubtitle = urgentActions.total === 0
    ? "Aucune action en attente"
    : [
        urgentActions.counts.urgent > 0 ? `${urgentActions.counts.urgent} urgente${urgentActions.counts.urgent > 1 ? "s" : ""}` : null,
        urgentActions.counts.warning > 0 ? `${urgentActions.counts.warning} a verifier` : null,
      ].filter(Boolean).join(" · ");

  // Quota percentage for variant
  const quotaPercentage = stats.quota.limit > 0 ? (stats.quota.used / stats.quota.limit) * 100 : 0;

  // Empty state
  if (recentForecasts.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div className="space-y-8">
      {/* Row 1 — Header personnalise */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Bonjour {stats.userName}
            </h1>
            <p className="text-zinc-400 mt-1">
              {lastForecastText ?? "Lancez votre premiere prevision"}
            </p>
          </div>
          <Link href="/dashboard/forecast">
            <Button className="bg-indigo-500 hover:bg-indigo-600 glow-accent">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle prevision
            </Button>
          </Link>
        </div>
      </FadeIn>

      {/* Row 2 — 4 Stat Cards */}
      <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem>
          <StatCard
            label="Score de fiabilite"
            value={`${stats.avgChampionScore.toFixed(1)}`}
            icon={TrendingUp}
            subtitle="/100 · Moyenne des 10 derniers jobs"
            variant={getScoreVariant(stats.avgChampionScore)}
            trend={scoreTrend}
            helpKey="championScore"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Actions a traiter"
            value={urgentActions.total}
            icon={urgentActions.counts.urgent > 0 ? AlertTriangle : CheckCircle2}
            subtitle={actionsSubtitle}
            variant={urgentActions.counts.urgent > 0 ? "warning" : urgentActions.total === 0 ? "success" : "default"}
            href="/dashboard/actions"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Previsions ce mois"
            value={stats.forecastsThisMonth}
            icon={LineChart}
            subtitle={lastForecastText ? `Derniere : ${formatDistanceToNow(parseISO(stats.lastForecastAt!), { addSuffix: true, locale: fr })}` : undefined}
            href="/dashboard/history"
          />
        </StaggerItem>
        <StaggerItem>
          <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-white/5 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-xl bg-indigo-500/10">
                <Gauge className="w-5 h-5 text-indigo-400" />
              </div>
              {quotaPercentage >= 85 && (
                <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {quotaPercentage.toFixed(0)}%
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <p className="text-sm text-zinc-400">Quota</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {stats.quota.used}<span className="text-zinc-500 text-lg font-normal">/{stats.quota.limit}</span>
              </p>
              <QuotaProgress
                used={stats.quota.used}
                total={stats.quota.limit}
                label={`Plan ${stats.quota.plan}`}
                size="sm"
              />
              <p className="text-xs text-zinc-500">
                Reset dans {stats.daysUntilReset}j
              </p>
            </div>
          </div>
        </StaggerItem>
      </StaggerChildren>

      {/* Row 3 — Evolution fiabilite + Actions prioritaires */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Trend chart */}
        <FadeIn delay={0.2} className="lg:col-span-3">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-white">Evolution de la fiabilite</h2>
              <HelpTooltip termKey="championScore" />
            </div>
            <p className="text-sm text-zinc-500 mb-4">10 dernieres analyses</p>
            <ScoreTrendChart data={trendData} height={250} />
          </div>
        </FadeIn>

        {/* Priority actions */}
        <FadeIn delay={0.3} className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Actions prioritaires</h2>
              {urgentActions.total > 0 && (
                <span className="text-xs font-medium text-white bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full tabular-nums">
                  {urgentActions.total}
                </span>
              )}
            </div>

            <div className="flex-1">
              {urgentActions.topActions.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2.5">
                    {urgentActions.topActions.map((action) => (
                      <ActionCard
                        key={action.id}
                        action={action}
                        compact
                        onNavigate={(seriesId, jobId) => {
                          router.push(`/dashboard/results/series?job=${jobId}&series=${seriesId}`);
                        }}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="rounded-full bg-emerald-500/10 p-3">
                    <CheckCircle2 className="text-emerald-400" size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300">Aucune action requise</p>
                    <p className="text-xs text-zinc-500 mt-1">Toutes vos previsions sont dans les clous</p>
                  </div>
                </div>
              )}
            </div>

            {urgentActions.total > 0 && (
              <Link
                href="/dashboard/actions"
                className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Voir toutes les actions
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Row 4 — Dernieres previsions */}
      <FadeIn delay={0.4}>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Dernieres previsions</h2>
            <Link
              href="/dashboard/history"
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-12 gap-3 px-4 pb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <div className="col-span-4">Fichier</div>
            <div className="col-span-1 text-center">Series</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-1 text-center">Duree</div>
            <div className="col-span-2 text-center">Actions</div>
            <div className="col-span-2 text-right">Date</div>
          </div>

          {/* Table rows */}
          <div className="space-y-2">
            {recentForecasts.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
              >
                <Link href={`/dashboard/results?job=${job.id}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors group">
                    {/* Fichier */}
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        job.status === "completed" ? "bg-emerald-400" : job.status === "failed" ? "bg-red-400" : "bg-amber-400"
                      )} />
                      <span className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors truncate">
                        {job.filename ?? "Sans nom"}
                      </span>
                    </div>

                    {/* Series */}
                    <div className="sm:col-span-1 text-center">
                      <span className="text-sm text-zinc-400 tabular-nums">{job.seriesCount}</span>
                    </div>

                    {/* Score */}
                    <div className="sm:col-span-2 flex justify-center">
                      {job.score != null ? (
                        <span className={cn(
                          "text-sm font-semibold tabular-nums px-2.5 py-0.5 rounded-md",
                          getScoreColor(job.score),
                          getScoreBg(job.score),
                        )}>
                          {job.score.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-sm text-zinc-600">—</span>
                      )}
                    </div>

                    {/* Duree */}
                    <div className="sm:col-span-1 text-center">
                      <span className="text-xs text-zinc-500 tabular-nums">{formatDuration(job.duration)}</span>
                    </div>

                    {/* Actions */}
                    <div className="sm:col-span-2 flex justify-center gap-1.5">
                      {job.actions.total === 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                      ) : (
                        <>
                          {job.actions.urgent > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                              {job.actions.urgent}
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                            </span>
                          )}
                          {job.actions.warning > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {job.actions.warning}
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Date */}
                    <div className="sm:col-span-2 text-right flex items-center justify-end gap-2">
                      <span className="text-xs text-zinc-500">
                        {job.createdAt
                          ? formatDistanceToNow(parseISO(job.createdAt), { addSuffix: true, locale: fr })
                          : "—"
                        }
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
