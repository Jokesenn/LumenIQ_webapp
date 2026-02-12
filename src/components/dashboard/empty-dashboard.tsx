import Link from "next/link";
import { Upload, Sparkles, BarChart3, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyDashboard() {
  return (
    <div className="dash-card dash-empty-hex p-12">
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} className="text-indigo-400" />
        </div>

        {/* Title & Description */}
        <h2 className="dash-section-title mb-2">
          Bienvenue sur LumenIQ
        </h2>
        <p className="text-zinc-400 mb-6">
          Lancez votre première prévision en quelques clics et découvrez la
          puissance de nos 21 méthodes de prévision.
        </p>

        {/* Steps */}
        <div className="text-left space-y-4 mb-8">
          <StepItem
            icon={<Upload size={16} />}
            title="1. Importez votre fichier"
            description="CSV ou XLSX avec vos données historiques"
          />
          <StepItem
            icon={<BarChart3 size={16} />}
            title="2. Analyse automatique"
            description="Classification ABC/XYZ et sélection du meilleur modèle"
          />
          <StepItem
            icon={<FileCheck size={16} />}
            title="3. Résultats complets"
            description="Prévisions, métriques et rapport PDF téléchargeable"
          />
        </div>

        {/* CTA */}
        <Link href="/dashboard/forecast">
          <Button className="w-full justify-center bg-indigo-500 hover:bg-indigo-600 text-white">
            <Upload size={18} />
            Lancer ma première prévision
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StepItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}
