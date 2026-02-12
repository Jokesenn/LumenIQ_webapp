"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Upload, BarChart3, Sparkles, Download, ArrowRight } from "lucide-react";
import { Navbar, Footer } from "@/components/shared";
import { FadeIn, MagneticButton, TiltCard, StaggerChildren, StaggerItem } from "@/components/animations";

const highlights = [
  {
    icon: Upload,
    title: "Import instantané",
    description:
      "Glissez votre fichier CSV ou Excel. LumenIQ détecte automatiquement le format, la fréquence et les séries.",
    metric: "30s",
  },
  {
    icon: BarChart3,
    title: "21 modèles en compétition",
    description:
      "Chaque série est analysée par jusqu\u2019à 21 modèles statistiques et ML. Le champion est sélectionné par validation croisée.",
    metric: "21",
  },
  {
    icon: Sparkles,
    title: "Synthèse intelligente",
    description:
      "Un rapport exécutif en français résume vos résultats, identifie les alertes et propose des actions concrètes.",
    metric: "IA",
  },
  {
    icon: Download,
    title: "Export complet",
    description:
      "Téléchargez vos prévisions, métriques et rapports au format CSV et PDF, prêts pour votre ERP ou BI.",
    metric: "ZIP",
  },
];

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* Hero */}
        <section className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text */}
              <div>
                <FadeIn>
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Play className="w-4 h-4 text-indigo-400" />
                    </motion.div>
                    <span className="text-sm text-zinc-300 font-display">Démo produit</span>
                  </motion.div>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 tracking-[-0.03em] leading-[0.95] text-white mb-6">
                    Découvrez
                    <br />
                    <span className="text-gradient-brand">LumenIQ</span>
                    <br />
                    <span className="font-300 text-zinc-400">en action</span>
                  </h1>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <p className="text-lg text-zinc-400 max-w-[500px] font-light leading-relaxed">
                    De l&apos;import de votre fichier aux prévisions détaillées :
                    voyez comment LumenIQ transforme vos données en décisions
                    d&apos;approvisionnement fiables en quelques minutes.
                  </p>
                </FadeIn>
              </div>

              {/* Video Placeholder */}
              <FadeIn delay={0.3}>
                <TiltCard>
                  <motion.div
                    className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 aspect-video flex flex-col items-center justify-center gap-6 overflow-hidden"
                    whileHover={{ borderColor: "rgba(99, 102, 241, 0.2)" }}
                  >
                    {/* Gradient glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Hex pattern overlay */}
                    <div className="absolute inset-0 bg-hex-pattern opacity-10" />

                    {/* Play button */}
                    <motion.div
                      className="relative z-10 w-20 h-20 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Play className="w-6 h-6 text-indigo-300 ml-0.5" fill="currentColor" />
                      </div>
                    </motion.div>

                    {/* Text */}
                    <div className="relative z-10 text-center px-6">
                      <p className="text-base font-display font-600 text-zinc-300 mb-1">
                        Démo vidéo à venir
                      </p>
                      <p className="text-sm text-zinc-500 font-light">
                        Nous préparons une visite guidée du produit
                      </p>
                    </div>
                  </motion.div>
                </TiltCard>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Highlights Grid */}
        <section className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <FadeIn>
              <div className="mb-16">
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  Aperçu
                </p>
                <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-[-0.03em] text-white">
                  Ce que vous verrez
                </h2>
                <p className="text-zinc-400 mt-4 max-w-[500px] font-light">
                  Quatre étapes clés qui transforment votre historique de ventes
                  en prévisions actionnables.
                </p>
              </div>
            </FadeIn>

            <StaggerChildren className="grid sm:grid-cols-2 gap-6">
              {highlights.map((item, index) => (
                <StaggerItem key={index}>
                  <TiltCard className="h-full">
                    <motion.div
                      className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 p-8 h-full group overflow-hidden"
                      whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.2)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {/* Metric watermark */}
                      <div className="absolute top-4 right-6 text-5xl font-display font-800 text-white/[0.03] group-hover:text-indigo-500/[0.06] transition-colors duration-500">
                        {item.metric}
                      </div>

                      <div className="relative z-10">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 group-hover:bg-indigo-500/15 transition-colors">
                          <item.icon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-display font-700 text-white mb-3">
                          {item.title}
                        </h3>
                        <p className="text-sm text-zinc-400 leading-relaxed font-light">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-indigo-950/20 to-zinc-950" />
            <div className="absolute inset-0 gradient-mesh opacity-80" />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/8 rounded-full blur-[160px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <div className="absolute inset-0 bg-hex-pattern opacity-20" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="font-display text-5xl sm:text-6xl font-800 tracking-[-0.03em] leading-[0.95] mb-8">
                <span className="text-white">Essayez</span>
                <br />
                <span className="text-gradient-brand">gratuitement</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-lg text-zinc-400 mb-10 max-w-[500px] mx-auto font-light">
                Essai gratuit 3 mois. Aucun engagement, aucune carte bancaire requise.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link href="/login?mode=signup">
                <MagneticButton className="group inline-flex items-center gap-2 px-10 py-5 bg-white text-zinc-900 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                  Créer mon compte gratuit
                  <motion.span className="group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </MagneticButton>
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
