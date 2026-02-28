"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-supabase";
import { toast } from "sonner";
import type {
  ForecastAction,
  ActionsSummary,
  ActionsGroupedByJob,
} from "@/types/actions";

// ---------------------------------------------------------------------------
// useActions — Fetch actions for page (multi-run) or drawer (single job)
// ---------------------------------------------------------------------------

interface UseActionsReturn {
  actions: ForecastAction[];
  grouped: ActionsGroupedByJob[];
  summary: ActionsSummary | null;
  loading: boolean;
  error: string | null;
  dismissAction: (id: string) => Promise<void>;
  dismissAll: () => Promise<void>;
  undoDismiss: (id: string) => Promise<void>;
}

export function useActions(
  mode: "page" | "drawer",
  jobId?: string | null
): UseActionsReturn {
  const { user } = useUser();
  const [actions, setActions] = useState<ForecastAction[]>([]);
  const [grouped, setGrouped] = useState<ActionsGroupedByJob[]>([]);
  const [summary, setSummary] = useState<ActionsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch actions
  const fetchActions = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (mode === "drawer" && jobId) {
        // Drawer mode: single job
        const { data, error: queryError } = await supabase
          .schema("lumeniq")
          .from("forecast_actions")
          .select("*")
          .eq("job_id", jobId)
          .eq("status", "active")
          .order("priority", { ascending: true })
          .order("created_at", { ascending: false });

        if (queryError) throw queryError;
        if (!isMountedRef.current) return;

        const sorted = sortByPriority(data || []);
        setActions(sorted);

        // Fetch summary from the job
        const { data: jobData } = await supabase
          .schema("lumeniq")
          .from("forecast_jobs")
          .select("actions_summary")
          .eq("id", jobId)
          .single();

        if (isMountedRef.current && jobData?.actions_summary) {
          const s = jobData.actions_summary as ActionsSummary;
          if (s.lines) setSummary(s);
        }
      } else {
        // Page mode: all active actions grouped by run
        const { data, error: queryError } = await supabase
          .schema("lumeniq")
          .from("forecast_actions")
          .select(
            "*, forecast_jobs!inner(filename, created_at, actions_summary)"
          )
          .eq("client_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(100);

        if (queryError) throw queryError;
        if (!isMountedRef.current) return;

        const allActions = (data || []).map((row: Record<string, unknown>) => {
          const { forecast_jobs, ...action } = row;
          return action as unknown as ForecastAction;
        });

        const sorted = sortByPriority(allActions);
        setActions(sorted);

        // Group by job
        const jobMap = new Map<string, ActionsGroupedByJob>();
        for (const row of data || []) {
          const jobInfo = row.forecast_jobs as Record<string, unknown>;
          const jid = row.job_id as string;
          if (!jobMap.has(jid)) {
            jobMap.set(jid, {
              job_id: jid,
              filename: (jobInfo?.filename as string) || "",
              run_date: (jobInfo?.created_at as string) || "",
              summary: (jobInfo?.actions_summary as ActionsSummary) || null,
              actions: [],
            });
          }
          const { forecast_jobs: _fj, ...actionOnly } = row;
          jobMap.get(jid)!.actions.push(actionOnly as ForecastAction);
        }

        // Sort groups by run_date descending
        const groups = Array.from(jobMap.values()).sort(
          (a, b) =>
            new Date(b.run_date).getTime() - new Date(a.run_date).getTime()
        );
        // Sort actions within each group by priority
        for (const g of groups) {
          g.actions = sortByPriority(g.actions);
        }
        setGrouped(groups);

        // Use first group's summary
        if (groups.length > 0 && groups[0].summary) {
          setSummary(groups[0].summary);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Erreur de chargement des actions"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user?.id, mode, jobId]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  // Undo a dismiss
  const undoDismiss = useCallback(
    async (id: string) => {
      const supabase = createClient();
      await supabase
        .schema("lumeniq")
        .from("forecast_actions")
        .update({ status: "active", dismissed_at: null })
        .eq("id", id);

      // Refresh data
      fetchActions();
    },
    [fetchActions]
  );

  // Dismiss an action
  const dismissAction = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .schema("lumeniq")
        .from("forecast_actions")
        .update({ status: "dismissed", dismissed_at: new Date().toISOString() })
        .eq("id", id);

      if (updateError) {
        toast.error("Erreur lors de la suppression");
        return;
      }

      // Optimistic removal from state
      setActions((prev) => prev.filter((a) => a.id !== id));
      setGrouped((prev) =>
        prev.map((g) => ({
          ...g,
          actions: g.actions.filter((a) => a.id !== id),
        }))
      );

      // Toast with undo
      toast("Action ignorée", {
        action: {
          label: "Annuler",
          onClick: () => undoDismiss(id),
        },
        duration: 5000,
      });
    },
    [undoDismiss]
  );

  // Dismiss all active actions
  const dismissAll = useCallback(
    async () => {
      const ids = actions.map((a) => a.id);
      if (ids.length === 0) return;

      const supabase = createClient();
      const { error: updateError } = await supabase
        .schema("lumeniq")
        .from("forecast_actions")
        .update({ status: "dismissed", dismissed_at: new Date().toISOString() })
        .in("id", ids);

      if (updateError) {
        toast.error("Erreur lors de la fermeture des actions");
        return;
      }

      // Optimistic clear
      setActions([]);
      setGrouped([]);

      toast(`${ids.length} action${ids.length > 1 ? "s" : ""} fermée${ids.length > 1 ? "s" : ""}`, {
        action: {
          label: "Annuler",
          onClick: () => {
            // Undo all dismissals
            const sb = createClient();
            sb.schema("lumeniq")
              .from("forecast_actions")
              .update({ status: "active", dismissed_at: null })
              .in("id", ids)
              .then(
                () => fetchActions(),
                () => {
                  toast.error("Erreur lors de l'annulation");
                  fetchActions();
                }
              );
          },
        },
        duration: 6000,
      });
    },
    [actions, fetchActions]
  );

  return { actions, grouped, summary, loading, error, dismissAction, dismissAll, undoDismiss };
}

// ---------------------------------------------------------------------------
// useUrgentCount — Lightweight badge counter hook
// ---------------------------------------------------------------------------

export function useUrgentCount(): number {
  const { user } = useUser();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    async function fetchCount() {
      const supabase = createClient();
      const { count: urgentCount } = await supabase
        .schema("lumeniq")
        .from("forecast_actions")
        .select("*", { count: "exact", head: true })
        .eq("client_id", user!.id)
        .eq("status", "active")
        .eq("priority", "urgent");

      if (!cancelled) {
        setCount(urgentCount ?? 0);
      }
    }

    fetchCount();

    // Poll every 30 seconds, pause when tab is hidden
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchCount();
    }, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user?.id]);

  return count;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 1,
  warning: 2,
  info: 3,
  clear: 4,
};

function sortByPriority(actions: ForecastAction[]): ForecastAction[] {
  return [...actions].sort(
    (a, b) =>
      (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
  );
}
