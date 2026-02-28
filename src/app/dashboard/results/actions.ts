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

/**
 * Retourne une signed URL pour télécharger le .zip de résultats depuis Supabase Storage.
 * Le .zip est uploadé par N8N dans le bucket "forecasts" au chemin results/{user_id}/{job_id}.
 */
export async function getResultsDownloadUrl(jobId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Vérifier que le job appartient bien à l'utilisateur connecté
  const { data: job } = await supabase
    .schema("lumeniq")
    .from("forecast_jobs")
    .select("id")
    .eq("id", jobId)
    .eq("user_id", user.id)
    .single();

  if (!job) return null;

  // Lister les fichiers dans le dossier results/{user_id}/{job_id}
  const folderPath = `results/${user.id}/${jobId}`;
  const { data: files } = await supabase.storage
    .from("forecasts")
    .list(folderPath, { limit: 10 });

  if (!files || files.length === 0) return null;

  // Trouver le .zip (ou le premier fichier disponible)
  const zipFile = files.find((f) => f.name.endsWith(".zip")) ?? files[0];
  if (!zipFile) return null;

  const filePath = `${folderPath}/${zipFile.name}`;
  const { data: signedUrl } = await supabase.storage
    .from("forecasts")
    .createSignedUrl(filePath, 300); // 5 min

  return signedUrl?.signedUrl ?? null;
}
