"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Inbox, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useActions } from "@/hooks/use-actions";
import { ActionsSummaryCard } from "./actions-summary";
import { ActionCard } from "./action-card";
import type { ForecastAction } from "@/types/actions";

interface ActionsBoardProps {
  mode: "page" | "drawer";
  jobId?: string | null;
}

export function ActionsBoard({ mode, jobId }: ActionsBoardProps) {
  const { actions, grouped, summary, loading, error, dismissAction, dismissAll } =
    useActions(mode, jobId);
  const router = useRouter();

  const handleNavigate = (seriesId: string, actionJobId: string) => {
    const jid = mode === "drawer" ? jobId : actionJobId;
    if (jid) {
      router.push(`/dashboard/results/series?job=${jid}&series=${seriesId}`);
    }
  };

  // Loading skeleton
  if (loading) {
    return <ActionsBoardSkeleton mode={mode} />;
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  // Empty state
  if (actions.length === 0 && grouped.length === 0) {
    return (
      <div className="dash-empty-hex flex flex-col items-center justify-center py-16 text-center">
        <Inbox className="w-12 h-12 text-zinc-600 mb-3" />
        <p className="text-sm text-zinc-400">Aucune action en attente</p>
        <p className="text-xs text-zinc-500 mt-1">
          Les actions apparaîtront après votre prochaine prévision
        </p>
      </div>
    );
  }

  const totalCount = mode === "drawer" ? actions.length : grouped.reduce((sum, g) => sum + g.actions.length, 0);

  // Drawer mode: flat list, compact
  if (mode === "drawer") {
    return (
      <div className="space-y-4 px-1">
        <ActionsSummaryCard summary={summary} />
        <DismissAllButton count={totalCount} onDismissAll={dismissAll} />
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {actions.map((a) => (
              <ActionCard
                key={a.id}
                action={a}
                compact
                onDismiss={dismissAction}
                onNavigate={handleNavigate}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Page mode: grouped by run
  return (
    <div className="space-y-6">
      <ActionsSummaryCard summary={summary} />
      <DismissAllButton count={totalCount} onDismissAll={dismissAll} />

      {grouped.map((group) => (
        <div key={group.job_id} className="space-y-3">
          {/* Group header */}
          <div className="flex items-center gap-3">
            <h3 className="dash-section-title">
              {group.filename || "Prévision"}
            </h3>
            <span className="text-xs text-zinc-500">
              {formatRunDate(group.run_date)}
            </span>
            <span className="text-xs text-zinc-600">
              {group.actions.length} action{group.actions.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Actions by priority section */}
          <ActionsByPriority
            actions={group.actions}
            onDismiss={dismissAction}
            onNavigate={handleNavigate}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DismissAllButton({
  count,
  onDismissAll,
}: {
  count: number;
  onDismissAll: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);

  if (count === 0) return null;

  if (confirming) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-zinc-400">
          Fermer {count} action{count > 1 ? "s" : ""} ?
        </span>
        <button
          onClick={() => {
            onDismissAll();
            setConfirming(false);
          }}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
        >
          Confirmer
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <button
        onClick={() => setConfirming(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
      >
        <XCircle size={14} />
        Tout fermer
      </button>
    </div>
  );
}

function ActionsByPriority({
  actions,
  onDismiss,
  onNavigate,
}: {
  actions: ForecastAction[];
  onDismiss: (id: string) => Promise<void>;
  onNavigate: (seriesId: string, jobId: string) => void;
}) {
  const urgent = actions.filter((a) => a.priority === "urgent");
  const warning = actions.filter((a) => a.priority === "warning");
  const info = actions.filter((a) => a.priority === "info");
  const clear = actions.filter((a) => a.priority === "clear");

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {urgent.map((a) => (
          <ActionCard key={a.id} action={a} onDismiss={onDismiss} onNavigate={onNavigate} />
        ))}
        {warning.map((a) => (
          <ActionCard key={a.id} action={a} onDismiss={onDismiss} onNavigate={onNavigate} />
        ))}
        {info.map((a) => (
          <ActionCard key={a.id} action={a} onDismiss={onDismiss} onNavigate={onNavigate} />
        ))}
        {clear.map((a) => (
          <ActionCard key={a.id} action={a} onDismiss={onDismiss} onNavigate={onNavigate} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ActionsBoardSkeleton({ mode }: { mode: "page" | "drawer" }) {
  const count = mode === "drawer" ? 3 : 5;
  return (
    <div className={cn("space-y-3", mode === "drawer" && "px-1")}>
      {/* Summary skeleton */}
      <div className="dash-card p-5 space-y-3">
        <Skeleton className="w-20 h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />
      </div>

      {/* Card skeletons */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="dash-card p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-40 h-4 rounded" />
          </div>
          {mode !== "drawer" && <Skeleton className="w-full h-3 rounded" />}
          <div className="flex justify-between">
            <Skeleton className="w-16 h-3 rounded" />
            <Skeleton className="w-12 h-3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatRunDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
