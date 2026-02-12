"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { FadeIn } from "@/components/animations";

const benefits = [
  {
    icon: Clock,
    highlight: "2 jours/mois",
    title: "Gagnez du temps",
    description:
      "Automatisez vos prévisions. Éliminez les fichiers Excel. Récupérez 16 jours par an pour des tâches à plus forte valeur.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingDown,
    highlight: "-15 à 30%",
    title: "Réduisez vos ruptures",
    description:
      "Prévisions fiables = moins de stock mort, moins de ventes perdues. Optimisez vos réapprovisionnements en confiance.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: TrendingUp,
    highlight: "+2 à 5%",
    title: "Améliorez votre marge",
    description:
      "Moins de surstocks, moins de démarques. Chaque euro investi dans la prévision en rapporte 10 en optimisation.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export function RoiSection() {
  return (
    <section id="roi" aria-label="ROI et bénéfices concrets" className="relative py-24 overflow-hidden">
      {/* Centered glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeIn>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-zinc-300">ROI mesurable</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gradient">Des résultats concrets,</span>
              <br />
              <span className="text-white">mesurables dès le premier mois</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              LumenIQ ne promet pas, il prouve. Chaque prévision est validée sur votre historique.
            </p>
          </FadeIn>
        </div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
            >
              {/* Small icon above the metric */}
              <div className="flex justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-zinc-500" />
              </div>

              {/* Large animated metric */}
              <p className={`text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent`}>
                {benefit.highlight}
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>

              {/* Decorative gradient line */}
              <div className={`w-12 h-0.5 bg-gradient-to-r ${benefit.gradient} mx-auto mb-4 rounded-full`} />

              <p className="text-zinc-400 leading-relaxed max-w-xs mx-auto">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
