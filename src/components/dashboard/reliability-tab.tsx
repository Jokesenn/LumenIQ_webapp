"use client";

import { useMemo } from "react";
import { FadeIn } from "@/components/animations";
import { ReliabilityBubbleChart } from "@/components/charts/reliability-bubble-chart";
import { ReliabilityFamilyViz } from "@/components/charts/reliability-family-viz";
import { ReliabilityDetailTable } from "@/components/dashboard/reliability-detail-table";
import {
  computeEnrichedModels,
  computeReliabilitySummary,
  computeFamilyAggregations,
} from "@/lib/reliability-utils";

interface ReliabilityTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allSeries: Record<string, any>[];
  onModelClick: (modelName: string) => void;
}

export function ReliabilityTab({ allSeries, onModelClick }: ReliabilityTabProps) {
  const enrichedModels = useMemo(() => computeEnrichedModels(allSeries), [allSeries]);

  const summary = useMemo(
    () => computeReliabilitySummary(enrichedModels, allSeries.length),
    [enrichedModels, allSeries.length],
  );

  const familyAggregations = useMemo(
    () => computeFamilyAggregations(enrichedModels, allSeries.length),
    [enrichedModels, allSeries.length],
  );

  const globalAvgScore = useMemo(() => {
    if (enrichedModels.length === 0) return 0;
    let totalScore = 0;
    let totalCount = 0;
    for (const m of enrichedModels) {
      if (m.avgScore > 0) {
        totalScore += m.avgScore * m.seriesCount;
        totalCount += m.seriesCount;
      }
    }
    return totalCount > 0 ? Math.round(totalScore / totalCount) : 0;
  }, [enrichedModels]);

  if (allSeries.length === 0) {
    return (
      <FadeIn>
        <div className="dash-card p-6">
          <div className="h-[200px] flex items-center justify-center text-zinc-500">
            Aucune donnée de fiabilité disponible
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title + Headline summary — gradient card like SynthesisCard */}
      <FadeIn delay={0.1}>
        <div className="dash-card-accent p-6">
          <h2 className="dash-section-title mb-2">
            Fiabilité des prévisions
          </h2>
          <p className="text-sm text-white/70">
            <span className="text-white font-semibold">{summary.totalModels}</span> méthodes
            ont été testées. Les{" "}
            <span className="text-white font-semibold">{summary.coveringModels}</span> meilleures
            couvrent{" "}
            <span className="text-indigo-400 font-semibold">{summary.coveragePercent}%</span> de
            vos produits avec un score moyen de{" "}
            <span className="text-emerald-400 font-semibold">{summary.weightedAvgScore}/100</span>.
          </p>
        </div>
      </FadeIn>

      {/* Two-column: Bubble Chart + Donut/Treemap */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 dash-card p-6">
            <ReliabilityBubbleChart data={enrichedModels} />
          </div>
          <div className="lg:col-span-2 dash-card p-6">
            <ReliabilityFamilyViz
              families={familyAggregations}
              globalAvgScore={globalAvgScore}
            />
          </div>
        </div>
      </FadeIn>

      {/* Detail Table */}
      <FadeIn delay={0.3}>
        <div className="dash-card p-6">
          <ReliabilityDetailTable
            data={enrichedModels}
            onModelClick={onModelClick}
          />
        </div>
      </FadeIn>
    </div>
  );
}
