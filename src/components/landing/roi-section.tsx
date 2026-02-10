"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, TiltCard } from "@/components/animations";
import { AnimatedBackground } from "@/components/backgrounds";

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
    <section id="roi" aria-label="ROI et bénéfices concrets" className="relative py-20 overflow-hidden">
      <AnimatedBackground variant="section" />

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
        <StaggerChildren staggerDelay={0.1} className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <StaggerItem key={i}>
              <TiltCard className="h-full">
                <motion.div
                  className="group relative h-full p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all duration-500 spotlight"
                  whileHover={{ y: -5 }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty("--spotlight-x", `${x}%`);
                    e.currentTarget.style.setProperty("--spotlight-y", `${y}%`);
                  }}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} p-[1px] mb-6`}>
                    <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Highlight number */}
                  <p
                    className={`text-4xl font-bold mb-3 bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent`}
                  >
                    {benefit.highlight}
                  </p>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gradient transition-all">
                    {benefit.title}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
