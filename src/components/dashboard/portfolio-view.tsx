"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
import { ArrowRight, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModelMeta } from "@/lib/model-labels";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { FadeIn } from "@/components/animations";
import { motion, useReducedMotion } from "framer-motion";
import { useThresholds } from "@/lib/thresholds/context";
import { RESULTS_TAB_EVENT } from "@/components/dashboard/command-palette";

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
  onClusterNavigate?: (clusterId: ClusterId) => void;
}

// ============================================================
// CLUSTERS
// ============================================================

export type ClusterId =
  | "dormant"
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
    id: "dormant",
    label: "Inactifs",
    color: "#71717a",
    colorClass: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    icon: "⚫",
    description: "Aucune vente depuis 6+ mois",
    advice:
      "Confirmez l'arrêt du produit ou retirez-le de vos imports.",
  },
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

export const CLUSTER_MAP = new Map(CLUSTERS.map((c) => [c.id, c]));

/**
 * Assigne un cluster a une serie.
 * Priorite : volatile > intermittent > trendy > seasonal > stable > other
 */
export function assignCluster(series: {
  behavior_tags?: string[] | null;
  xyz_class?: string | null;
}): ClusterId {
  const tags = series.behavior_tags ?? [];
  const xyz = series.xyz_class ?? "X";

  if (tags.includes("dormant")) return "dormant";

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
// TYPES S3 — Stats enrichies par cluster
// ============================================================

interface ClusterStatsData {
  count: number;
  totalVolume: number;
  totalWape: number;
  models: Map<string, number>;
  abcCounts: { A: number; B: number; C: number };
  reliabilityBuckets: {
    excellent: number;
    good: number;
    moderate: number;
    poor: number;
  };
  alertCount: number;
  atRiskSeries: { id: string; reliability: number }[];
  seriesIds: string[];
}

// ============================================================
// MINI COMPOSANTS S3
// ============================================================

function ReliabilityBar({
  buckets,
}: {
  buckets: ClusterStatsData["reliabilityBuckets"];
}) {
  const total =
    buckets.excellent + buckets.good + buckets.moderate + buckets.poor;
  if (total === 0) return null;

  const segments = [
    { key: "excellent", count: buckets.excellent, color: "bg-emerald-500" },
    { key: "good", count: buckets.good, color: "bg-blue-500" },
    { key: "moderate", count: buckets.moderate, color: "bg-amber-500" },
    { key: "poor", count: buckets.poor, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex h-2 rounded-full overflow-hidden bg-[var(--color-bg-surface)]">
        {segments.map(
          (seg) =>
            seg.count > 0 && (
              <div
                key={seg.key}
                className={cn("h-full", seg.color)}
                style={{ width: `${(seg.count / total) * 100}%` }}
              />
            )
        )}
      </div>
      <div className="flex gap-3 text-[10px] text-[var(--color-text-tertiary)]">
        {segments.map(
          (seg) =>
            seg.count > 0 && (
              <span key={seg.key} className="flex items-center gap-1">
                <span
                  className={cn("w-1.5 h-1.5 rounded-full", seg.color)}
                />
                {seg.count}
              </span>
            )
        )}
      </div>
    </div>
  );
}

function AbcBar({ counts }: { counts: { A: number; B: number; C: number } }) {
  const total = counts.A + counts.B + counts.C;
  if (total === 0) return null;

  const segments = [
    { key: "A", count: counts.A, color: "bg-amber-700", label: "A" },
    { key: "B", count: counts.B, color: "bg-amber-700/60", label: "B" },
    { key: "C", count: counts.C, color: "bg-zinc-500", label: "C" },
  ];

  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-[var(--color-text-tertiary)] shrink-0">ABC</span>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-[var(--color-bg-surface)] flex-1">
        {segments.map(
          (seg) =>
            seg.count > 0 && (
              <div
                key={seg.key}
                className={cn("h-full", seg.color)}
                style={{ width: `${(seg.count / total) * 100}%` }}
              />
            )
        )}
      </div>
      <div className="flex gap-2 text-[var(--color-text-tertiary)] shrink-0">
        {segments.map((seg) => (
          <span key={seg.key}>
            {seg.count}
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function PortfolioView({ allSeries, jobId, onClusterNavigate }: PortfolioViewProps) {
  const router = useRouter();
  const { thresholds } = useThresholds();
  const reliabilityThreshold = thresholds.reliability_score?.green_max ?? 80;
  const [activeCluster, setActiveCluster] = useState<ClusterId | null>(null);
  const [xAxis, setXAxis] = useState<"forecast_sum" | "forecast_avg">(
    "forecast_sum"
  );

  // Zoom state
  const [zoomDomain, setZoomDomain] = useState<{
    x: [number, number]; y: [number, number];
  } | null>(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Reduced motion
  const prefersReducedMotion = useReducedMotion();

  // Double-clic detection pour zoom
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickDataRef = useRef<{
    series_id: string; volume: number; reliability: number;
  } | null>(null);
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);

  // Wrappers qui réinitialisent le zoom à chaque changement de filtre/axe
  const handleSetActiveCluster = (cluster: ClusterId | null) => {
    setActiveCluster(cluster);
    setZoomDomain(null);
  };
  const handleSetXAxis = (axis: "forecast_sum" | "forecast_avg") => {
    setXAxis(axis);
    setZoomDomain(null);
  };

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
    const stats = new Map<ClusterId, ClusterStatsData>();

    for (const s of enrichedSeries) {
      const existing: ClusterStatsData = stats.get(s.cluster) ?? {
        count: 0,
        totalVolume: 0,
        totalWape: 0,
        models: new Map(),
        abcCounts: { A: 0, B: 0, C: 0 },
        reliabilityBuckets: { excellent: 0, good: 0, moderate: 0, poor: 0 },
        alertCount: 0,
        atRiskSeries: [],
        seriesIds: [],
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

      // ABC distribution
      const abc = (s.abc_class ?? "C") as "A" | "B" | "C";
      if (abc in existing.abcCounts) {
        existing.abcCounts[abc]++;
      } else {
        existing.abcCounts.C++;
      }

      // Buckets de fiabilite (champion_score est deja 0-100)
      const rel = s.champion_score ?? 0;
      if (rel >= 85) existing.reliabilityBuckets.excellent++;
      else if (rel >= 70) existing.reliabilityBuckets.good++;
      else if (rel >= 50) existing.reliabilityBuckets.moderate++;
      else existing.reliabilityBuckets.poor++;

      // Alertes (wape > 20 = serie en alerte)
      if ((s.wape ?? 0) > 20) existing.alertCount++;

      // Toutes les series pour at-risk
      existing.atRiskSeries.push({ id: s.series_id, reliability: rel });

      // IDs pour navigation
      existing.seriesIds.push(s.series_id);

      stats.set(s.cluster, existing);
    }

    // Garder seulement les 3 series les moins fiables
    for (const [, data] of stats) {
      data.atRiskSeries.sort((a, b) => a.reliability - b.reliability);
      data.atRiskSeries = data.atRiskSeries.slice(0, 3);
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

  // Domaine X pour calculs de zoom
  const xAxisExtent = useMemo(() => {
    const volumes = filteredSeries.map((s) => s.volume);
    if (volumes.length === 0) return [0, 100] as [number, number];
    return [Math.min(...volumes), Math.max(...volumes)] as [number, number];
  }, [filteredSeries]);

  // --- Navigation vers fiche serie ---
  const handleDotClick = (seriesId: string) => {
    router.push(
      `/dashboard/results/series?job=${jobId}&series=${encodeURIComponent(seriesId)}`
    );
  };

  // --- Navigation vers onglet Series depuis CTA cluster ---
  const handleNavigateToSeries = (clusterId: ClusterId) => {
    if (onClusterNavigate) {
      onClusterNavigate(clusterId);
    } else {
      window.dispatchEvent(
        new CustomEvent(RESULTS_TAB_EVENT, { detail: "series" })
      );
    }
  };

  interface ScatterDataPoint {
    series_id: string;
    volume: number;
    reliability: number;
  }

  // --- Clic / Double-clic sur point scatter ---
  const handleScatterClick = (data: ScatterDataPoint) => {
    if (
      clickTimerRef.current &&
      lastClickDataRef.current?.series_id === data.series_id
    ) {
      // Double-clic → zoom 2x centré sur ce point
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      lastClickDataRef.current = null;
      const x = data.volume as number;
      const y = data.reliability as number;
      const currentX = zoomDomain?.x ?? xAxisExtent;
      const currentY = zoomDomain?.y ?? ([0, 100] as [number, number]);
      const xSpan = (currentX[1] - currentX[0]) / 4;
      const ySpan = (currentY[1] - currentY[0]) / 4;
      setZoomDomain({
        x: [Math.max(0, x - xSpan), x + xSpan],
        y: [Math.max(0, y - ySpan), Math.min(100, y + ySpan)],
      });
    } else {
      // Premier clic → programmer navigation après délai
      lastClickDataRef.current = {
        series_id: data.series_id,
        volume: data.volume,
        reliability: data.reliability,
      };
      clickTimerRef.current = setTimeout(() => {
        handleDotClick(data.series_id);
        clickTimerRef.current = null;
        lastClickDataRef.current = null;
      }, 350);
    }
  };

  interface TooltipPayloadItem {
    payload: ScatterDataPoint & { cluster: ClusterId; abc_class: string | null; xyz_class: string | null; champion_model: string | null };
  }

  // --- Tooltip custom ---
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const clusterDef = CLUSTER_MAP.get(d.cluster);
    const modelLabel = d.champion_model
      ? getModelMeta(d.champion_model).label
      : "—";

    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-white backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 shadow-xl text-xs sm:text-sm space-y-1 sm:space-y-1.5 max-w-[260px] sm:max-w-xs">
        <p className="font-semibold text-[var(--color-text)] truncate">{d.series_id}</p>
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: clusterDef?.color }}
          />
          <span className="text-[var(--color-text)]">{clusterDef?.label}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[var(--color-text-secondary)]">
          <span>Fiabilité</span>
          <span className="text-right text-[var(--color-text)] font-medium">
            {d.reliability.toFixed(0)}/100
          </span>
          <span>Volume prévu</span>
          <span className="text-right text-[var(--color-text)] font-medium">
            {d.volume.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
          </span>
          <span>Méthode</span>
          <span className="text-right text-[var(--color-text)] font-medium truncate">
            {modelLabel}
          </span>
          <span>Classe</span>
          <span className="text-right text-[var(--color-text)] font-medium">
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
          <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
            Vue Portfolio
            <HelpTooltip termKey="portfolio" />
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {enrichedSeries.length} produits analysés
            {activeCluster && (
              <>
                {" "}
                &middot; Filtre :{" "}
                <span className="text-[var(--color-text)]">
                  {CLUSTER_MAP.get(activeCluster)?.label}
                </span>
                <button
                  onClick={() => handleSetActiveCluster(null)}
                  className="ml-2 text-amber-700 hover:text-amber-600 underline"
                >
                  Tout afficher
                </button>
              </>
            )}
          </p>
        </div>

        {/* Toggle axe X — masqué sur mobile */}
        <div className="hidden sm:flex items-center gap-2 bg-[var(--color-bg-surface)] rounded-lg p-1">
          <button
            onClick={() => handleSetXAxis("forecast_sum")}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm transition-colors",
              xAxis === "forecast_sum"
                ? "bg-white text-[var(--color-text)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            )}
          >
            Volume total
          </button>
          <button
            onClick={() => handleSetXAxis("forecast_avg")}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm transition-colors",
              xAxis === "forecast_avg"
                ? "bg-white text-[var(--color-text)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            )}
          >
            Volume moyen
          </button>
        </div>
      </div>

      {/* Scatterplot */}
      <FadeIn delay={0.1}>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 lg:p-6">
        {/* Bouton reset zoom */}
        {zoomDomain && (
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setZoomDomain(null)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                         bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text)]
                         hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text)] transition-colors
                         w-full sm:w-auto"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              Réinitialiser le zoom
            </button>
          </div>
        )}
        <div
          className="h-[300px] sm:h-[400px] lg:h-[480px]"
          role="img"
          aria-label="Vue portfolio des séries montrant la fiabilité en fonction du volume prévu"
        >
          <span className="sr-only">
            Graphique portfolio montrant la distribution des séries par fiabilité et volume. Chaque bulle représente une série, dimensionnée par sa classe ABC. Les bulles sont coloriées par cluster : vert pour stable, bleu pour saisonnier, orange pour trendy, orange clair pour intermittent, rouge pour volatile, et gris pour non classifié.
          </span>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              type="number"
              dataKey="volume"
              name={xAxisLabel}
              domain={zoomDomain ? zoomDomain.x : ["auto", "auto"]}
              allowDataOverflow={!!zoomDomain}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)
              }
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: isMobile ? 10 : 12 }}
              label={isMobile ? undefined : {
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
              domain={zoomDomain ? zoomDomain.y : [0, 100]}
              allowDataOverflow={!!zoomDomain}
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: isMobile ? 10 : 12 }}
              label={isMobile ? undefined : {
                value: "Score de fiabilité (/100)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#71717a",
                fontSize: 12,
              }}
            />
            <ZAxis type="number" dataKey="bubbleSize" range={isMobile ? [20, 200] : [40, 400]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />

            {/* Seuil fiabilite personnalise */}
            <ReferenceLine
              y={reliabilityThreshold}
              stroke="#b45309"
              strokeDasharray="6 3"
              strokeOpacity={0.5}
              label={{
                value: `Seuil fiabilité ${reliabilityThreshold}%`,
                position: "insideTopRight",
                fill: "#b45309",
                fontSize: 11,
              }}
            />

            {/* Mediane volume */}
            <ReferenceLine
              x={medianVolume}
              stroke="#b45309"
              strokeDasharray="6 3"
              strokeOpacity={0.3}
            />

            {/* Points */}
            <Scatter
              data={filteredSeries}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(data: ScatterDataPoint) => handleScatterClick(data)}
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
        </div>

        {/* Legende quadrants — masquée sur mobile */}
        <div className="hidden sm:grid grid-cols-2 gap-x-8 mt-2 text-xs text-[var(--color-text-tertiary)] px-4">
          <span className="text-left">&larr; Petits volumes</span>
          <span className="text-right">Gros volumes &rarr;</span>
        </div>
      </div>
      </FadeIn>

      {/* Filtres clusters (toggle pills) */}
      <FadeIn delay={0.2}>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 scrollbar-thin">
        {CLUSTERS.map((cluster) => {
          const stats = clusterStats.get(cluster.id);
          if (!stats || stats.count === 0) return null;
          const isActive = activeCluster === cluster.id;
          return (
            <button
              key={cluster.id}
              onClick={() =>
                handleSetActiveCluster(isActive ? null : cluster.id)
              }
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all shrink-0",
                isActive
                  ? cluster.colorClass + " border-current"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
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
                  isActive ? "bg-[var(--color-bg-surface)]" : "bg-[var(--color-bg-surface)]"
                )}
              >
                {stats.count}
              </span>
            </button>
          );
        })}
      </div>
      </FadeIn>

      {/* Cartes resume par cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLUSTERS.map((cluster, index) => {
          const stats = clusterStats.get(cluster.id);
          if (!stats || stats.count === 0) return null;

          return (
            <motion.div
              key={cluster.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : {
                delay: 0.3 + index * 0.08,
                duration: 0.4,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <ClusterCard
                cluster={cluster}
                stats={stats}
                totalVolume={totalVolume}
                isHighlighted={activeCluster === cluster.id}
                onToggle={() =>
                  handleSetActiveCluster(
                    activeCluster === cluster.id ? null : cluster.id
                  )
                }
                onNavigateToSeries={handleNavigateToSeries}
                jobId={jobId}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// CLUSTER CARD — Mini dashboard par groupe
// ============================================================

interface ClusterCardProps {
  cluster: ClusterDef;
  stats: ClusterStatsData;
  totalVolume: number;
  isHighlighted: boolean;
  onToggle: () => void;
  onNavigateToSeries: (clusterId: ClusterId) => void;
  jobId: string;
}

function ClusterCard({
  cluster,
  stats,
  totalVolume,
  isHighlighted,
  onToggle,
  onNavigateToSeries,
  jobId,
}: ClusterCardProps) {
  const router = useRouter();

  const avgWape = stats.totalWape / stats.count;
  const avgReliability = 100 - avgWape;
  const volumePct =
    totalVolume > 0
      ? ((stats.totalVolume / totalVolume) * 100).toFixed(1)
      : "0";

  // Modele le plus frequent
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

  const hasAlerts = stats.alertCount > 0;
  const hasAtRisk =
    stats.atRiskSeries.length > 0 && stats.atRiskSeries[0].reliability < 70;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "rounded-2xl border p-4 text-left transition-all hover:border-[var(--color-border)] cursor-pointer",
        isHighlighted
          ? "border-amber-700/50 bg-amber-700/5"
          : "border-[var(--color-border)] bg-white"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: cluster.color }}
          />
          <span className="font-semibold text-[var(--color-text)] text-sm">
            {cluster.icon} {cluster.label}
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {stats.count} produit{stats.count > 1 ? "s" : ""}
        </span>
      </div>

      {/* Stats row — 3 ou 4 colonnes selon alertes */}
      <div
        className={cn(
          "grid gap-2 text-center mb-3",
          hasAlerts ? "grid-cols-4" : "grid-cols-3"
        )}
      >
        <div>
          <p className="text-lg font-bold text-[var(--color-text)]">
            {avgReliability.toFixed(0)}
          </p>
          <p className="text-[11px] text-[var(--color-text-tertiary)]">Fiabilité</p>
        </div>
        <div>
          <p className="text-lg font-bold text-[var(--color-text)]">{volumePct}%</p>
          <p className="text-[11px] text-[var(--color-text-tertiary)]">du volume</p>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text)] truncate">
            {topModelLabel}
          </p>
          <p className="text-[11px] text-[var(--color-text-tertiary)]">Méthode</p>
        </div>
        {hasAlerts && (
          <div>
            <p className="text-lg font-bold text-amber-400">
              {stats.alertCount}
            </p>
            <p className="text-[11px] text-[var(--color-text-tertiary)]">Alertes</p>
          </div>
        )}
      </div>

      {/* Mini barre repartition fiabilite */}
      <div className="mb-2">
        <ReliabilityBar buckets={stats.reliabilityBuckets} />
      </div>

      {/* Mini barre ABC */}
      <div className="mb-3">
        <AbcBar counts={stats.abcCounts} />
      </div>

      {/* Series a surveiller */}
      {hasAtRisk && (
        <div className="space-y-1 mb-3">
          <p className="text-[11px] text-[var(--color-text-tertiary)] font-medium">
            ⚠️ À surveiller
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stats.atRiskSeries
              .filter((s) => s.reliability < 70)
              .map((s) => (
                <button
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/dashboard/results/series?job=${jobId}&series=${encodeURIComponent(s.id)}`
                    );
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-400
                             border border-red-500/20 hover:bg-red-500/20 transition-colors truncate max-w-[140px]"
                  title={`${s.id} — Fiabilité ${s.reliability.toFixed(0)}/100`}
                >
                  {s.id} ({s.reliability.toFixed(0)})
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Conseil business */}
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
        {cluster.advice}
      </p>

      {/* CTA — Voir les produits */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigateToSeries(cluster.id);
        }}
        className="w-full mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-center gap-2
                   text-xs text-amber-700 hover:text-amber-600 transition-colors"
      >
        Voir les {stats.count} produit{stats.count > 1 ? "s" : ""}
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
