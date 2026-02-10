"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Upload, BarChart3, Sparkles, Download, ArrowRight } from "lucide-react";
import { Navbar, Footer } from "@/components/shared";
import { FadeIn, MagneticButton, StaggerChildren, StaggerItem } from "@/components/animations";

const highlights = [
  {
    icon: Upload,
    title: "Import instantané",
    description:
      "Glissez votre fichier CSV ou Excel. LumenIQ détecte automatiquement le format, la fréquence et les séries.",
  },
  {
    icon: BarChart3,
    title: "21 modèles en compétition",
    description:
      "Chaque série est analysée par jusqu\u2019à 21 modèles statistiques et ML. Le champion est sélectionné par validation croisée.",
  },
  {
    icon: Sparkles,
    title: "Synthèse intelligente",
    description:
      "Un rapport exécutif en français résume vos résultats, identifie les alertes et propose des actions concrètes.",
  },
  {
    icon: Download,
    title: "Export complet",
    description:
      "Téléchargez vos prévisions, métriques et rapports au format CSV et PDF, prêts pour votre ERP ou BI.",
  },
];

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-[900px] mx-auto text-center">
            <FadeIn>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Play className="w-4 h-4 text-indigo-400" />
                </motion.div>
                <span className="text-sm text-zinc-300">Démo produit</span>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.02em] text-white mb-6">
                Découvrez LumenIQ{" "}
                <span className="text-gradient-brand">en action</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-zinc-400 max-w-[650px] mx-auto leading-relaxed">
                De l&apos;import de votre fichier aux prévisions détaillées :
                voyez comment LumenIQ transforme vos données en décisions
                d&apos;approvisionnement fiables en quelques minutes.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Video Placeholder */}
        <section className="px-6 pb-20">
          <FadeIn delay={0.3}>
            <div className="max-w-[960px] mx-auto">
              <motion.div
                className="glass-card p-1 glow-accent-lg"
                whileHover={{ scale: 1.005 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="relative rounded-xl bg-zinc-900/80 border border-white/[0.04] aspect-video flex flex-col items-center justify-center gap-6 overflow-hidden">
                  {/* Subtle animated gradient background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Play button */}
                  <motion.div
                    className="relative z-10 w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-14 h-14 rounded-full bg-indigo-500/30 flex items-center justify-center">
                      <Play className="w-6 h-6 text-indigo-300 ml-0.5" fill="currentColor" />
                    </div>
                  </motion.div>

                  {/* Text */}
                  <div className="relative z-10 text-center px-6">
                    <p className="text-base font-medium text-zinc-300 mb-1">
                      Démo vidéo à venir
                    </p>
                    <p className="text-sm text-zinc-500">
                      Nous préparons une visite guidée du produit
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeIn>
        </section>

        {/* Highlights Grid */}
        <section className="py-20 px-6">
          <div className="max-w-[1000px] mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ce que vous verrez dans la démo
                </h2>
                <p className="text-zinc-400 max-w-[500px] mx-auto">
                  Quatre étapes clés qui transforment votre historique de ventes
                  en prévisions actionnables.
                </p>
              </div>
            </FadeIn>

            <StaggerChildren className="grid sm:grid-cols-2 gap-6">
              {highlights.map((item, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    className="glass-card p-6 h-full group"
                    whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.2)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                      <item.icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-indigo-950/20 to-zinc-950" />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Essayer gratuitement
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-lg text-zinc-400 mb-8 max-w-[500px] mx-auto">
                Essai gratuit 3 mois. Aucun engagement, aucune carte bancaire requise.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link href="/login?mode=signup">
                <MagneticButton className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-white glow-accent transition-all">
                  Créer mon compte gratuit
                  <motion.span className="group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
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
