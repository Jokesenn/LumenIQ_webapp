"use server";

import { createClient } from "@/lib/supabase/server";
import { getJobFullData, getRecentJobs } from "@/lib/queries/results";
import type { ForecastJob } from "@/types/database";

export async function fetchJobFullData(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getJobFullData(jobId, user.id);
}

export async function fetchRecentJobs(limit = 10): Promise<ForecastJob[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  return getRecentJobs(user.id, limit);
}
