"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { FadeIn, TiltCard } from "@/components/animations";
import { cn } from "@/lib/utils";

interface ComparisonItem {
  text: string;
  good?: boolean;
  bad?: boolean;
}

const columns: {
  id: string;
  title: string;
  subtitle: string;
  items: ComparisonItem[];
  badge: string;
  badgeColor: string;
  highlight?: boolean;
}[] = [
  {
    id: "excel",
    title: "Excel / Sheets",
    subtitle: "Approximations manuelles",
    items: [
      { text: "Moyennes mobiles basiques", bad: true },
      { text: "Pas de validation statistique", bad: true },
      { text: "Erreur élevée et non mesurée", bad: true },
      { text: "Pas de saisonnalité détectée", bad: true },
    ],
    badge: "Gratuit mais risque",
    badgeColor: "text-[var(--color-warning)] bg-[var(--color-warning-bg)] border-[var(--color-border)]",
  },
  {
    id: "lumeniq",
    title: "PREVYA",
    subtitle: "Le juste équilibre",
    items: [
      { text: "Jusqu'à 24 modèles stats/ML", good: true },
      { text: "Validation automatique sur votre historique", good: true },
      { text: "Priorisation intelligente de vos produits stars", good: true },
      { text: "60% plus rapide que les solutions enterprise", good: true },
    ],
    badge: "Dès 99 EUR/mois",
    badgeColor: "text-[var(--color-copper)] bg-[var(--color-copper-bg)] border-[var(--color-border)]",
    highlight: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    subtitle: "DataRobot, H2O, SAP...",
    items: [
      { text: "Modèles sophistiqués", good: true },
      { text: "Setup complexe, équipe data requise", bad: true },
      { text: "Coût : 2000+ EUR/mois", bad: true },
      { text: "Overkill pour PME", bad: true },
    ],
    badge: "Surdimensionné",
    badgeColor: "text-[var(--color-text-tertiary)] bg-[var(--color-bg-surface)] border-[var(--color-border)]",
  },
];

export function ComparisonSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="comparison"
      aria-label="Comparatif"
      className="relative py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--color-bg-surface)]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        {/* Section header — asymmetric with number watermark */}
        <div className="relative mb-20">
          <div className="absolute -top-8 left-0 section-number">01</div>
          <div className="relative z-10 max-w-2xl">
            <FadeIn>
              <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-[var(--color-copper)] mb-4">
                Comparatif
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-[-0.03em] leading-[1.05]">
                <span className="text-[var(--color-text)]">Le forecasting pro,</span>
                <br />
                <span className="text-gradient">enfin accessible aux PME</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-[var(--color-text-secondary)] mt-6 max-w-lg font-light leading-relaxed">
                Ni Excel approximatif, ni solutions enterprise à 20k EUR/an.
                PREVYA comble le gap avec une précision pro à prix PME.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Comparison cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {columns.map((col, i) => {
            const shouldRecede = hoveredCard === "lumeniq" && col.id !== "lumeniq";

            return (
              <FadeIn key={col.id} delay={0.1 * i}>
                <TiltCard className="h-full">
                  <motion.div
                    className={cn(
                      "relative h-full p-8 rounded-2xl transition-all duration-500",
                      col.highlight
                        ? "card-signal-accent bg-[var(--color-copper-bg-soft)]"
                        : "card-signal",
                      col.id === "excel" && "border-t-2 border-t-[var(--color-warning)]/20"
                    )}
                    style={{
                      opacity: shouldRecede ? 0.6 : undefined,
                      transform: shouldRecede ? "scale(0.97)" : undefined,
                    }}
                    whileHover={{ y: -8 }}
                    onMouseEnter={() => setHoveredCard(col.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Enterprise watermark */}
                    {col.id === "enterprise" && (
                      <span className="absolute top-6 right-6 text-5xl font-800 text-[var(--color-text)]/[0.03] font-display select-none">
                        2000+
                      </span>
                    )}

                    {/* Recommended badge */}
                    {col.highlight && (
                      <motion.div
                        className="inline-flex items-center gap-1.5 px-3 py-1 btn-copper rounded-full text-xs font-semibold text-white mb-5"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        RECOMMANDÉ
                      </motion.div>
                    )}

                    <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5 border", col.badgeColor)}>
                      {col.badge}
                    </span>

                    <h3 className="text-xl font-display font-700 text-[var(--color-text)] mb-1">{col.title}</h3>
                    <p className="text-sm text-[var(--color-text-tertiary)] mb-8">{col.subtitle}</p>

                    <div className="space-y-4">
                      {col.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-3">
                          {item.good ? (
                            <div className="w-5 h-5 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-[var(--color-success)]" />
                            </div>
                          ) : item.bad ? (
                            <div className="w-5 h-5 rounded-full bg-[var(--color-error-bg)] flex items-center justify-center flex-shrink-0">
                              <X className="w-3 h-3 text-[var(--color-error)]" />
                            </div>
                          ) : null}
                          <span
                            className={cn(
                              "text-sm",
                              col.id === "excel" && item.bad
                                ? "line-through text-[var(--color-text-tertiary)]"
                                : "text-[var(--color-text-secondary)]"
                            )}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TiltCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
