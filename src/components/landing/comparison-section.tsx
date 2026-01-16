import { Check, X } from "lucide-react";

interface ComparisonItem {
  text: string;
  good?: boolean;
  bad?: boolean;
}

interface ComparisonCardProps {
  title: string;
  subtitle: string;
  items: ComparisonItem[];
  badge: string;
  badgeColor: string;
  highlight?: boolean;
}

export function ComparisonSection() {
  return (
    <section className="py-[120px] px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-[40px] font-bold mb-4 tracking-[-0.01em]">
            Le forecasting professionnel,<br />enfin accessible aux PME
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-[600px] mx-auto">
            Ni Excel approximatif, ni solutions enterprise à €20k/an.
            LumenIQ comble le gap avec une précision pro à prix PME.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ComparisonCard
            title="Excel / Sheets"
            subtitle="Approximations manuelles"
            items={[
              { text: "Moyennes mobiles basiques", bad: true },
              { text: "Pas de validation statistique", bad: true },
              { text: "Erreur forecast : 30-50%", bad: true },
              { text: "Pas de saisonnalité détectée", bad: true },
            ]}
            badge="Gratuit mais risqué"
            badgeColor="var(--warning)"
          />
          <ComparisonCard
            title="LumenIQ"
            subtitle="Le juste équilibre"
            items={[
              { text: "21 modèles statistiques/ML", good: true },
              { text: "Backtesting multi-fold automatique", good: true },
              { text: "Routing ABC/XYZ (unique)", good: true },
              { text: "~60% réduction temps calcul", good: true },
            ]}
            badge="€99-249/mois"
            badgeColor="var(--accent)"
            highlight={true}
          />
          <ComparisonCard
            title="Enterprise"
            subtitle="DataRobot, H2O, SAP..."
            items={[
              { text: "Modèles sophistiqués", good: true },
              { text: "Setup complexe, équipe data requise", bad: true },
              { text: "Coût : €2000+/mois", bad: true },
              { text: "Overkill pour PME", bad: true },
            ]}
            badge="Surdimensionné"
            badgeColor="var(--text-muted)"
          />
        </div>
      </div>
    </section>
  );
}

function ComparisonCard({
  title,
  subtitle,
  items,
  badge,
  badgeColor,
  highlight,
}: ComparisonCardProps) {
  return (
    <div
      className={`relative rounded-2xl border p-7 ${
        highlight
          ? "bg-[var(--accent-muted)] border-2 border-[var(--accent)]"
          : "bg-[var(--bg-surface)] border-[var(--border)]"
      }`}
    >
      {highlight && (
        <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white px-3 py-1 rounded-full text-xs font-semibold">
          RECOMMANDÉ
        </div>
      )}
      <span
        className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-4"
        style={{ backgroundColor: `color-mix(in srgb, ${badgeColor} 20%, transparent)`, color: badgeColor }}
      >
        {badge}
      </span>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-[13px] text-[var(--text-muted)] mb-5">{subtitle}</p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {item.good ? (
              <Check size={16} className="text-[var(--success)]" />
            ) : item.bad ? (
              <X size={16} className="text-[var(--danger)]" />
            ) : null}
            <span className="text-[13px] text-[var(--text-secondary)]">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
