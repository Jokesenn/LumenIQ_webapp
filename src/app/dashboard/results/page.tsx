import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getJobWithSummary,
  getJobMetrics,
  getTopBottomSeries,
  getJobChartData,
  getJobAbcXyzMatrix,
  getJobModelPerformance,
  getJobSynthesis,
} from "@/lib/queries/results";
import { ResultsContent } from "./results-content";
import { CardSkeleton } from "@/components/shared/skeleton";

interface ResultsPageProps {
  searchParams: Promise<{ job?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const jobId = params.job;

  if (!jobId) {
    redirect("/dashboard/history");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all data in parallel
  const [
    { job, summary },
    metrics,
    topBottom,
    chartData,
    abcXyzData,
    modelPerformance,
    syntheses,
  ] = await Promise.all([
    getJobWithSummary(jobId, user.id).catch(() => ({ job: null, summary: null })),
    getJobMetrics(jobId, user.id).catch(() => null),
    getTopBottomSeries(jobId, user.id).catch(() => ({ top: [], bottom: [] })),
    getJobChartData(jobId, user.id).catch(() => []),
    getJobAbcXyzMatrix(jobId, user.id).catch(() => []),
    getJobModelPerformance(jobId, user.id).catch(() => []),
    getJobSynthesis(jobId, user.id).catch(() => []),
  ]);

  if (!job) {
    redirect("/dashboard/history");
  }

  return (
    <ResultsContent
      job={job}
      summary={summary}
      metrics={metrics}
      topPerformers={topBottom.top}
      bottomPerformers={topBottom.bottom}
      chartData={chartData}
      abcXyzData={abcXyzData}
      modelPerformance={modelPerformance}
      synthesis={syntheses[0] || null}
    />
  );
}
