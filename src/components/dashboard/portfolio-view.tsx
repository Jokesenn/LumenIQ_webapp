"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { getModelMeta } from "@/lib/model-labels";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { FadeIn } from "@/components/animations";
import { useThresholds } from "@/lib/thresholds/context";

// ============================================================
// TYPES
// ============================================================

interface SeriesData {
  series_id: string;
  abc_class: string | null;
  xyz_class: string | null;
  behavior_tags: string[] | null;
  wape: number | null;
  cv: number | null;
  champion_model: string | null;
  champion_score: number | null;
  forecast_sum: number | null;
  forecast_avg: number | null;
  was_gated: boolean | null;
  drift_detected: boolean | null;
  [key: string]: unknown;
}

interface PortfolioViewProps {
  allSeries: SeriesData[];
  jobId: string;
}

// ============================================================
// CLUSTERS
// ============================================================

type ClusterId =
  | "stable"
  | "seasonal"
  | "trendy"
  | "intermittent"
  | "volatile"
  | "other";

interface ClusterDef {
  id: ClusterId;
  label: string;
  color: string;
  colorClass: string;
  icon: string;
  description: string;
  advice: string;
}

const CLUSTERS: ClusterDef[] = [
  {
    id: "stable",
    label: "Pilotes automatiques",
    color: "#10b981",
    colorClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: "🟢",
    description: "Demande stable et prévisible",
    advice:
      "Ces produits se gèrent seuls. Automatisez les réapprovisionnements en confiance.",
  },
  {
    id: "seasonal",
    label: "Cycles saisonniers",
    color: "#3b82f6",
    colorClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    icon: "🔵",
    description: "Ventes cycliques prévisibles",
    advice:
      "Anticipez vos commandes 2-3 mois avant chaque pic saisonnier.",
  },
  {
    id: "trendy",
    label: "En croissance ou déclin",
    color: "#f59e0b",
    colorClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: "🟡",
    description: "Tendance forte détectée",
    advice:
      "Surveillez l'évolution mois par mois. Ajustez vos stocks progressivement.",
  },
  {
    id: "intermittent",
    label: "Ventes sporadiques",
    color: "#f97316",
    colorClass: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    icon: "🟠",
    description: "Demande irrégulière avec périodes sans vente",
    advice:
      "Privilégiez le stock minimum. Commandez à la demande si possible.",
  },
  {
    id: "volatile",
    label: "Comportement atypique",
    color: "#ef4444",
    colorClass: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: "🔴",
    description: "Forte variabilité ou changement de régime",
    advice:
      "Vérifiez manuellement ces prévisions. Prévoyez un stock de sécurité plus large.",
  },
  {
    id: "other",
    label: "Non classifié",
    color: "#71717a",
    colorClass: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    icon: "⚪",
    description: "Profil mixte ou données insuffisantes",
    advice:
      "Consultez la fiche détaillée pour comprendre le comportement de ce produit.",
  },
];

const CLUSTER_MAP = new Map(CLUSTERS.map((c) => [c.id, c]));

/**
 * Assigne un cluster a une serie.
 * Priorite : volatile > intermittent > trendy > seasonal > stable > other
 */
