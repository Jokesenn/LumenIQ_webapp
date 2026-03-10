import { z } from "zod";
import type { ForecastAction as DatabaseForecastAction } from "@/types/database";

export const ForecastActionSchema = z.object({
  id: z.string(),
  job_id: z.string(),
  client_id: z.string(),
  series_id: z.string().nullable(),
  priority: z.string(),
  action_type: z.string(),
  title: z.string(),
  message: z.string(),
  suggestion: z.string().nullable().optional(),
  context: z.record(z.string(), z.unknown()).nullable().optional(),
  recurrence_count: z.number().nullable().optional(),
  trend: z.string().nullable().optional(),
  first_seen_at: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  dismissed_at: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
});

export type ForecastAction = DatabaseForecastAction;

export function validateActions(data: unknown[]): ForecastAction[] {
  return data.map((item) => ForecastActionSchema.parse(item)) as ForecastAction[];
}

export function safeValidateActions(data: unknown[]): {
  valid: ForecastAction[];
  errors: number
} {
  const valid: ForecastAction[] = [];
  let errors = 0;
  for (const item of data) {
    const result = ForecastActionSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data as ForecastAction);
    } else {
      errors++;
    }
  }
  return { valid, errors };
}
