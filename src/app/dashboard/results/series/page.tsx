import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getSeriesDetails,
  getSeriesChartData,
  getSeriesModelComparison,
  getJobWithSummary,
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

  const [{ job }, seriesDetails, chartData, modelComparison] = await Promise.all([
    getJobWithSummary(jobId, user.id),
    getSeriesDetails(jobId, decodedSeriesId, user.id),
    getSeriesChartData(jobId, decodedSeriesId, user.id),
    getSeriesModelComparison(jobId, decodedSeriesId, user.id),
  ]);

  if (!job || !seriesDetails) {
    redirect(`/dashboard/results?job=${jobId}`);
  }

  return (
    <SeriesContent
      job={job}
      series={seriesDetails}
      chartData={chartData}
      modelComparison={modelComparison}
    />
  );
}
