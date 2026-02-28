export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  error?: boolean;
}

export interface ChatRequest {
  jobId: string;
  userId: string;
  question: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  response: string;
}

export interface JobSummarySnapshot {
  global_wape: number | null;
  global_bias_pct: number | null;
  n_series_total: number;
  n_series_failed: number;
  winner_models: Record<string, number> | null;
}

export interface SuggestedQuestion {
  label: string;
  question: string;
}
