"use client";

import Link from "next/link";
import { StatCard, RecentForecasts } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Target, Clock, Upload, FileText } from "lucide-react";
import { modelPerformance, dashboardStats } from "@/lib/mock-data";

export default function DashboardPage() {
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
          value={String(dashboardStats.seriesThisMonth)}
          subtext={`/ ${dashboardStats.seriesLimit} disponibles`}
          icon={BarChart3}
        />
        <StatCard
          label="Forecasts"
          value={String(dashboardStats.forecastsThisMonth)}
          subtext="ce mois"
          icon={TrendingUp}
        />
        <StatCard
          label="SMAPE moyen"
          value={`${dashboardStats.averageSmape}%`}
          subtext="excellente précision"
          icon={Target}
          positive
        />
        <StatCard
          label="Prochain reset"
          value={`${dashboardStats.daysUntilReset}j`}
          subtext="quota mensuel"
          icon={Clock}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Forecasts */}
        <div className="lg:col-span-2">
          <RecentForecasts />
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
            <div className="space-y-3">
              {modelPerformance.slice(0, 4).map((m) => (
                <div
                  key={m.model}
                  className="flex justify-between items-center"
                >
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
          </div>
        </div>
      </div>
    </div>
  );
}
