"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Clock, Brain, Target, Check } from "lucide-react";
import { HeroChart } from "./hero-chart";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,var(--accent-muted)_0%,transparent_70%)] blur-[80px] pointer-events-none" />
      <div className="absolute top-[50%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(99,112,232,0.1)_0%,transparent_70%)] blur-[60px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto py-16 px-6 grid md:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div className="animate-fade">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-muted)] rounded-full mb-6 text-sm font-medium text-[var(--accent)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
            </span>
            Beta ouverte — Essai gratuit 3 mois
          </div>

          <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.1] mb-6 tracking-[-0.02em]">
            Prévisions<br />
            <span className="gradient-text">professionnelles</span><br />
            validées par backtesting
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-[500px]">
            Transformez vos historiques de ventes en forecasts fiables.
            21 modèles statistiques/ML, routing ABC/XYZ intelligent, rapports détaillés.
            <strong className="text-[var(--text-primary)]"> En 5 minutes.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/dashboard">
              <Button size="large">
                Démarrer gratuitement
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Button variant="secondary" size="large">
              Voir la démo
              <Play size={18} />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-8">
            <TrustBadge icon={<Clock size={20} />} value="5 min" label="Setup" />
            <TrustBadge icon={<Brain size={20} />} value="21" label="Modèles" />
            <TrustBadge icon={<Target size={20} />} value="~60%" label="Réduction compute" />
          </div>
        </div>

        {/* Right Content - Dashboard Preview */}
        <div className="relative animate-fade stagger-2 hidden md:block">
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6 relative z-10 glow animate-float">
            <HeroChart />
          </div>

          {/* Floating Card */}
          <div className="absolute bottom-[-30px] left-[-40px] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--success)]/20 flex items-center justify-center">
                <Check size={20} className="text-[var(--success)]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold">Backtesting validé</p>
                <p className="text-xs text-[var(--text-muted)]">5-fold cross-validation</p>
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
      <div className="text-[var(--accent)]">{icon}</div>
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  );
}
