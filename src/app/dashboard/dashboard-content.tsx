"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  LineChart,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard";
import {
  QuotaProgress,
  AnimatedAreaChart,
  ModelPerformanceChart,
  AbcXyzMatrix,
} from "@/components/charts";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffSec < 60) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHour < 24) return `il y a ${diffHour}h`;
  if (diffDay < 7) return `il y a ${diffDay}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

interface DashboardContentProps {
  stats: {
    totalSeries: number;
    forecastsThisMonth: number;
    avgWape: number;
    avgDuration: number;
    quota: {
      used: number;
      limit: number;
      plan: string;
    };
  };
  modelPerformance: Array<{
    model: string;
    count: number;
    percentage: number;
    avgWape?: number;
  }>;
  abcXyzData: Array<{
    abc: "A" | "B" | "C";
    xyz: "X" | "Y" | "Z";
    count: number;
    percentage: number;
  }>;
  chartData: Array<{
    date: string;
    actual?: number;
    forecast?: number;
    forecastLower?: number;
    forecastUpper?: number;
  }>;
  recentForecasts: Array<{
    id: string;
    filename: string | null;
    status: string;
    createdAt: string | null;
    seriesCount: number;
    wape?: number;
  }>;
}

export function DashboardContent({
  stats,
  modelPerformance,
  abcXyzData,
  chartData,
  recentForecasts,
}: DashboardContentProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
            <p className="text-zinc-400 mt-1">
              Vue d&apos;ensemble de vos prévisions
            </p>
          </div>
          <Link href="/dashboard/forecast">
            <Button className="bg-indigo-500 hover:bg-indigo-600 glow-accent">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Forecast
            </Button>
          </Link>
        </div>
      </FadeIn>

      {/* Stats + Quota */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-4">
          <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerItem>
              <StatCard
                label="Séries analysées"
                value={stats.totalSeries}
                icon={BarChart3}
                trend={{ value: "+124", direction: "up", isGood: true }}
                subtitle="Total cumulé"
                variant="default"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label="Forecasts ce mois"
                value={stats.forecastsThisMonth}
                icon={LineChart}
                trend={{ value: "+3", direction: "up", isGood: true }}
                href="/dashboard/history"
                variant="default"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label="WAPE moyen"
                value={`${stats.avgWape.toFixed(1)}%`}
                icon={TrendingUp}
                trend={{ value: "-1.3%", direction: "down", isGood: true }}
                subtitle="Sur les 10 derniers jobs"
                variant={stats.avgWape < 10 ? "success" : stats.avgWape < 20 ? "warning" : "default"}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label="Temps moyen"
                value={formatDuration(stats.avgDuration)}
                icon={Clock}
                trend={{ value: "-12s", direction: "down", isGood: true }}
                variant="default"
              />
            </StaggerItem>
          </StaggerChildren>
        </div>

        {/* Quota Card */}
        <FadeIn delay={0.4}>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 h-full flex flex-col justify-center">
            <div className="text-sm text-zinc-400 mb-1">Plan {stats.quota.plan}</div>
            <QuotaProgress
              used={stats.quota.used}
              total={stats.quota.limit}
              label="Séries ce mois"
            />
          </div>
        </FadeIn>
      </div>

      {/* Main Chart */}
      <FadeIn delay={0.3}>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Forecast vs Réel</h2>
              <p className="text-sm text-zinc-400">Dernier job - données agrégées</p>
            </div>
            <div className="flex gap-2">
              {["3M", "6M", "12M", "All"].map((period) => (
                <button
                  key={period}
                  className={cn(
                    "px-3 py-1 text-sm rounded-lg transition-colors",
                    period === "All"
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "text-zinc-400 hover:bg-white/5"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <AnimatedAreaChart data={chartData} height={350} showConfidence />
          ) : (
            <div className="h-[350px] flex items-center justify-center text-zinc-500">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </FadeIn>

      {/* Bottom Grid: Model Performance + ABC/XYZ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <FadeIn delay={0.4}>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-6">
              Performance des modèles
            </h2>
            {modelPerformance.length > 0 ? (
              <ModelPerformanceChart data={modelPerformance} />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-zinc-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </FadeIn>

        {/* ABC/XYZ Matrix */}
        <FadeIn delay={0.5}>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-6">
              Classification ABC/XYZ
            </h2>
            {abcXyzData.length > 0 ? (
              <AbcXyzMatrix
                data={abcXyzData}
                onCellClick={(abc, xyz) => {
                  // TODO: Navigate to filtered results
                  console.log(`Filter: ${abc}-${xyz}`);
                }}
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-zinc-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Recent Forecasts */}
      <FadeIn delay={0.6}>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Forecasts récents</h2>
            <Link
              href="/dashboard/history"
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentForecasts.length > 0 ? (
            <div className="space-y-3">
              {recentForecasts.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/dashboard/results?job=${job.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            job.status === "completed"
                              ? "bg-emerald-500/10"
                              : job.status === "failed"
                                ? "bg-red-500/10"
                                : "bg-amber-500/10"
                          )}
                        >
                          {job.status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : job.status === "failed" ? (
                            <XCircle className="w-5 h-5 text-red-400" />
                          ) : (
                            <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                            {job.filename ?? "Sans nom"}
                          </p>
                          <p className="text-sm text-zinc-500">
                            {job.seriesCount} séries •{" "}
                            {formatRelativeTime(job.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {job.wape !== undefined && (
                          <div className="text-right">
                            <p className="text-sm text-zinc-400">WAPE</p>
                            <p
                              className={cn(
                                "font-semibold",
                                job.wape < 10
                                  ? "text-emerald-400"
                                  : job.wape < 20
                                    ? "text-amber-400"
                                    : "text-red-400"
                              )}
                            >
                              {job.wape.toFixed(1)}%
                            </p>
                          </div>
                        )}
                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 mb-4">Aucun forecast pour le moment</p>
              <Link href="/dashboard/forecast">
                <Button className="bg-indigo-500 hover:bg-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer mon premier forecast
                </Button>
              </Link>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
