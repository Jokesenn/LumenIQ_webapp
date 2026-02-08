export type ActionPriority = "urgent" | "warning" | "info" | "clear";
export type ActionStatus = "active" | "dismissed" | "resolved";
export type ActionTrend = "worsening" | "stable" | "improving";

export interface ForecastAction {
  id: string;
  job_id: string;
  client_id: string;
  series_id: string | null;
  priority: ActionPriority;
  action_type: string;
  title: string;
  message: string;
  suggestion: string | null;
  context: Record<string, unknown>;
  recurrence_count: number;
  trend: ActionTrend | null;
  first_seen_at: string | null;
  status: ActionStatus;
  dismissed_at: string | null;
  created_at: string;
}

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
  actions: ForecastAction[];
}
