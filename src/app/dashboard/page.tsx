import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatCard, RecentForecasts, EmptyDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Target, Clock, Upload, FileText } from "lucide-react";
import {
  getDashboardStats,
  getRecentForecasts,
  getModelPerformance,
  type ModelPerformanceItem,
} from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch toutes les données en parallèle
  const [stats, recentForecasts, modelPerformance] = await Promise.all([
    getDashboardStats(supabase, user.id),
    getRecentForecasts(supabase, user.id),
    getModelPerformance(supabase, user.id),
  ]);

  const hasForecasts = recentForecasts.length > 0;
  const hasModelData = modelPerformance.length > 0;

  // Déterminer le subtext pour SMAPE
  const smapeSubtext =
    stats.averageSmape !== null
      ? stats.averageSmape < 10
        ? "excellente précision"
        : stats.averageSmape < 15
        ? "bonne précision"
        : "à améliorer"
      : "pas encore de données";

  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold mb-2">Dashboard</h1>
        <p className="text-[var(--text-secondary)]">
          Vue d&apos;ensemble de votre activité forecast
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Séries ce mois"
          value={String(stats.seriesThisMonth)}
          subtext={`/ ${stats.seriesLimit} disponibles`}
          icon={BarChart3}
        />
        <StatCard
          label="Forecasts"
          value={String(stats.forecastsThisMonth)}
          subtext="ce mois"
          icon={TrendingUp}
        />
        <StatCard
          label="SMAPE moyen"
          value={stats.averageSmape !== null ? `${stats.averageSmape}%` : "—"}
          subtext={smapeSubtext}
          icon={Target}
          positive={stats.averageSmape !== null && stats.averageSmape < 10}
        />
        <StatCard
          label="Prochain reset"
          value={`${stats.daysUntilReset}j`}
          subtext="quota mensuel"
          icon={Clock}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Forecasts */}
        <div className="lg:col-span-2">
          {hasForecasts ? (
            <RecentForecasts forecasts={recentForecasts} />
          ) : (
            <EmptyDashboard />
          )}
        </div>

        {/* Quick Actions & Model Performance */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-base font-semibold mb-4">Actions rapides</h2>
            <Link href="/dashboard/forecast">
              <Button className="w-full justify-center mb-3">
                <Upload size={18} />
                Nouveau forecast
              </Button>
            </Link>
            <Button variant="secondary" className="w-full justify-center">
              <FileText size={18} />
              Documentation
            </Button>
          </div>

          {/* Model Performance */}
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-base font-semibold mb-4">Performance modèles</h2>
            {hasModelData ? (
              <ModelPerformanceList models={modelPerformance.slice(0, 4)} />
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                Les performances apparaîtront après votre premier forecast.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant interne pour afficher les performances des modèles
function ModelPerformanceList({ models }: { models: ModelPerformanceItem[] }) {
  return (
    <div className="space-y-3">
      {models.map((m) => (
        <div key={m.model} className="flex justify-between items-center">
          <span className="text-sm">{m.model}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)]">
              {m.series} séries
            </span>
            <span
              className={`text-sm font-semibold ${
                m.smape < 8
                  ? "text-[var(--success)]"
                  : m.smape < 10
                  ? "text-[var(--warning)]"
                  : ""
              }`}
            >
              {m.smape}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
