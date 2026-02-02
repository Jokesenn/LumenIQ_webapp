import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getSeriesDetails,
  getSeriesChartData,
  getSeriesModelComparison,
  getSeriesForecastData,
  getJobWithSummary,
  getJobSeriesList,
} from "@/lib/queries/results";
import { SeriesContent } from "./series-content";

interface SeriesPageProps {
  searchParams: Promise<{ job?: string; series?: string }>;
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const { job: jobId, series: seriesId } = params;

  if (!jobId || !seriesId) {
    redirect("/dashboard/history");
  }

  const decodedSeriesId = decodeURIComponent(seriesId);

  const [{ job }, seriesDetails, chartData, modelComparison, allSeries, forecastData] = await Promise.all([
    getJobWithSummary(jobId, user.id),
    getSeriesDetails(jobId, decodedSeriesId, user.id),
    getSeriesChartData(jobId, decodedSeriesId, user.id),
    getSeriesModelComparison(jobId, decodedSeriesId, user.id),
    getJobSeriesList(jobId, user.id).catch(() => []),
    getSeriesForecastData(jobId, decodedSeriesId, user.id).catch(() => []),
  ]);

  if (!job || !seriesDetails) {
    redirect(`/dashboard/results?job=${jobId}`);
  }

  // Transform forecast data for PDF export
  const forecastPoints = forecastData.map((f: { ds: string; yhat: number; yhat_lower: number | null; yhat_upper: number | null }) => ({
    date: new Date(f.ds).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
    forecast: Number(f.yhat),
    lower: f.yhat_lower != null ? Number(f.yhat_lower) : null,
    upper: f.yhat_upper != null ? Number(f.yhat_upper) : null,
  }));

  return (
    <SeriesContent
      job={job}
      series={seriesDetails}
      chartData={chartData}
      modelComparison={modelComparison}
      allSeries={allSeries}
      forecastPoints={forecastPoints}
    />
  );
}
