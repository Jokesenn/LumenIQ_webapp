"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  FileText,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MetricGaugeCard,
  AnimatedAreaChart,
  ModelPerformanceChart,
  AbcXyzMatrix,
} from "@/components/charts";
import { SeriesList, SynthesisCard, SeriesSortDropdown } from "@/components/dashboard";
import { AlertsSummaryCard } from "@/components/dashboard/AlertsSummaryCard";
import { RESULTS_TAB_EVENT } from "@/components/dashboard/command-palette";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";
import { useSeriesNavigation } from "@/hooks/useSeriesNavigation";

function formatDistanceToNow(date: Date): string {
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

type TabType = "overview" | "series" | "models" | "synthesis";

interface ResultsContentProps {
  job: any;
  summary: any;
  metrics: any;
  topPerformers: any[];
  bottomPerformers: any[];
  allSeries: any[];
  chartData: any[];
  abcXyzData: any[];
  modelPerformance: any[];
  synthesis: any;
  initialTab?: TabType;
}

export function ResultsContent({
  job,
  summary,
  metrics,
  topPerformers,
  bottomPerformers,
  allSeries,
  chartData,
  abcXyzData,
  modelPerformance,
  synthesis,
  initialTab,
}: ResultsContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab ?? "overview");
  const [selectedCell, setSelectedCell] = useState<{ abc: string; xyz: string } | null>(null);

  // Sync tab when navigating from another page via URL (?tab=...)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Listen for command palette tab-switch events (same-page, no server round-trip)
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent<string>).detail;
      const valid: TabType[] = ["overview", "series", "models", "synthesis"];
      if (valid.includes(tab as TabType)) {
        setActiveTab(tab as TabType);
      }
    };
    window.addEventListener(RESULTS_TAB_EVENT, handler);
    return () => window.removeEventListener(RESULTS_TAB_EVENT, handler);
  }, []);

  const seriesNav = useSeriesNavigation({
    allSeries,
    jobId: job?.id ?? "",
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "series", label: "Séries" },
    { id: "models", label: "Modèles" },
    { id: "synthesis", label: "Synthèse IA" },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/history">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{job?.filename ?? "—"}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {job?.created_at
                    ? formatDistanceToNow(new Date(job.created_at))
                    : "—"}
                </span>
                {summary?.duration_sec != null && summary.duration_sec > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(summary.duration_sec)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {metrics?.n_series_total ?? 0} séries
                </span>
              </div>
            </div>
          </div>

          <Button className="bg-indigo-500 hover:bg-indigo-600">
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1}>
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-indigo-500 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Tab Content - toujours le même arbre de composants pour éviter "Rendered more hooks" */}
      <div className={cn(activeTab !== "overview" && "hidden")}>
        <div className="space-y-6">
          {/* Metric Gauges */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <MetricGaugeCard
                label="WAPE"
                value={metrics?.global_wape ?? 0}
                description="Weighted Absolute Percentage Error"
                thresholds={{ good: 10, warning: 20 }}
                delay={0}
              />
              {metrics?.global_smape != null && (
                <MetricGaugeCard
                  label="SMAPE"
                  value={metrics.global_smape}
                  description="Symmetric MAPE"
                  thresholds={{ good: 10, warning: 20 }}
                  delay={0.1}
                />
              )}
              {metrics?.global_mape != null && (
                <MetricGaugeCard
                  label="MAPE"
                  value={metrics.global_mape}
                  description="Mean Absolute Percentage Error"
                  thresholds={{ good: 15, warning: 25 }}
                  delay={0.2}
                />
              )}
              <MetricGaugeCard
                label="BIAS"
                value={Math.abs(metrics?.global_bias_pct ?? 0)}
                unit="%"
                description={(metrics?.global_bias_pct ?? 0) >= 0 ? "Sur-estimation" : "Sous-estimation"}
                thresholds={{ good: 5, warning: 10 }}
                delay={0.3}
              />
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">
                    {metrics?.n_series_success ?? 0}
                    <span className="text-lg text-zinc-500">/{metrics?.n_series_total ?? 0}</span>
                  </p>
                  <p className="text-sm text-zinc-400 mt-2">Séries réussies</p>
                  {(metrics?.n_series_failed ?? 0) > 0 && (
                    <p className="text-xs text-red-400 mt-1">
                      {metrics.n_series_failed} échecs
                    </p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Main Chart */}
          <FadeIn delay={0.3}>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-6">
                Forecast vs Réel (agrégé)
              </h2>
              <div className={cn(chartData.length === 0 && "hidden")}>
                <AnimatedAreaChart data={chartData.length > 0 ? chartData : [{ date: "", actual: 0 }]} height={350} showConfidence />
              </div>
              <div className={cn("h-[350px] flex items-center justify-center text-zinc-500", chartData.length > 0 && "hidden")}>
                Aucune donnée disponible
              </div>
            </div>
          </FadeIn>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top/Bottom Performers */}
            <FadeIn delay={0.4} className="lg:col-span-2">
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                <div className="grid grid-cols-2 gap-6">
                  <SeriesList
                    series={topPerformers}
                    jobId={job?.id ?? ""}
                    variant="top"
                    title="Top performers"
                    emptyMessage="Aucune donnée"
                  />
                  <SeriesList
                    series={bottomPerformers}
                    jobId={job?.id ?? ""}
                    variant="bottom"
                    title="À surveiller"
                    emptyMessage="Aucune donnée"
                  />
                </div>
              </div>
            </FadeIn>

            {/* Alerts Summary */}
            <FadeIn delay={0.45}>
              <AlertsSummaryCard
                seriesList={allSeries.map((s: any) => ({
                  smape: s.smape,
                  was_gated: s.was_gated,
                  drift_detected: s.drift_detected,
                  is_first_run: s.is_first_run,
                  previous_champion: s.previous_champion,
                  champion_model: s.champion_model,
                }))}
                onFilterAlerts={() => setActiveTab("series")}
              />
            </FadeIn>
          </div>

          {/* ABC/XYZ Matrix */}
          <FadeIn delay={0.5}>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-6">
                Classification ABC/XYZ
              </h2>
              <AbcXyzMatrix
                data={abcXyzData}
                selectedCell={selectedCell}
                onCellClick={(abc, xyz) => {
                  setSelectedCell({ abc, xyz });
                  setActiveTab("series");
                }}
              />
            </div>
          </FadeIn>
        </div>
      </div>

      <div className={cn(activeTab !== "series" && "hidden")}>
        <FadeIn>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Toutes les séries</h2>
              <div className="flex items-center gap-2">
                {selectedCell && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCell(null)}
                    className="text-zinc-400"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtre: {selectedCell.abc}-{selectedCell.xyz}
                    <span className="ml-2">×</span>
                  </Button>
                )}
                <SeriesSortDropdown
                  value={seriesNav.sortOption}
                  onChange={seriesNav.setSortOption}
                />
              </div>
            </div>
            <SeriesList
              series={
                selectedCell
                  ? seriesNav.sortedSeries.filter(
                      (s) => s.abc_class === selectedCell.abc && s.xyz_class === selectedCell.xyz
                    )
                  : seriesNav.sortedSeries
              }
              jobId={job?.id ?? ""}
              variant="default"
            />
          </div>
        </FadeIn>
      </div>

      <div className={cn(activeTab !== "models" && "hidden")}>
        <FadeIn>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-6">
              Performance des modèles
            </h2>
            <ModelPerformanceChart data={modelPerformance} />
          </div>
        </FadeIn>
      </div>

      <div className={cn(activeTab !== "synthesis" && "hidden")}>
        <FadeIn>
          <SynthesisCard
            synthesis={synthesis}
            jobId={job?.id}
            skuList={allSeries.map((s: any) => s.series_id as string)}
          />
        </FadeIn>
      </div>
    </div>
  );
}
