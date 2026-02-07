"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

const TIPS = [
  {
    title: "Classification ABC",
    body: "Vos séries sont classées par importance : A = 80% du volume, B = 15%, C = 5%. Les séries A bénéficient de plus de modèles candidats.",
  },
  {
    title: "Backtesting multi-fold",
    body: "Chaque modèle est évalué sur plusieurs fenêtres temporelles glissantes pour garantir une performance robuste et pas seulement ponctuelle.",
  },
  {
    title: "21 modèles testés",
    body: "De la moyenne mobile simple aux réseaux de neurones (N-BEATS, TFT), chaque série est confrontée aux algorithmes les plus adaptés à son profil.",
  },
  {
    title: "Modèle champion",
    body: "Le modèle avec le meilleur score SMAPE sur la validation croisée est automatiquement retenu comme « champion » pour chaque série.",
  },
  {
    title: "Gating automatique",
    body: "Si le meilleur modèle a une erreur trop élevée, un filtre de sécurité (gating) ajuste la prévision pour éviter les aberrations.",
  },
  {
    title: "Classification XYZ",
    body: "X = séries stables, Y = variabilité modérée, Z = erratique. Cette classification guide le choix des modèles les plus adaptés.",
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
