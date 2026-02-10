"use client";

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
  title: string;
  subtitle: string;
  items: ComparisonItem[];
  badge: string;
  badgeColor: string;
  highlight?: boolean;
}

export function ComparisonSection() {
  return (
    <section id="comparison" aria-label="Comparatif" className="relative py-20 overflow-hidden">
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
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Ni Excel approximatif, ni solutions enterprise à 20k€/an.
              LumenIQ comble le gap avec une précision pro à prix PME.
            </p>
          </FadeIn>
        </div>

        <StaggerChildren staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
          <StaggerItem>
            <ComparisonCard
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
            />
          </StaggerItem>
          <StaggerItem>
            <ComparisonCard
              title="LumenIQ"
              subtitle="Le juste équilibre"
              items={[
                { text: "Jusqu'à 24 modèles stats/ML", good: true },
                { text: "Backtesting multi-fold automatique", good: true },
                { text: "Routing ABC/XYZ (unique)", good: true },
                { text: "~60% réduction temps calcul", good: true },
              ]}
              badge="Dès 99 €/mois"
              badgeColor="#6366f1"
              highlight={true}
            />
          </StaggerItem>
          <StaggerItem>
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
              badgeColor="#71717a"
            />
          </StaggerItem>
        </StaggerChildren>
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
    <TiltCard className="h-full">
      <motion.div
        className={cn(
          "relative h-full p-8 rounded-2xl spotlight",
          highlight
            ? "bg-zinc-900/50 backdrop-blur-xl border-2 border-indigo-500/50"
            : "bg-zinc-900/50 backdrop-blur-xl border border-white/5 hover:border-white/10"
        )}
        whileHover={{ y: -5 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          e.currentTarget.style.setProperty('--spotlight-x', `${x}%`);
          e.currentTarget.style.setProperty('--spotlight-y', `${y}%`);
        }}
      >
        {highlight && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <motion.div
              className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-xs font-semibold text-white"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              RECOMMANDÉ
            </motion.div>
          </div>
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
              <span className="text-sm text-zinc-400">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </TiltCard>
  );
}
