"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useProfile, formatPlanName } from "@/hooks/use-profile";
import { useSupabase, useUser } from "@/hooks/use-supabase";

export default function SettingsPage() {
  const { user } = useUser();
  const { profile, loading, refetch } = useProfile();
  const supabase = useSupabase();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Initialiser les valeurs du formulaire quand le profil est chargé
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setEmail(profile.email ?? "");
    } else if (user) {
      setEmail(user.email ?? "");
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase
        .schema("lumeniq")
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setSaveMessage({ type: "success", text: "Profil mis à jour avec succès" });
      refetch();
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erreur lors de la sauvegarde",
      });
    } finally {
      setSaving(false);
    }
  };

  // Calculer le quota de séries basé sur le plan
  const getSeriesQuota = (plan: string) => {
    const quotas: Record<string, number> = {
      standard: 50,
      ml: 200,
      premium: 1000,
    };
    return quotas[plan] || 50;
  };

  // Calculer le prix basé sur le plan
  const getPlanPrice = (plan: string) => {
    const prices: Record<string, number> = {
      standard: 99,
      ml: 249,
      premium: 499,
    };
    return prices[plan] || 99;
  };

  const seriesQuota = profile ? getSeriesQuota(profile.plan) : 50;
  const seriesUsed = profile?.series_used_this_period ?? 0;
  const usagePercent = Math.min((seriesUsed / seriesQuota) * 100, 100);

  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white mb-2">Paramètres</h1>
        <p className="text-zinc-400">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-zinc-900/50 rounded-xl border border-white/[0.08] p-6">
          <h3 className="text-base font-semibold text-white mb-5">Profil</h3>

          {saveMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                saveMessage.type === "success"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                  : "bg-red-500/10 text-red-400 border border-red-500/30"
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom"
                disabled={loading}
                className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-500 mt-1">
                L&apos;email ne peut pas être modifié
              </p>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={saving || loading}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-zinc-900/50 rounded-xl border border-white/[0.08] p-6">
          <h3 className="text-base font-semibold text-white mb-5">Abonnement</h3>
          <div className="p-5 bg-indigo-500/10 rounded-xl mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-white">
                {loading ? (
                  <span className="animate-pulse">Chargement...</span>
                ) : (
                  `Plan ${formatPlanName(profile?.plan ?? "standard")}`
                )}
              </span>
              <span className="text-2xl font-bold text-white">
                €{profile ? getPlanPrice(profile.plan) : "--"}
                <span className="text-sm font-normal text-zinc-400">/mois</span>
              </span>
            </div>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Séries utilisées ce mois</span>
              <span>
                {seriesUsed} / {seriesQuota}
              </span>
            </div>
            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {profile?.subscription_status && (
              <div className="mt-3 text-xs text-zinc-500">
                Statut : {profile.subscription_status === "trialing" ? "Période d'essai" : profile.subscription_status}
                {profile.trial_ends_at && (
                  <span>
                    {" "}
                    (fin le{" "}
                    {new Date(profile.trial_ends_at).toLocaleDateString("fr-FR")}
                    )
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Gérer la facturation</Button>
            {profile?.plan !== "premium" && (
              <Button variant="ghost">
                {profile?.plan === "standard" ? "Passer à ML" : "Passer à Premium"}
              </Button>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-zinc-900/50 rounded-xl border border-white/[0.08] p-6">
          <h3 className="text-base font-semibold text-white mb-5">Préférences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm text-white">Notifications email</p>
                <p className="text-xs text-zinc-500">
                  Recevoir les alertes par email
                </p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm text-white">Rapport hebdomadaire</p>
                <p className="text-xs text-zinc-500">
                  Résumé de vos forecasts chaque lundi
                </p>
              </div>
              <ToggleSwitch />
            </div>
          </div>
        </div>

        {/* API (Foundation) */}
        <div
          className={`bg-zinc-900/50 rounded-xl border border-white/[0.08] p-6 ${
            profile?.plan !== "premium" ? "opacity-60" : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-base font-semibold text-white">API</h3>
            {profile?.plan !== "premium" && (
              <span className="px-2 py-0.5 bg-amber-500/20 rounded text-[10px] font-semibold text-amber-400">
                PREMIUM
              </span>
            )}
          </div>
          {profile?.plan === "premium" && profile?.api_key ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                Votre clé API pour automatiser vos forecasts
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={profile.api_key}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-sm font-mono text-white"
                />
                <Button
                  variant="secondary"
                  onClick={() => navigator.clipboard.writeText(profile.api_key!)}
                >
                  Copier
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-400 mb-4">
                Passez au plan Premium pour accéder à l&apos;API REST et
                automatiser vos forecasts.
              </p>
              <Button variant="secondary" disabled={profile?.plan !== "premium"}>
                Débloquer l&apos;API
              </Button>
            </>
          )}
        </div>

        {/* Danger Zone */}
        <div className="md:col-span-2 bg-zinc-900/50 rounded-xl border border-red-500/30 p-6">
          <h3 className="text-base font-semibold text-red-500 mb-4">
            Zone de danger
          </h3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-medium text-sm text-white">Supprimer le compte</p>
              <p className="text-xs text-zinc-500">
                Cette action est irréversible. Toutes vos données seront
                supprimées.
              </p>
            </div>
            <Button variant="destructive">Supprimer mon compte</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors ${
        checked ? "bg-indigo-500" : "bg-white/10"
      } border ${checked ? "border-indigo-500" : "border-white/[0.08]"}`}
    >
      <div
        className={`w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-all ${
          checked ? "left-[22px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}
