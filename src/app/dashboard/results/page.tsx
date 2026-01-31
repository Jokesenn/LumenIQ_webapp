import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getJobWithSummary,
  getJobMetrics,
  getTopBottomSeries,
  getJobChartData,
  getJobAbcXyzMatrix,
  getJobModelPerformance,
  getJobSynthesis,
  getJobSeriesList,
  getLatestCompletedJob,
} from "@/lib/queries/results";
import { ResultsContent } from "./results-content";
import { Upload } from "lucide-react";

interface ResultsPageProps {
  searchParams: Promise<{ job?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  let jobId = params.job;

  // Si pas de job spécifié, charger le dernier job terminé
  if (!jobId) {
    const latestJob = await getLatestCompletedJob(user.id);
    if (!latestJob) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade">
          <div className="bg-zinc-900/50 rounded-2xl border border-white/[0.08] p-12 text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <Upload size={28} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-3">
              Aucun résultat disponible
            </h2>
            <p className="text-zinc-400 mb-8">
              Lancez votre premier forecast pour voir les résultats ici.
            </p>
            <Link
              href="/dashboard/forecast"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
            >
              <Upload size={18} />
              Nouveau forecast
            </Link>
          </div>
        </div>
      );
    }
    jobId = latestJob.id;
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
    allSeries,
  ] = await Promise.all([
    getJobWithSummary(jobId, user.id).catch(() => ({ job: null, summary: null })),
    getJobMetrics(jobId, user.id).catch(() => null),
    getTopBottomSeries(jobId, user.id).catch(() => ({ top: [], bottom: [] })),
    getJobChartData(jobId, user.id).catch(() => []),
    getJobAbcXyzMatrix(jobId, user.id).catch(() => []),
    getJobModelPerformance(jobId, user.id).catch(() => []),
    getJobSynthesis(jobId, user.id).catch(() => []),
    getJobSeriesList(jobId, user.id).catch(() => []),
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
      allSeries={allSeries}
      chartData={chartData}
      abcXyzData={abcXyzData}
      modelPerformance={modelPerformance}
      synthesis={syntheses[0] || null}
    />
  );
}
