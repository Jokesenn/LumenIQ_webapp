import Link from "next/link";
import { Upload, Sparkles, BarChart3, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyDashboard() {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-8">
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} className="text-[var(--accent)]" />
        </div>

        {/* Title & Description */}
        <h2 className="text-xl font-semibold mb-2">
          Bienvenue sur LumenIQ
        </h2>
        <p className="text-[var(--text-muted)] mb-6">
          Lancez votre premier forecast en quelques clics et découvrez la
          puissance de nos 15 modèles de prévision.
        </p>

        {/* Steps */}
        <div className="text-left space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
              <Upload size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium">1. Uploadez votre fichier</p>
              <p className="text-xs text-[var(--text-muted)]">
                CSV ou XLSX avec vos données historiques
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
              <BarChart3 size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium">2. Analyse automatique</p>
              <p className="text-xs text-[var(--text-muted)]">
                Classification ABC/XYZ et sélection du meilleur modèle
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
              <FileCheck size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium">3. Résultats complets</p>
              <p className="text-xs text-[var(--text-muted)]">
                Prévisions, métriques et rapport PDF téléchargeable
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link href="/dashboard/forecast">
          <Button className="w-full justify-center">
            <Upload size={18} />
            Lancer mon premier forecast
          </Button>
        </Link>
      </div>
    </div>
  );
}
