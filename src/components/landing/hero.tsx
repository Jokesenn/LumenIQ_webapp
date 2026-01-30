"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Clock, Brain, Target, Check, Sparkles } from "lucide-react";
import { HeroChart } from "./hero-chart";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-500/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto py-16 px-6 grid md:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div>
          {/* Badge */}
          <div className="animate-fade inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium text-indigo-300 bg-white/5 backdrop-blur-sm border border-white/[0.08]">
            <Sparkles size={14} className="text-indigo-400" />
            Beta ouverte — Essai gratuit 3 mois
          </div>

          <h1 className="animate-fade stagger-1 text-4xl md:text-[56px] font-extrabold leading-[1.1] mb-6 tracking-[-0.02em]">
            <span className="text-gradient">Prévisions</span><br />
            <span className="text-indigo-400">professionnelles</span><br />
            validées par backtesting
          </h1>

          <p className="animate-fade stagger-2 text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-[500px]">
            Transformez vos historiques de ventes en forecasts fiables.
            21 modèles statistiques/ML, routing ABC/XYZ intelligent, rapports détaillés.
            <strong className="text-white"> En 5 minutes.</strong>
          </p>

          <div className="animate-fade stagger-3 flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/dashboard">
              <Button size="large" className="bg-indigo-500 hover:bg-indigo-600 text-white glow-accent">
                Démarrer gratuitement
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="large"
              className="border-white/[0.1] text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              Voir la démo
              <Play size={18} />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="animate-fade stagger-4 flex flex-wrap gap-8">
            <TrustBadge icon={<Clock size={20} />} value="5 min" label="Setup" />
            <TrustBadge icon={<Brain size={20} />} value="21" label="Modèles" />
            <TrustBadge icon={<Target size={20} />} value="~60%" label="Réduction compute" />
          </div>
        </div>

        {/* Right Content - Dashboard Preview */}
        <div className="relative animate-fade stagger-2 hidden md:block">
          <div className="glass-card p-6 relative z-10 animate-float">
            <HeroChart />
          </div>

          {/* Floating Card */}
          <div className="absolute bottom-[-30px] left-[-40px] glass-card p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Check size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">Backtesting validé</p>
                <p className="text-xs text-zinc-500">5-fold cross-validation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
    </div>
  );
}
