"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RotateCcw, Download, Loader2, AlertTriangle } from "lucide-react";
import { useProfile, formatPlanName } from "@/hooks/use-profile";
import { useSupabase, useUser } from "@/hooks/use-supabase";
import { resetOnboarding } from "@/lib/onboarding";
import { PLANS } from "@/lib/pricing-config";
import { ThresholdSettings } from "@/components/dashboard/threshold-settings";
import { exportUserData, deleteAccount } from "./actions";

export default function SettingsPage() {
  const { user } = useUser();
  const { profile, loading, refetch } = useProfile();
  const supabase = useSupabase();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Export state
  const [exporting, setExporting] = useState(false);

  // Delete account state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  // Export des données (Article 20 RGPD)
  const handleExportData = async () => {
    setExporting(true);
    try {
      const result = await exportUserData();
      if (!result.success || !result.data) {
        throw new Error(result.error ?? "Erreur lors de l'export");
      }

      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lumeniq-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erreur lors de l'export",
      });
    } finally {
      setExporting(false);
    }
  };

  // Suppression du compte (Article 17 RGPD)
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);

    const result = await deleteAccount();

    if (!result.success) {
      setDeleteError(result.error ?? "Erreur lors de la suppression");
      setDeleting(false);
      return;
    }

    // Déconnexion et redirection
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Quota et prix depuis la source unique pricing-config
  const getSeriesQuota = (plan: string) => PLANS[plan]?.series ?? 50;
  const getPlanPrice = (plan: string) => PLANS[plan]?.price ?? 99;

  const handleResetOnboarding = () => {
    resetOnboarding();
    router.push("/dashboard/results");
  };

  const seriesQuota = profile ? getSeriesQuota(profile.plan) : 50;
  const seriesUsed = profile?.series_used_this_period ?? 0;
  const usagePercent = Math.min((seriesUsed / seriesQuota) * 100, 100);

  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h1 className="dash-page-title mb-2">Paramètres</h1>
        <p className="text-zinc-400">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="dash-card p-6">
          <h3 className="dash-section-title mb-5">Profil</h3>

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
        <div className="dash-card p-6">
          <h3 className="dash-section-title mb-5">Abonnement</h3>
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
            <Button variant="secondary" disabled className="opacity-60">
              Gérer la facturation
              <span className="ml-2 text-[10px] bg-zinc-700 px-1.5 py-0.5 rounded">Bientôt</span>
            </Button>
            {profile?.plan !== "premium" && (
              <Button variant="ghost" disabled className="opacity-60">
                {profile?.plan === "standard" ? "Passer au plan ML" : "Passer au plan Premium"}
                <span className="ml-2 text-[10px] bg-zinc-700 px-1.5 py-0.5 rounded">Bientôt</span>
              </Button>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="dash-card p-6">
          <h3 className="dash-section-title mb-5">Préférences</h3>
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
                  Résumé de vos prévisions chaque lundi
                </p>
              </div>
              <ToggleSwitch />
            </div>
            <p className="text-[11px] text-zinc-600 italic">
              Ces préférences seront bientôt sauvegardées automatiquement.
            </p>
          </div>
        </div>

        {/* Seuils d'affichage */}
        <ThresholdSettings />

        {/* API (Premium) */}
        <div
          className={`dash-card p-6 ${
            profile?.plan !== "premium" ? "opacity-60" : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-5">
            <h3 className="dash-section-title">API</h3>
            {profile?.plan !== "premium" && (
              <span className="px-2 py-0.5 bg-amber-500/20 rounded text-[10px] font-semibold text-amber-400">
                PREMIUM
              </span>
            )}
          </div>
          {profile?.plan === "premium" && profile?.api_key ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                Votre clé API pour automatiser vos prévisions
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
                automatiser vos prévisions.
              </p>
              <Button variant="secondary" disabled={profile?.plan !== "premium"}>
                Débloquer l&apos;API
              </Button>
            </>
          )}
        </div>

        {/* Aide & Onboarding */}
        <div className="dash-card p-6">
          <h3 className="dash-section-title mb-5">Aide</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-sm text-white">Guide interactif</p>
              <p className="text-xs text-zinc-500">
                Relancer le tutoriel de la page résultats
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleResetOnboarding}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Revoir le guide
            </Button>
          </div>
        </div>

        {/* Vos données (RGPD) */}
        <div className="dash-card p-6">
          <h3 className="dash-section-title mb-5">Vos données</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-medium text-sm text-white">Exporter mes données</p>
                <p className="text-xs text-zinc-500">
                  Téléchargez une copie de toutes vos données au format JSON
                  (Article 20 RGPD)
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={handleExportData}
                disabled={exporting}
                className="gap-2 shrink-0"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {exporting ? "Export en cours..." : "Exporter"}
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="md:col-span-2 dash-card p-6 !border-red-500/30">
          <h3 className="text-base font-semibold text-red-500 mb-4">
            Zone de danger
          </h3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-medium text-sm text-white">Supprimer le compte</p>
              <p className="text-xs text-zinc-500">
                Cette action est irréversible. Toutes vos données seront
                définitivement supprimées.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteDialogOpen(true);
                setDeleteConfirmText("");
                setDeleteError(null);
              }}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Supprimer votre compte
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Cette action est <strong className="text-red-400">irréversible</strong>.
              Toutes vos données seront définitivement supprimées :
              prévisions, résultats, fichiers et paramètres.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {deleteError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                {deleteError}
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Tapez <strong className="text-white">SUPPRIMER</strong> pour confirmer
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                disabled={deleting}
                className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent disabled:opacity-50"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "SUPPRIMER" || deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Suppression...
                </>
              ) : (
                "Supprimer définitivement"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
