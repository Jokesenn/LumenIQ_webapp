"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

const TIPS = [
  {
    title: "Vos produits classés par importance",
    body: "Vos produits sont classés A, B ou C selon leur poids dans votre chiffre d'affaires. Les best-sellers (A) sont analysés avec plus de précision.",
  },
  {
    title: "Validation sur vos données réelles",
    body: "Chaque méthode de calcul est testée sur plusieurs périodes de votre historique pour s'assurer qu'elle prédit correctement vos ventes passées.",
  },
  {
    title: "21 méthodes comparées",
    body: "De la moyenne mobile simple aux algorithmes les plus avancés, chaque produit est confronté aux approches les mieux adaptées à son profil de ventes.",
  },
  {
    title: "Le meilleur modèle retenu",
    body: "Pour chaque produit, la méthode la plus précise sur vos données historiques est automatiquement retenue comme « champion ». C'est du sur-mesure.",
  },
  {
    title: "Garde-fou automatique",
    body: "Si les prévisions semblent aberrantes, un garde-fou s'active automatiquement pour ajuster les résultats et éviter les erreurs grossières.",
  },
  {
    title: "Prévisibilité de vos produits",
    body: "Vos produits sont classés X (stables), Y (variables) ou Z (erratiques). Cela vous indique sur quels produits les prévisions sont les plus fiables.",
  },
];

const ROTATE_INTERVAL = 8000;

export function EnrichedWaiting() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TIPS.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const tip = TIPS[currentIndex];

  return (
    <div className="mt-6 p-5 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex-1 min-h-[60px]">
          <p className="text-xs text-indigo-400/70 uppercase tracking-wide mb-1">
            Le saviez-vous ?
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-medium text-white mb-1">{tip.title}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{tip.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {TIPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex
                ? "bg-indigo-400 w-4"
                : "bg-white/10 hover:bg-white/20 w-1.5"
            }`}
            aria-label={`Astuce ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
