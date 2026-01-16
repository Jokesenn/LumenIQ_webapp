"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold mb-2">Paramètres</h1>
        <p className="text-[var(--text-secondary)]">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-base font-semibold mb-5">Profil</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Nom complet
              </label>
              <input
                type="text"
                defaultValue="Jean Dupont"
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="jean@entreprise.com"
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>
            <Button className="mt-2">Sauvegarder</Button>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-base font-semibold mb-5">Abonnement</h3>
          <div className="p-5 bg-[var(--accent-muted)] rounded-xl mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Plan Standard</span>
              <span className="text-2xl font-bold">
                €99<span className="text-sm font-normal">/mois</span>
              </span>
            </div>
            <div className="flex justify-between text-sm text-[var(--text-secondary)]">
              <span>Séries utilisées ce mois</span>
              <span>12 / 50</span>
            </div>
            <div className="mt-3 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full"
                style={{ width: "24%" }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Gérer la facturation</Button>
            <Button variant="ghost">Passer à ML</Button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-base font-semibold mb-5">Préférences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Notifications email</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Recevoir les alertes par email
                </p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Rapport hebdomadaire</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Résumé de vos forecasts chaque lundi
                </p>
              </div>
              <ToggleSwitch />
            </div>
          </div>
        </div>

        {/* API (Foundation) */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6 opacity-60">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-base font-semibold">API</h3>
            <span className="px-2 py-0.5 bg-[#F59E0B]/20 rounded text-[10px] font-semibold text-[#F59E0B]">
              FOUNDATION
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Passez au plan Foundation pour accéder à l&apos;API REST et
            automatiser vos forecasts.
          </p>
          <Button variant="secondary" disabled>
            Débloquer l&apos;API
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="md:col-span-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--danger)]/30 p-6">
          <h3 className="text-base font-semibold text-[var(--danger)] mb-4">
            Zone de danger
          </h3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-medium text-sm">Supprimer le compte</p>
              <p className="text-xs text-[var(--text-muted)]">
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
        checked ? "bg-[var(--accent)]" : "bg-[var(--bg-surface)]"
      } border ${checked ? "border-[var(--accent)]" : "border-[var(--border)]"}`}
    >
      <div
        className={`w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-all ${
          checked ? "left-[22px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}
