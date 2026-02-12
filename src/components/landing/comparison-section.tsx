"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, GitCompareArrows } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, TiltCard } from "@/components/animations";
import { cn } from "@/lib/utils";

interface ComparisonItem {
  text: string;
  good?: boolean;
  bad?: boolean;
}

interface ComparisonCardProps {
  id: string;
  title: string;
  subtitle: string;
  items: ComparisonItem[];
  badge: string;
  badgeColor: string;
  highlight?: boolean;
  hoveredCard: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ComparisonSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="comparison" aria-label="Comparatif" className="relative py-24 overflow-hidden bg-zinc-925 section-glow-top">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <FadeIn>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <GitCompareArrows className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-zinc-300">Comparatif</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gradient">Le forecasting professionnel,</span>
              <br />
              <span className="text-white">enfin accessible aux PME</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Ni Excel approximatif, ni solutions enterprise à 20k€/an.
              LumenIQ comble le gap avec une précision pro à prix PME.
            </p>
          </FadeIn>
        </div>

        <StaggerChildren staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
          <StaggerItem>
            <ComparisonCard
              id="excel"
              title="Excel / Sheets"
              subtitle="Approximations manuelles"
              items={[
                { text: "Moyennes mobiles basiques", bad: true },
                { text: "Pas de validation statistique", bad: true },
                { text: "Erreur élevée et non mesurée", bad: true },
                { text: "Pas de saisonnalité détectée", bad: true },
              ]}
              badge="Gratuit mais risqué"
              badgeColor="#f59e0b"
              hoveredCard={hoveredCard}
              onMouseEnter={() => setHoveredCard("excel")}
              onMouseLeave={() => setHoveredCard(null)}
            />
          </StaggerItem>
          <StaggerItem>
            <ComparisonCard
              id="lumeniq"
              title="LumenIQ"
              subtitle="Le juste équilibre"
              items={[
                { text: "Jusqu'à 24 modèles stats/ML", good: true },
                { text: "Validation automatique sur votre historique", good: true },
                { text: "Priorisation intelligente de vos produits stars", good: true },
                { text: "60% plus rapide que les solutions enterprise", good: true },
              ]}
              badge="Dès 99 €/mois"
              badgeColor="#6366f1"
              highlight={true}
              hoveredCard={hoveredCard}
              onMouseEnter={() => setHoveredCard("lumeniq")}
              onMouseLeave={() => setHoveredCard(null)}
            />
          </StaggerItem>
          <StaggerItem>
            <ComparisonCard
              id="enterprise"
              title="Enterprise"
              subtitle="DataRobot, H2O, SAP..."
              items={[
                { text: "Modèles sophistiqués", good: true },
                { text: "Setup complexe, équipe data requise", bad: true },
                { text: "Coût : €2000+/mois", bad: true },
                { text: "Overkill pour PME", bad: true },
              ]}
              badge="Surdimensionné"
              badgeColor="#71717a"
              hoveredCard={hoveredCard}
              onMouseEnter={() => setHoveredCard("enterprise")}
              onMouseLeave={() => setHoveredCard(null)}
            />
          </StaggerItem>
        </StaggerChildren>
      </div>
    </section>
  );
}

function ComparisonCard({
  id,
  title,
  subtitle,
  items,
  badge,
  badgeColor,
  highlight,
  hoveredCard,
  onMouseEnter,
  onMouseLeave,
}: ComparisonCardProps) {
  const isExcel = id === "excel";
  const isLumenIQ = id === "lumeniq";
  const isEnterprise = id === "enterprise";

  // When LumenIQ is hovered, non-LumenIQ cards recede
  const shouldRecede = hoveredCard === "lumeniq" && !isLumenIQ;

  return (
    <TiltCard className="h-full">
      <motion.div
        className={cn(
          "relative h-full p-8 rounded-2xl spotlight transition-all duration-300",
          highlight
            ? "bg-zinc-900/50 backdrop-blur-xl border-2 border-indigo-500/50 scale-[1.02] shadow-[0_0_40px_rgba(99,102,241,0.15)] bg-gradient-to-b from-indigo-500/10 to-transparent"
            : "bg-zinc-900/50 backdrop-blur-xl border border-white/5 hover:border-white/10",
          isExcel && "border-t-2 border-amber-500/30 opacity-90",
        )}
        style={{
          opacity: shouldRecede ? 0.7 : undefined,
          transform: shouldRecede ? "scale(0.98)" : undefined,
        }}
        whileHover={{ y: -5 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          e.currentTarget.style.setProperty('--spotlight-x', `${x}%`);
          e.currentTarget.style.setProperty('--spotlight-y', `${y}%`);
        }}
      >
        {/* Enterprise watermark */}
        {isEnterprise && (
          <span className="absolute top-4 right-4 text-5xl font-bold text-white/[0.03] select-none">2000+€</span>
        )}

        {/* RECOMMANDE badge inside card */}
        {highlight && (
          <motion.div
            className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-xs font-semibold text-white mb-4"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            RECOMMANDÉ
          </motion.div>
        )}

        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ backgroundColor: `color-mix(in srgb, ${badgeColor} 20%, transparent)`, color: badgeColor }}
        >
          {badge}
        </span>
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-500 mb-6">{subtitle}</p>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.good ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
              ) : item.bad ? (
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 text-red-400" />
                </div>
              ) : null}
              <span
                className={cn(
                  "text-sm text-zinc-300",
                  isExcel && item.bad && "line-through text-zinc-500"
                )}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </TiltCard>
  );
}
