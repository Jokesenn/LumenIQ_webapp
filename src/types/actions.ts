// Types applicatifs pour le systeme d'actions
// Les types de base (ForecastAction, ActionPriority, etc.) sont dans database.ts
// Ce fichier definit les types d'application (summary, grouping) et re-exporte les types DB

export type {
  ActionPriority,
  ActionStatus,
  ActionTrend,
  ForecastAction,
} from "@/types/database";

export interface ActionsSummary {
  lines: { icon: string; text: string }[];
  counts: { urgent: number; warning: number; info: number; clear: number };
  generated_at: string;
}

export interface ActionsGroupedByJob {
  job_id: string;
  filename: string;
  run_date: string;
  summary: ActionsSummary | null;
  actions: import("@/types/database").ForecastAction[];
}
