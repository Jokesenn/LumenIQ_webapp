"use client";

import { Cpu, Target, Brain, FileText, Check } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { abcDistribution } from "@/lib/mock-data";

export function FeaturesSection() {
  return (
    <section className="py-[120px] px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-[40px] font-bold mb-4 tracking-[-0.01em] text-gradient">
            Technologie de pointe,<br />simplicité absolue
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<Cpu size={28} />}
            title="Routing ABC/XYZ Intelligent"
            description="Innovation différenciante : allocation dynamique du budget compute selon la valeur business de chaque série. Les produits A (top 20% CA) reçoivent jusqu'à 30 modèles avec 5-fold CV. Résultat : ~60% de réduction temps de calcul."
          >
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={abcDistribution} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    width={30}
                  />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value}%`,
                      props.payload.label,
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(24, 24, 27, 0.9)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {abcDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={<Target size={28} />}
            title="Backtesting Multi-Fold"
            description="Chaque forecast est validé par cross-validation temporelle (jusqu'à 5 folds pour classe A). Vous savez exactement quelle aurait été la précision sur vos données historiques avant de faire confiance au forecast."
          >
            <div className="mt-6 grid grid-cols-5 gap-2">
              {[8.2, 9.1, 7.8, 8.5, 9.4].map((smape, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-lg p-3 text-center"
                >
                  <p className="text-[11px] text-zinc-500 mb-1">
                    Fold {idx + 1}
                  </p>
                  <p className="text-base font-semibold text-emerald-400">
                    {smape}%
                  </p>
                </div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            icon={<Brain size={28} />}
            title="21 Modèles Statistiques/ML"
            description="Du classique ARIMA aux modèles ML avancés et foundation models. L'algorithme sélectionne automatiquement le champion pour chaque série selon sa nature (régulière, saisonnière, intermittente...)."
          >
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "AutoARIMA",
                "AutoETS",
                "Theta",
                "Croston",
                "TSB",
                "ADIDA",
                "LightGBM",
                "Ridge",
              ].map((model) => (
                <span
                  key={model}
                  className="px-3 py-1.5 bg-white/5 rounded-md text-xs font-medium text-zinc-400"
                >
                  {model}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-indigo-500/10 rounded-md text-xs font-medium text-indigo-400">
                +13 autres
              </span>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={<FileText size={28} />}
            title="6 Artifacts & Synthèse LLM"
            description="Rapport exécutif généré par Claude API traduit les résultats techniques en insights business. Export complet avec tous les artifacts pour audit et intégration ERP/BI."
          >
            <div className="mt-6 bg-white/5 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  "forecast.csv",
                  "metrics.json",
                  "model_registry.json",
                  "insights.json",
                  "run_manifest.json",
                  "Synthèse LLM",
                ].map((artifact) => (
                  <div
                    key={artifact}
                    className="flex items-center gap-1.5 text-xs text-zinc-400"
                  >
                    <Check size={12} className="text-emerald-400" />
                    {artifact}
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

function FeatureCard({ icon, title, description, children }: FeatureCardProps) {
  return (
    <div className="glass-card p-7 transition-colors duration-200 hover:border-indigo-500/30">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}
