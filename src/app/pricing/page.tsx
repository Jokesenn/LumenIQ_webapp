"use client";

import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { BarChart3, Cpu, Brain, Check, Mail, Crown, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { PLANS_LIST as pricingPlans, TRIAL_DURATION_MONTHS, type PricingPlan } from "@/lib/pricing-config";
import { FadeIn, MagneticButton, TiltCard } from "@/components/animations";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Standard: Zap,
  ML: Sparkles,
  Premium: Crown,
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        <section className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="text-center mb-20">
              <FadeIn>
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  Tarification
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 tracking-[-0.03em] leading-[0.95] text-white mb-6">
                  Simple, transparent,
                  <br />
                  <span className="text-gradient-brand">sans engagement</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-zinc-400 font-light">
                  Essai gratuit {TRIAL_DURATION_MONTHS} mois. Aucun engagement. Annulez à tout moment.
                </p>
              </FadeIn>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
              {pricingPlans.map((plan, i) => (
                <FadeIn key={plan.name} delay={0.1 * i}>
                  <PricingCard plan={plan} />
                </FadeIn>
              ))}
            </div>

            {/* Comparison Table */}
            <FadeIn delay={0.3}>
              <div className="bg-zinc-900/30 rounded-2xl border border-white/[0.05] p-8 mb-8 overflow-hidden">
                <h3 className="text-xl font-display font-700 text-white mb-8">Comparaison détaillée</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left py-4 px-4 text-zinc-500 font-medium">Fonctionnalité</th>
                        <th className="text-center py-4 px-4 text-white font-display font-600">Standard</th>
                        <th className="text-center py-4 px-4 text-indigo-400 font-display font-600">ML</th>
                        <th className="text-center py-4 px-4 text-amber-400 font-display font-600">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Séries / mois", "50", "150", "300"],
                        ["Modèles disponibles", "17 stats", "22 (+ ML)", "24+ (+ Premium)"],
                        ["Ridge / LightGBM", "\u274C", "\u2705", "\u2705"],
                        ["TimeGPT", "\u274C", "\u274C", "\u2705"],
                        ["EnsembleTop2", "\u274C", "\u274C", "\u2705"],
                        ["Accès API", "\u274C", "\u274C", "\u2705"],
                        ["Historique", "30 jours", "60 jours", "90 jours"],
                        ["Support", "Email 48h", "Email 24h", "Prioritaire 4h"],
                      ].map(([feature, std, ml, premium], i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-4 text-zinc-400">{feature}</td>
                          <td className="text-center py-4 px-4 text-zinc-300">{std}</td>
                          <td className="text-center py-4 px-4 text-zinc-300">{ml}</td>
                          <td className="text-center py-4 px-4 text-zinc-300">{premium}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>

            {/* Enterprise CTA */}
            <FadeIn delay={0.4}>
              <div className="bg-zinc-900/30 rounded-2xl border border-white/[0.05] p-8 glass gradient-border">
                <h3 className="text-lg font-display font-700 text-white mb-4">
                  Besoin d&apos;un volume supérieur ?
                </h3>
                <p className="text-zinc-400 mb-6 font-light text-sm">
                  Pour les entreprises avec plus de 500 séries/mois ou des besoins spécifiques
                  (on-premise, intégrations custom, SLA), contactez-nous pour un devis personnalisé.
                </p>
                <Link href="/contact">
                  <Button variant="secondary" className="rounded-xl">
                    <Mail size={16} />
                    Contacter l&apos;équipe
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const isML = plan.popular || plan.badge === "PLUS POPULAIRE";
  const isPremium = plan.badge === "PREMIUM";
  const Icon = iconMap[plan.name] || Zap;

  return (
    <TiltCard className="h-full">
      <motion.div
        className={cn(
          "relative rounded-2xl border p-8 flex flex-col h-full transition-all duration-500",
          isML
            ? "border-2 border-indigo-500/40 bg-gradient-to-b from-indigo-500/[0.06] to-transparent shadow-[0_0_60px_rgba(99,102,241,0.08)]"
            : isPremium
            ? "border-2 border-amber-500/30 bg-zinc-900/40"
            : "border-white/[0.05] bg-zinc-900/40 hover:border-white/[0.08]"
        )}
        whileHover={{ y: -8 }}
      >
        {(plan.popular || plan.badge) && (
          <div
            className={cn(
              "absolute top-[-12px] left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap text-white",
              isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-indigo-500 to-violet-500"
            )}
          >
            {plan.badge || "PLUS POPULAIRE"}
          </div>
        )}

        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isPremium ? "bg-amber-500/10 text-amber-400" : "bg-indigo-500/10 text-indigo-400"
          )}>
            <Icon size={18} />
          </div>
          <h3 className="text-2xl font-display font-800 text-white">{plan.name}</h3>
        </div>

        <p className="text-sm text-zinc-500 mb-6 min-h-[42px]">{plan.description}</p>

        <div className="mb-6">
          <span className="text-5xl font-display font-800 text-white tracking-[-0.04em]">{plan.price}</span>
          <span className="text-base text-zinc-500 ml-1">EUR/mois</span>
        </div>

        <Link href="/login?mode=signup" className="mb-6">
          <MagneticButton
            className={cn(
              "w-full py-3 rounded-xl font-semibold transition-all text-sm",
              isML
                ? "bg-indigo-500 hover:bg-indigo-600 text-white glow-pulse"
                : "bg-white/[0.04] hover:bg-white/[0.07] text-white border border-white/[0.06]"
            )}
          >
            Essai gratuit {TRIAL_DURATION_MONTHS} mois
          </MagneticButton>
        </Link>

        <div className="space-y-3 flex-1">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Check size={14} className="text-emerald-500 shrink-0" />
              <span className="text-sm text-zinc-400">{f}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </TiltCard>
  );
}
