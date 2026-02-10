import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getDashboardStats,
  getTrendData,
  getUrgentActions,
  getRecentForecasts,
} from "@/lib/queries/dashboard";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [stats, trendData, urgentActions, recentForecasts] = await Promise.all([
    getDashboardStats(user.id),
    getTrendData(user.id),
    getUrgentActions(user.id),
    getRecentForecasts(user.id),
  ]);

  return (
    <DashboardContent
      stats={stats}
      trendData={trendData}
      urgentActions={urgentActions}
      recentForecasts={recentForecasts}
    />
  );
}