function assignCluster(series: SeriesData): ClusterId {
  const tags = series.behavior_tags ?? [];
  const xyz = series.xyz_class ?? "X";

  if (
    xyz === "Z" ||
    tags.includes("lumpy") ||
    tags.includes("regime_change")
  ) {
    return "volatile";
  }
  if (tags.includes("intermittent")) {
    return "intermittent";
  }
  if (tags.includes("trendy")) {
    return "trendy";
  }
  if (tags.includes("seasonal")) {
    return "seasonal";
  }
  if (tags.includes("stable") || xyz === "X") {
    return "stable";
  }
  return "other";
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function PortfolioView({ allSeries, jobId }: PortfolioViewProps) {
  const router = useRouter();
  const { thresholds } = useThresholds();
  const reliabilityThreshold = thresholds.reliability_score?.green_max ?? 80;
  const [activeCluster, setActiveCluster] = useState<ClusterId | null>(null);
  const [xAxis, setXAxis] = useState<"forecast_sum" | "forecast_avg">(
    "forecast_sum"
  );

  // --- Donnees enrichies avec cluster ---
  const enrichedSeries = useMemo(() => {
    return allSeries
      .filter((s) => s.wape != null)
      .map((s) => ({
        ...s,
        cluster: assignCluster(s),
        reliability: s.champion_score ?? 0,
        volume:
          xAxis === "forecast_sum"
            ? (s.forecast_sum ?? 0)
            : (s.forecast_avg ?? 0),
        bubbleSize: s.abc_class === "A" ? 400 : s.abc_class === "B" ? 200 : 80,
      }));
  }, [allSeries, xAxis]);

  // --- Series filtrees par cluster actif ---
  const filteredSeries = useMemo(() => {
    if (!activeCluster) return enrichedSeries;
    return enrichedSeries.filter((s) => s.cluster === activeCluster);
  }, [enrichedSeries, activeCluster]);

  // --- Stats par cluster ---
  const clusterStats = useMemo(() => {
    const stats = new Map<
      ClusterId,
      {
        count: number;
        totalVolume: number;
        totalWape: number;
        models: Map<string, number>;
      }
    >();

    for (const s of enrichedSeries) {
      const existing = stats.get(s.cluster) ?? {
        count: 0,
        totalVolume: 0,
        totalWape: 0,
        models: new Map(),
      };
      existing.count++;
      existing.totalVolume += s.forecast_sum ?? 0;
      existing.totalWape += s.wape ?? 0;
      if (s.champion_model) {
        existing.models.set(
          s.champion_model,
          (existing.models.get(s.champion_model) ?? 0) + 1
        );
      }
      stats.set(s.cluster, existing);
    }

    return stats;
  }, [enrichedSeries]);

  // Volume total pour calculer % CA
  const totalVolume = useMemo(() => {
    return enrichedSeries.reduce((sum, s) => sum + (s.forecast_sum ?? 0), 0);
  }, [enrichedSeries]);

  // Mediane volume pour les quadrants
  const medianVolume = useMemo(() => {
    const volumes = filteredSeries.map((s) => s.volume).sort((a, b) => a - b);
    if (volumes.length === 0) return 0;
    const mid = Math.floor(volumes.length / 2);
    return volumes.length % 2 !== 0
      ? volumes[mid]
      : (volumes[mid - 1] + volumes[mid]) / 2;
  }, [filteredSeries]);

  // --- Navigation vers fiche serie ---
  const handleDotClick = (seriesId: string) => {
    router.push(
      `/dashboard/results/series?job=${jobId}&series=${encodeURIComponent(seriesId)}`
    );
  };

  // --- Tooltip custom ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const clusterDef = CLUSTER_MAP.get(d.cluster);
    const modelLabel = d.champion_model
      ? getModelMeta(d.champion_model).label
      : "—";

    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-sm px-4 py-3 shadow-xl text-sm space-y-1.5 max-w-xs">
        <p className="font-semibold text-white truncate">{d.series_id}</p>
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: clusterDef?.color }}
          />
          <span className="text-zinc-300">{clusterDef?.label}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-400">
          <span>Fiabilité</span>
          <span className="text-right text-white font-medium">
            {d.reliability.toFixed(0)}/100
          </span>
          <span>Volume prévu</span>
          <span className="text-right text-white font-medium">
            {d.volume.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
          </span>
          <span>Méthode</span>
          <span className="text-right text-white font-medium truncate">
            {modelLabel}
          </span>
          <span>Classe</span>
          <span className="text-right text-white font-medium">
            {d.abc_class ?? "—"}
            {d.xyz_class ?? ""}
          </span>
        </div>
      </div>
    );
  };

  // --- Axe X ---
  const xAxisLabel =
    xAxis === "forecast_sum" ? "Volume prévu (total)" : "Volume prévu (moyen)";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            Vue Portfolio
            <HelpTooltip termKey="portfolio" />
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {enrichedSeries.length} produits analysés
            {activeCluster && (
              <>
                {" "}
                &middot; Filtre :{" "}
                <span className="text-white">
                  {CLUSTER_MAP.get(activeCluster)?.label}
                </span>
                <button
                  onClick={() => setActiveCluster(null)}
                  className="ml-2 text-indigo-400 hover:text-indigo-300 underline"
                >
                  Tout afficher
                </button>
              </>
            )}
          </p>
        </div>

        {/* Toggle axe X */}
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg p-1">
          <button
            onClick={() => setXAxis("forecast_sum")}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm transition-colors",
              xAxis === "forecast_sum"
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Volume total
          </button>
          <button
            onClick={() => setXAxis("forecast_avg")}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm transition-colors",
              xAxis === "forecast_avg"
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Volume moyen
          </button>
        </div>
      </div>

      {/* Scatterplot */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 lg:p-6">
        <ResponsiveContainer width="100%" height={480}>
          <ScatterChart
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              type="number"
              dataKey="volume"
              name={xAxisLabel}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)
              }
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              label={{
                value: xAxisLabel,
                position: "insideBottom",
                offset: -10,
                fill: "#71717a",
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey="reliability"
              name="Fiabilité"
              domain={[0, 100]}
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              label={{
                value: "Score de fiabilité (/100)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#71717a",
                fontSize: 12,
              }}
            />
            <ZAxis type="number" dataKey="bubbleSize" range={[40, 400]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />

            {/* Seuil fiabilite personnalise */}
            <ReferenceLine
              y={reliabilityThreshold}
              stroke="#6366f1"
              strokeDasharray="6 3"
              strokeOpacity={0.5}
              label={{
                value: `Seuil fiabilité ${reliabilityThreshold}%`,
                position: "insideTopRight",
                fill: "#6366f1",
                fontSize: 11,
              }}
            />

            {/* Mediane volume */}
            <ReferenceLine
              x={medianVolume}
              stroke="#6366f1"
              strokeDasharray="6 3"
              strokeOpacity={0.3}
            />

            {/* Points */}
            <Scatter
              data={filteredSeries}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(data: any) => handleDotClick(data.series_id)}
              cursor="pointer"
            >
              {filteredSeries.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CLUSTER_MAP.get(entry.cluster)?.color ?? "#71717a"}
                  fillOpacity={0.75}
                  stroke={CLUSTER_MAP.get(entry.cluster)?.color ?? "#71717a"}
                  strokeOpacity={0.9}
                  strokeWidth={1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legende quadrants */}
        <div className="grid grid-cols-2 gap-x-8 mt-2 text-xs text-zinc-500 px-4">
          <span className="text-left">&larr; Petits volumes</span>
          <span className="text-right">Gros volumes &rarr;</span>
        </div>
      </div>

      {/* Filtres clusters (toggle pills) */}
      <div className="flex flex-wrap gap-2">
        {CLUSTERS.map((cluster) => {
          const stats = clusterStats.get(cluster.id);
          if (!stats || stats.count === 0) return null;
          const isActive = activeCluster === cluster.id;
          return (
            <button
              key={cluster.id}
              onClick={() =>
                setActiveCluster(isActive ? null : cluster.id)
              }
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all",
                isActive
                  ? cluster.colorClass + " border-current"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cluster.color }}
              />
              <span className="font-medium">{cluster.label}</span>
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-white/10" : "bg-zinc-800"
                )}
              >
                {stats.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cartes resume par cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLUSTERS.map((cluster) => {
          const stats = clusterStats.get(cluster.id);
          if (!stats || stats.count === 0) return null;

          const avgWape = stats.totalWape / stats.count;
          const avgReliability = 100 - avgWape;
          const volumePct =
            totalVolume > 0
              ? ((stats.totalVolume / totalVolume) * 100).toFixed(1)
              : "0";

          // Modele le plus frequent dans ce cluster
          let topModel = "—";
          let topModelCount = 0;
          for (const [model, count] of stats.models) {
            if (count > topModelCount) {
              topModel = model;
              topModelCount = count;
            }
          }
          const topModelLabel =
            topModel !== "—" ? getModelMeta(topModel).label : "—";

          const isHighlighted = activeCluster === cluster.id;

          return (
            <button
              key={cluster.id}
              onClick={() =>
                setActiveCluster(
                  activeCluster === cluster.id ? null : cluster.id
                )
              }
              className={cn(
                "rounded-2xl border p-4 text-left transition-all hover:border-zinc-600",
                isHighlighted
                  ? "border-indigo-500/50 bg-indigo-500/5"
                  : "border-zinc-800 bg-zinc-900/50"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cluster.color }}
                  />
                  <span className="font-semibold text-white text-sm">
                    {cluster.icon} {cluster.label}
                  </span>
                </div>
                <span className="text-xs text-zinc-500">
                  {stats.count} produit{stats.count > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div>
                  <p className="text-lg font-bold text-white">
                    {avgReliability.toFixed(0)}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Fiabilité moy.
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{volumePct}%</p>
                  <p className="text-[11px] text-zinc-500">du volume</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white truncate">
                    {topModelLabel}
                  </p>
                  <p className="text-[11px] text-zinc-500">Méthode top</p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {cluster.advice}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
