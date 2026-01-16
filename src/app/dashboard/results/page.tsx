"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Brain, Check } from "lucide-react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import { forecastData, abcDistribution, modelPerformance } from "@/lib/mock-data";

const tabs = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "charts", label: "Graphiques" },
  { id: "classification", label: "Classification" },
  { id: "synthesis", label: "Synthèse IA" },
];

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="animate-fade">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold mb-2">Résultats forecast</h1>
          <p className="text-[var(--text-secondary)]">
            Q1_2025_Products.csv • 47 séries • 15 Jan 2025
          </p>
        </div>
        <Button>
          <Download size={18} />
          Télécharger ZIP
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[var(--bg-secondary)] p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <MetricCard
              label="SMAPE"
              value="8.2%"
              description="Symmetric Mean Absolute Percentage Error"
              status="excellent"
            />
            <MetricCard
              label="WAPE"
              value="7.8%"
              description="Weighted Absolute Percentage Error"
              status="excellent"
            />
            <MetricCard
              label="MAPE"
              value="12.4%"
              description="Mean Absolute Percentage Error"
              status="good"
            />
            <MetricCard
              label="Couverture"
              value="94%"
              description="Observations dans l'intervalle de confiance"
              status="excellent"
            />
          </div>

          {/* Main Chart */}
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6 mb-6">
            <h3 className="text-base font-semibold mb-5">
              Forecast agrégé (somme toutes séries)
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorForecastArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="upper" stroke="none" fill="var(--accent-muted)" name="IC sup" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="var(--bg-secondary)" name="IC inf" />
                <Line type="monotone" dataKey="actual" stroke="var(--text-secondary)" strokeWidth={2} dot={false} name="Historique" />
                <Line type="monotone" dataKey="forecast" stroke="var(--accent)" strokeWidth={3} dot={false} name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Model Champions */}
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-base font-semibold mb-5">
              Modèles champions par série
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={modelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="model" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="series" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Nb séries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Classification Tab */}
      {activeTab === "classification" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-base font-semibold mb-5">Classification ABC</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              Distribution des produits par contribution au chiffre d&apos;affaires
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={abcDistribution} layout="vertical">
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border)",
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
            <div className="mt-4 space-y-2">
              {abcDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">
                    {item.name} : {item.label} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-base font-semibold mb-5">Matrice ABC/XYZ</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              Croisement valeur × volatilité pour allocation compute
            </p>
            <div className="grid grid-cols-4 gap-1">
              <div />
              {["X", "Y", "Z"].map((col) => (
                <div key={col} className="text-center p-2 font-semibold text-sm">
                  {col}
                </div>
              ))}
              {["A", "B", "C"].map((row) => (
                <>
                  <div key={`row-${row}`} className="p-2 font-semibold text-sm flex items-center">
                    {row}
                  </div>
                  {["X", "Y", "Z"].map((col) => {
                    const value = Math.floor(Math.random() * 10) + 1;
                    const intensity =
                      row === "A"
                        ? col === "X"
                          ? 1
                          : col === "Y"
                          ? 0.7
                          : 0.4
                        : row === "B"
                        ? col === "X"
                          ? 0.6
                          : col === "Y"
                          ? 0.4
                          : 0.2
                        : col === "X"
                        ? 0.3
                        : col === "Y"
                        ? 0.2
                        : 0.1;
                    return (
                      <div
                        key={`${row}-${col}`}
                        className="rounded-md p-4 text-center text-sm font-semibold"
                        style={{
                          backgroundColor: `rgba(79, 91, 213, ${intensity})`,
                        }}
                      >
                        {value}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
            <div className="mt-5 p-3 bg-[var(--bg-surface)] rounded-lg">
              <p className="text-xs text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">AX/AY :</strong>{" "}
                Modèles sophistiqués (AutoARIMA, ETS) •
                <strong className="text-[var(--text-primary)]"> CZ :</strong>{" "}
                Modèles rapides (Naive, SMA)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Synthesis Tab */}
      {activeTab === "synthesis" && (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
              <Brain size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Synthèse IA</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Générée par Claude AI
              </p>
            </div>
          </div>

          <div className="p-6 bg-[var(--bg-surface)] rounded-xl border-l-4 border-[var(--accent)] leading-relaxed space-y-4">
            <p>
              <strong>Vue d&apos;ensemble :</strong> L&apos;analyse de vos 47
              séries de données révèle une précision de prévision excellente
              (SMAPE 8.2%), positionnant vos forecasts dans le top 10% des
              performances industrielles typiques. La couverture de 94% des
              intervalles de confiance indique une calibration statistique
              fiable.
            </p>
            <p>
              <strong>Insights clés :</strong> Une saisonnalité hebdomadaire
              marquée a été détectée sur 12 produits de classe A, représentant
              78% de votre chiffre d&apos;affaires. Le modèle AutoARIMA s&apos;est
              imposé comme champion sur ces références stratégiques. Les
              produits de longue traîne (classe C) présentent une volatilité
              plus élevée mais un impact business limité.
            </p>
            <p>
              <strong>Recommandations :</strong> Augmentez vos stocks de 15% sur
              les références SKU-2847 et SKU-3921 pour la période février-mars
              (pic saisonnier détecté). Surveillez particulièrement les 3 séries
              à coefficient de variation {">"}50% qui pourraient nécessiter une
              approche forecast distincte.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary">Copier le texte</Button>
            <Button variant="secondary">Exporter en PDF</Button>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === "charts" && (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
          <p className="text-[var(--text-secondary)] text-center py-16">
            Sélectionnez une série dans la liste pour afficher son graphique
            détaillé
          </p>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  status: "excellent" | "good" | "poor";
}

function MetricCard({ label, value, description, status }: MetricCardProps) {
  const statusColors = {
    excellent: "text-[var(--success)]",
    good: "text-[var(--warning)]",
    poor: "text-[var(--danger)]",
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-5">
      <p className="text-xs text-[var(--text-muted)] mb-2">{label}</p>
      <p className={`text-[32px] font-bold mb-2 ${statusColors[status]}`}>
        {value}
      </p>
      <p className="text-[11px] text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
