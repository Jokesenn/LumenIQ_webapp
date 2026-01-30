export function HowItWorks() {
  return (
    <section className="py-[120px] px-6 bg-zinc-950/50">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-[40px] font-bold mb-4 tracking-[-0.01em] text-gradient">
            De l&apos;upload au forecast :<br />5 minutes chrono
          </h2>
        </div>

        <div className="relative grid md:grid-cols-4 gap-8">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-white/[0.1]" />

          <StepCard
            number={1}
            title="Upload CSV"
            description="Glissez votre fichier historique. Détection automatique des colonnes dates et valeurs."
          />
          <StepCard
            number={2}
            title="Configuration auto"
            description="Fréquence, saisonnalité, classification ABC/XYZ détectées sans intervention."
          />
          <StepCard
            number={3}
            title="Calcul (2-5 min)"
            description="21 modèles en compétition, backtesting multi-fold, sélection du champion par série."
          />
          <StepCard
            number={4}
            title="Résultats"
            description="Dashboard interactif, métriques de fiabilité, export ZIP complet."
          />
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="relative text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl font-bold text-indigo-400 mx-auto mb-5">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
