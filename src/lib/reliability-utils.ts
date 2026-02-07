import { MODEL_LABELS, MODEL_FAMILIES, type ModelFamily } from "./model-labels";

const ABC_WEIGHTS: Record<string, number> = { A: 3, B: 2, C: 1 };

export interface EnrichedModelData {
  technicalName: string;
  label: string;
  family: string;
  familyKey: ModelFamily | "other";
  familyHex: string;
  familyBgClass: string;
  seriesCount: number;
  percentage: number;
  avgScore: number;
  businessWeight: number;
  normalizedBubbleSize: number;
}

export interface ReliabilitySummary {
  totalModels: number;
  coveringModels: number;
  coveragePercent: number;
  weightedAvgScore: number;
}

export interface FamilyAggregation {
  familyKey: ModelFamily | "other";
  family: string;
  hex: string;
  bgClass: string;
  seriesCount: number;
  percentage: number;
  avgScore: number;
}

interface SeriesRow {
  champion_model?: string | null;
  abc_class?: string | null;
  champion_score?: number | null;
}

export function computeEnrichedModels(allSeries: SeriesRow[]): EnrichedModelData[] {
  const totalSeries = allSeries.length;
  if (totalSeries === 0) return [];

  const statsMap = new Map<string, { count: number; totalScore: number; scoredCount: number; businessWeight: number }>();

  for (const s of allSeries) {
    const model = s.champion_model || "unknown";
    let entry = statsMap.get(model);
    if (!entry) {
      entry = { count: 0, totalScore: 0, scoredCount: 0, businessWeight: 0 };
      statsMap.set(model, entry);
    }
    entry.count++;
    if (s.champion_score != null) {
      entry.totalScore += s.champion_score;
      entry.scoredCount++;
    }
    entry.businessWeight += ABC_WEIGHTS[s.abc_class ?? ""] ?? 1;
  }

  const rawModels = Array.from(statsMap.entries()).map(([technicalName, stats]) => {
    const mapping = MODEL_LABELS[technicalName];
    const familyKey: ModelFamily | "other" = mapping?.family ?? "other";
    const familyMeta = mapping ? MODEL_FAMILIES[mapping.family] : null;

    return {
      technicalName,
      label: mapping?.label ?? technicalName,
      family: familyMeta?.label ?? "Autre",
      familyKey,
      familyHex: familyMeta?.hex ?? "#71717a",
      familyBgClass: familyMeta?.bgClass ?? "bg-zinc-500",
      seriesCount: stats.count,
      percentage: (stats.count / totalSeries) * 100,
      avgScore: stats.scoredCount > 0 ? stats.totalScore / stats.scoredCount : 0,
      businessWeight: stats.businessWeight,
      normalizedBubbleSize: 0,
    };
  });

  // Normalize bubble sizes to [30, 100]
  const weights = rawModels.map((m) => m.businessWeight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW;

  for (const m of rawModels) {
    m.normalizedBubbleSize = range > 0 ? 30 + ((m.businessWeight - minW) / range) * 70 : 65;
  }

  return rawModels.sort((a, b) => b.percentage - a.percentage);
}

export function computeReliabilitySummary(
  enrichedModels: EnrichedModelData[],
  totalSeries: number,
): ReliabilitySummary {
  if (enrichedModels.length === 0 || totalSeries === 0) {
    return { totalModels: 0, coveringModels: 0, coveragePercent: 0, weightedAvgScore: 0 };
  }

  const sorted = [...enrichedModels].sort((a, b) => b.seriesCount - a.seriesCount);

  let cumCount = 0;
  let coveringModels = 0;
  let weightedScoreSum = 0;
  let weightedCountSum = 0;
  const threshold = totalSeries * 0.75;

  for (const m of sorted) {
    cumCount += m.seriesCount;
    coveringModels++;
    weightedScoreSum += m.avgScore * m.seriesCount;
    weightedCountSum += m.seriesCount;
    if (cumCount >= threshold) break;
  }

  return {
    totalModels: enrichedModels.length,
    coveringModels,
    coveragePercent: Math.round((cumCount / totalSeries) * 100),
    weightedAvgScore: weightedCountSum > 0 ? Math.round(weightedScoreSum / weightedCountSum) : 0,
  };
}

export function computeFamilyAggregations(
  enrichedModels: EnrichedModelData[],
  totalSeries: number,
): FamilyAggregation[] {
  if (enrichedModels.length === 0 || totalSeries === 0) return [];

  const familyMap = new Map<string, { seriesCount: number; totalScore: number; scoredCount: number; familyKey: ModelFamily | "other"; hex: string; bgClass: string; label: string }>();

  for (const m of enrichedModels) {
    let entry = familyMap.get(m.family);
    if (!entry) {
      entry = { seriesCount: 0, totalScore: 0, scoredCount: 0, familyKey: m.familyKey, hex: m.familyHex, bgClass: m.familyBgClass, label: m.family };
      familyMap.set(m.family, entry);
    }
    entry.seriesCount += m.seriesCount;
    if (m.avgScore > 0) {
      entry.totalScore += m.avgScore * m.seriesCount;
      entry.scoredCount += m.seriesCount;
    }
  }

  return Array.from(familyMap.values())
    .map((f) => ({
      familyKey: f.familyKey,
      family: f.label,
      hex: f.hex,
      bgClass: f.bgClass,
      seriesCount: f.seriesCount,
      percentage: (f.seriesCount / totalSeries) * 100,
      avgScore: f.scoredCount > 0 ? f.totalScore / f.scoredCount : 0,
    }))
    .sort((a, b) => b.seriesCount - a.seriesCount);
}
