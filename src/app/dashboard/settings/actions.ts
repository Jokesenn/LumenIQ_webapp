"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Export toutes les données de l'utilisateur connecté (Article 20 RGPD — Portabilité).
 * Retourne un objet JSON structuré { table_name: rows[] }.
 */
export async function exportUserData(): Promise<{
  success: boolean;
  data?: Record<string, unknown[]>;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non authentifié" };

  const userId = user.id;

  const lq = supabase.schema("lumeniq");

  // Requêter toutes les tables en parallèle
  const [
    profileRes,
    jobsRes,
    resultsRes,
    resultsMonthsRes,
    seriesRes,
    synthesesRes,
    summariesRes,
    monthlyAggRes,
    prefsRes,
    actualsRes,
    stateRes,
  ] = await Promise.all([
    lq.from("profiles").select("*").eq("id", userId),
    lq.from("forecast_jobs").select("*").eq("user_id", userId),
    lq.from("forecast_results").select("*").eq("user_id", userId),
    lq.from("forecast_results_months").select("*").eq("user_id", userId),
    lq.from("forecast_series").select("*").eq("user_id", userId),
    lq.from("forecast_syntheses").select("*").eq("user_id", userId),
    lq.from("job_summaries").select("*").eq("user_id", userId),
    lq.from("job_monthly_aggregates").select("*").eq("user_id", userId),
    lq.from("user_preferences").select("*").eq("user_id", userId),
    lq.from("series_actuals").select("*").eq("user_id", userId),
    lq.from("state_store").select("*").eq("user_id", userId),
  ]);

  // Récupérer les job_ids pour les forecast_actions (utilise client_id, pas user_id)
  const jobIds = (jobsRes.data ?? []).map((j) => j.id);
  const actionsRes =
    jobIds.length > 0
      ? await lq.from("forecast_actions").select("*").in("job_id", jobIds)
      : { data: [] as unknown[] };

  // Nettoyer le profil (supprimer les champs Stripe sensibles)
  const profiles = (profileRes.data ?? []).map((p) => {
    const { stripe_customer_id, stripe_subscription_id, ...safe } = p as Record<string, unknown>;
    void stripe_customer_id;
    void stripe_subscription_id;
    return safe;
  });

  return {
    success: true,
    data: {
      profiles,
      forecast_jobs: jobsRes.data ?? [],
      forecast_results: resultsRes.data ?? [],
      forecast_results_months: resultsMonthsRes.data ?? [],
      forecast_series: seriesRes.data ?? [],
      forecast_syntheses: synthesesRes.data ?? [],
      job_summaries: summariesRes.data ?? [],
      job_monthly_aggregates: monthlyAggRes.data ?? [],
      user_preferences: prefsRes.data ?? [],
      forecast_actions: actionsRes.data ?? [],
      series_actuals: actualsRes.data ?? [],
      state_store: stateRes.data ?? [],
    },
  };
}

/**
 * Supprime le compte de l'utilisateur connecté et toutes ses données (Article 17 RGPD).
 * Ordre : données DB via RPC → fichiers Storage → utilisateur Auth.
 */
export async function deleteAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non authentifié" };

  const userId = user.id;

  // 1. Supprimer les données en DB via la fonction RPC (schéma lumeniq)
  const { error: rpcError } = await supabase.schema("lumeniq").rpc(
    "delete_user_data" as never,
    { target_user_id: userId } as never
  );

  if (rpcError) {
    return {
      success: false,
      error: `Erreur lors de la suppression des données : ${rpcError.message}`,
    };
  }

  // 2. Supprimer les fichiers Storage
  try {
    const folders = [`uploads/${userId}`, `results/${userId}`];
    for (const folder of folders) {
      const { data: files } = await supabase.storage
        .from("forecasts")
        .list(folder, { limit: 1000 });

      if (files && files.length > 0) {
        const paths = files.map((f) => `${folder}/${f.name}`);
        await supabase.storage.from("forecasts").remove(paths);
      }
    }
  } catch {
    // Non-bloquant : les fichiers orphelins seront nettoyés plus tard
    console.warn("Avertissement : certains fichiers n'ont pas pu être supprimés");
  }

  // 3. Supprimer l'utilisateur Auth via le client admin (service_role)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return {
      success: false,
      error: "Configuration serveur incomplète (clé service manquante)",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return {
      success: false,
      error: "Configuration serveur incomplète (URL Supabase manquante)",
    };
  }

  const adminClient = createSupabaseClient(
    supabaseUrl,
    serviceRoleKey
  );

  const { error: deleteAuthError } =
    await adminClient.auth.admin.deleteUser(userId);

  if (deleteAuthError) {
    return {
      success: false,
      error: `Erreur lors de la suppression du compte : ${deleteAuthError.message}`,
    };
  }

  return { success: true };
}
