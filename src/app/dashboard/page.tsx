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
        <h1 className="text-[28px] font-bold text-white mb-2">Dashboard</h1>
        <p className="text-zinc-400">
          Vue d&apos;ensemble de votre activité forecast
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Séries ce mois"
          value={String(stats.seriesThisMonth)}
          subtitle={`/ ${stats.seriesLimit} disponibles`}
          icon={BarChart3}
          delay={0}
        />
        <StatCard
          label="Forecasts"
          value={String(stats.forecastsThisMonth)}
          subtitle="ce mois"
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          label="SMAPE moyen"
          value={stats.averageSmape !== null ? `${stats.averageSmape}%` : "—"}
          subtitle={smapeSubtext}
          icon={Target}
          trend={stats.averageSmape !== null ? { value: `${stats.averageSmape}%`, direction: stats.averageSmape < 10 ? "up" : "down" } : undefined}
          delay={0.2}
        />
        <StatCard
          label="Prochain reset"
          value={`${stats.daysUntilReset}j`}
          subtitle="quota mensuel"
          icon={Clock}
          delay={0.3}
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
          <div className="bg-zinc-900/50 rounded-xl border border-white/[0.08] p-6">
            <h2 className="text-base font-semibold text-white mb-4">Actions rapides</h2>
            <Link href="/dashboard/forecast">
              <Button className="w-full justify-center mb-3 bg-indigo-500 hover:bg-indigo-600 text-white">
                <Upload size={18} />
                Nouveau forecast
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-center border-white/[0.1] text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <FileText size={18} />
              Documentation
            </Button>
          </div>

          {/* Model Performance */}
          <div className="bg-zinc-900/50 rounded-xl border border-white/[0.08] p-6">
            <h2 className="text-base font-semibold text-white mb-4">Performance modèles</h2>
            {hasModelData ? (
              <ModelPerformanceList models={modelPerformance.slice(0, 4)} />
            ) : (
              <p className="text-sm text-zinc-500">
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
          <span className="text-sm text-zinc-300">{m.model}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">
              {m.series} séries
            </span>
            <span
              className={`text-sm font-semibold ${
                m.smape < 8
                  ? "text-emerald-500"
                  : m.smape < 10
                  ? "text-amber-500"
                  : "text-zinc-300"
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
