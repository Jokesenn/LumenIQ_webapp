import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getDashboardStats,
  getModelPerformance,
  getAbcXyzDistribution,
  getAggregatedChartData,
  getRecentForecasts,
} from "@/lib/queries/dashboard";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all data in parallel
  const [stats, modelPerformance, abcXyzData, chartData, recentForecasts] = await Promise.all([
    getDashboardStats(user.id),
    getModelPerformance(user.id),
    getAbcXyzDistribution(user.id),
    getAggregatedChartData(user.id),
    getRecentForecasts(user.id),
  ]);

  return (
    <DashboardContent
      stats={stats}
      modelPerformance={modelPerformance}
      abcXyzData={abcXyzData}
      chartData={chartData}
      recentForecasts={recentForecasts}
    />
  );
}
