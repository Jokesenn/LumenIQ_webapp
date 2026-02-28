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
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/15",
  },
  {
    id: "lumeniq",
    title: "LumenIQ",
    subtitle: "Le juste équilibre",
    items: [
      { text: "Jusqu'à 24 modèles stats/ML", good: true },
      { text: "Validation automatique sur votre historique", good: true },
      { text: "Priorisation intelligente de vos produits stars", good: true },
      { text: "60% plus rapide que les solutions enterprise", good: true },
    ],
    badge: "Dès 99 EUR/mois",
    badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/15",
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
    badgeColor: "text-zinc-400 bg-zinc-500/10 border-zinc-500/15",
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
      <div className="absolute inset-0 bg-zinc-925" />
      <div className="absolute inset-0 bg-iso-lines opacity-50" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        {/* Section header — asymmetric with number watermark */}
        <div className="relative mb-20">
          <div className="absolute -top-8 left-0 section-number">01</div>
          <div className="relative z-10 max-w-2xl">
            <FadeIn>
              <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                Comparatif
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-[-0.03em] leading-[1.05]">
                <span className="text-white">Le forecasting pro,</span>
                <br />
                <span className="text-gradient">enfin accessible aux PME</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-zinc-400 mt-6 max-w-lg font-light leading-relaxed">
                Ni Excel approximatif, ni solutions enterprise à 20k EUR/an.
                LumenIQ comble le gap avec une précision pro à prix PME.
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
                      "relative h-full p-8 rounded-2xl transition-all duration-500 spotlight",
                      col.highlight
                        ? "bg-zinc-900/60 backdrop-blur-xl border-2 border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.1)] bg-gradient-to-b from-indigo-500/[0.06] to-transparent"
                        : "bg-zinc-900/40 backdrop-blur-xl border border-white/[0.05] hover:border-white/[0.08]",
                      col.id === "excel" && "border-t-2 border-t-amber-500/20"
                    )}
                    style={{
                      opacity: shouldRecede ? 0.6 : undefined,
                      transform: shouldRecede ? "scale(0.97)" : undefined,
                    }}
                    whileHover={{ y: -8 }}
                    onMouseEnter={() => setHoveredCard(col.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty("--spotlight-x", `${x}%`);
                      e.currentTarget.style.setProperty("--spotlight-y", `${y}%`);
                    }}
                  >
                    {/* Enterprise watermark */}
                    {col.id === "enterprise" && (
                      <span className="absolute top-6 right-6 text-5xl font-800 text-white/[0.03] font-display select-none">
                        2000+
                      </span>
                    )}

                    {/* Recommended badge */}
                    {col.highlight && (
                      <motion.div
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-xs font-semibold text-white mb-5"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        RECOMMANDÉ
                      </motion.div>
                    )}

                    <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5 border", col.badgeColor)}>
                      {col.badge}
                    </span>

                    <h3 className="text-xl font-display font-700 text-white mb-1">{col.title}</h3>
                    <p className="text-sm text-zinc-500 mb-8">{col.subtitle}</p>

                    <div className="space-y-4">
                      {col.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-3">
                          {item.good ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                          ) : item.bad ? (
                            <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                              <X className="w-3 h-3 text-red-400/80" />
                            </div>
                          ) : null}
                          <span
                            className={cn(
                              "text-sm",
                              col.id === "excel" && item.bad
                                ? "line-through text-zinc-600"
                                : "text-zinc-300"
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
