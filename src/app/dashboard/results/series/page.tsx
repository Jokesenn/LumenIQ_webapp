import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getSeriesDetails,
  getSeriesChartData,
  getSeriesModelComparison,
  getSeriesForecastData,
  getJobWithSummary,
  getJobSeriesList,
  getSeriesActions,
} from "@/lib/queries/results";
import { formatDateByFrequency } from "@/lib/date-format";
import { SeriesContent } from "./series-content";
import type { ResultsChartPoint, ModelComparisonData } from "@/types/results";

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

  // Phase 1: fetch job to get frequency for date formatting
  const { job } = await getJobWithSummary(jobId, user.id);

  if (!job) {
    redirect(`/dashboard/results?job=${jobId}`);
  }

  const frequency = (job as any).frequency ?? null;
  const aggregationApplied = (job as any).aggregation_applied === true;

  // Phase 2: fetch everything else with frequency-aware chart formatting
  const [seriesDetails, chartData, modelComparison, allSeries, forecastData, seriesActions] = await Promise.all([
    getSeriesDetails(jobId, decodedSeriesId, user.id),
    getSeriesChartData(jobId, decodedSeriesId, user.id, frequency, aggregationApplied),
    getSeriesModelComparison(jobId, decodedSeriesId, user.id),
    getJobSeriesList(jobId, user.id).catch(() => []),
    getSeriesForecastData(jobId, decodedSeriesId, user.id).catch(() => []),
    getSeriesActions(jobId, decodedSeriesId, user.id).catch(() => []),
  ]);

  if (!seriesDetails) {
    redirect(`/dashboard/results?job=${jobId}`);
  }

  // Transform forecast data for PDF export (frequency-aware dates)
  const forecastPoints = forecastData.map((f: { ds: string; yhat: number; yhat_lower: number | null; yhat_upper: number | null }) => ({
    date: formatDateByFrequency(f.ds, frequency),
    forecast: Number(f.yhat),
    lower: f.yhat_lower != null ? Number(f.yhat_lower) : null,
    upper: f.yhat_upper != null ? Number(f.yhat_upper) : null,
  }));

  return (
    <SeriesContent
      job={job}
      series={seriesDetails}
      chartData={chartData as ResultsChartPoint[]}
      modelComparison={modelComparison as ModelComparisonData | null}
      allSeries={allSeries}
      forecastPoints={forecastPoints}
      seriesActions={seriesActions}
    />
  );
}
