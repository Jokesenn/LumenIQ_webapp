"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Check, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import {
  analyzeCsvFile,
  getFrequencyLabel,
  getFrequencyPeriodLabel,
  type CsvAnalysis,
} from "@/lib/csv-analyzer";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useUser } from "@/hooks/use-supabase";
import { useJobStatus, getJobStatusLabel } from "@/hooks/useJobStatus";
import type { UploadStep } from "@/types/forecast";

export default function ForecastPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<CsvAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const router = useRouter();

  // Hooks pour l'upload réel
  const { user, loading: userLoading } = useUser();
  const {
    uploading,
    step: uploadStep,
    uploadProgress,
    error: uploadError,
    jobId,
    uploadAndCreateJob,
    reset: resetUpload,
  } = useFileUpload();

  // Hook pour poller le statut du job (activé seulement à l'étape 3 après upload)
  const {
    job,
    loading: jobLoading,
    error: jobError,
    isComplete,
    isFailed,
    isProcessing,
  } = useJobStatus(
    activeJobId,
    3000, // Poll toutes les 3 secondes
    step === 3 && uploadStep === "complete" // Activer seulement après l'upload
  );

  // Quand l'upload est terminé, commencer à poller le statut du job
  useEffect(() => {
    if (uploadStep === "complete" && jobId) {
      setActiveJobId(jobId);
      // Rester à l'étape 3 pour suivre la progression
    }
  }, [uploadStep, jobId]);

  // Quand le job est terminé, passer à l'étape 4
  useEffect(() => {
    if (isComplete && job) {
      setStep(4);
    }
  }, [isComplete, job]);

  // Quand le job échoue, afficher l'erreur
  useEffect(() => {
    if (isFailed && job) {
      // Rester à l'étape 3 pour afficher l'erreur
    }
  }, [isFailed, job]);

  const handleDrop = async (
    e: React.DragEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setIsDragging(false);
    setAnalyzeError(null);

    let droppedFile: File | null = null;

    if ("dataTransfer" in e) {
      droppedFile = e.dataTransfer?.files[0] || null;
    } else {
      droppedFile = e.target.files?.[0] || null;
    }

    if (droppedFile) {
      setFile(droppedFile);
      setAnalyzing(true);

      try {
        const result = await analyzeCsvFile(droppedFile);
        setAnalysis(result);

        // Vérifier s'il y a des erreurs critiques
        if (result.seriesCount === 0) {
          setAnalyzeError(
            "Aucune série numérique détectée dans le fichier. Vérifiez le format de vos données."
          );
          setAnalyzing(false);
          return;
        }

        setStep(2);
      } catch (error) {
        setAnalyzeError(
          error instanceof Error
            ? error.message
            : "Erreur lors de l'analyse du fichier"
        );
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setFile(null);
    setAnalysis(null);
    setAnalyzeError(null);
    setActiveJobId(null);
    resetUpload();
  };

  const startForecast = async () => {
    if (!file || !user) {
      setAnalyzeError("Vous devez être connecté pour lancer un forecast");
      return;
    }

    setStep(3);
    await uploadAndCreateJob(file, user.id);
    // Le useEffect gérera le passage à l'étape suivante via useJobStatus
  };

  // Calcul de l'horizon par défaut basé sur la fréquence
  const getDefaultHorizon = (): string => {
    if (!analysis) return "12 périodes";
    switch (analysis.frequency) {
      case "daily":
        return "30 jours";
      case "weekly":
        return "12 semaines";
      case "monthly":
        return "6 mois";
      case "quarterly":
        return "4 trimestres";
      case "yearly":
        return "2 ans";
      default:
        return "12 périodes";
    }
  };

  // Formatage de la saisonnalité
  const getSeasonalityLabel = (): string => {
    if (!analysis) return "Non détectée";
    if (!analysis.hasSeasonality || !analysis.seasonalityPeriod) {
      return "Non détectée";
    }
    return `Oui (${analysis.seasonalityPeriod} périodes)`;
  };

  // Helper pour obtenir le statut d'une sous-étape d'upload
  const getUploadSubStepStatus = (
    targetStep: UploadStep
  ): "pending" | "in_progress" | "completed" | "error" => {
    const stepOrder: UploadStep[] = [
      "idle",
      "uploading",
      "creating_job",
      "triggering_webhook",
      "complete",
    ];

    if (uploadStep === "error") {
      return "error";
    }

    const currentIndex = stepOrder.indexOf(uploadStep);
    const targetIndex = stepOrder.indexOf(targetStep);

    if (uploadStep === "complete") {
      return "completed";
    }

    if (currentIndex > targetIndex) return "completed";
    if (currentIndex === targetIndex) return "in_progress";
    return "pending";
  };

  // Calcul de la progression totale (upload + traitement)
  const getTotalProgress = (): number => {
    if (uploadStep !== "complete") {
      // Phase upload : 0-30%
      const uploadStepProgress: Record<UploadStep, number> = {
        idle: 0,
        uploading: uploadProgress * 0.2,
        creating_job: 20,
        triggering_webhook: 25,
        complete: 30,
        error: 0,
      };
      return uploadStepProgress[uploadStep] || 0;
    }

    // Phase traitement : 30-100%
    const jobProgress = job?.progress ?? 0;
    return 30 + jobProgress * 0.7;
  };

  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold mb-2">Nouveau forecast</h1>
        <p className="text-[var(--text-secondary)]">
          Mode Express — Upload, configuration automatique, résultats en 5 min
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-10 p-5 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
        {["Upload", "Configuration", "Calcul", "Résultats"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center gap-2 ${
                step > i ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step > i
                    ? "bg-[var(--accent)] text-white"
                    : step === i + 1
                    ? "border-2 border-[var(--accent)] text-[var(--text-muted)]"
                    : "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                }`}
              >
                {step > i + 1 ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`text-sm ${
                  step === i + 1 ? "font-semibold" : "font-normal"
                }`}
              >
                {s}
              </span>
            </div>
            {i < 3 && (
              <div
                className={`flex-1 h-0.5 ${
                  step > i + 1 ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && !analyzing && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          className={`rounded-2xl border-2 border-dashed p-20 text-center cursor-pointer transition-all ${
            isDragging
              ? "bg-[var(--accent-muted)] border-[var(--accent)]"
              : "bg-[var(--bg-secondary)] border-[var(--border)]"
          }`}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleDrop}
          />
          <div className="w-20 h-20 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-6">
            <Upload size={36} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Glissez votre fichier ici
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            ou cliquez pour parcourir
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Formats acceptés : CSV, XLSX • Max 50 MB
          </p>
        </div>
      )}

      {/* Step 1.5: Analyzing */}
      {step === 1 && analyzing && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-6">
            <Loader2 size={36} className="text-[var(--accent)] animate-spin" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Analyse en cours...</h2>
          <p className="text-[var(--text-secondary)]">
            Détection des séries, fréquence et configuration optimale
          </p>
        </div>
      )}

      {/* Error state for step 1 */}
      {step === 1 && analyzeError && !analyzing && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="font-medium text-red-500">Erreur d&apos;analyse</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {analyzeError}
              </p>
              {analysis?.errors && analysis.errors.length > 0 && (
                <ul className="text-sm text-[var(--text-muted)] mt-2 list-disc list-inside">
                  {analysis.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Configuration */}
      {step === 2 && analysis && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--success)]/20 flex items-center justify-center">
              <Check size={24} className="text-[var(--success)]" />
            </div>
            <div>
              <p className="font-semibold">{file?.name || "fichier.csv"}</p>
              <p className="text-sm text-[var(--text-muted)]">
                Fichier validé • Configuration automatique détectée
              </p>
            </div>
          </div>

          <h3 className="text-base font-semibold mb-4">
            Configuration détectée
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <ConfigItem
              label="Fréquence"
              value={getFrequencyLabel(analysis.frequency)}
            />
            <ConfigItem
              label="Séries détectées"
              value={String(analysis.seriesCount)}
            />
            <ConfigItem
              label="Historique"
              value={getFrequencyPeriodLabel(
                analysis.frequency,
                analysis.historyPeriods
              )}
            />
            <ConfigItem label="Saisonnalité" value={getSeasonalityLabel()} />
            <ConfigItem label="Horizon forecast" value={getDefaultHorizon()} />
            <ConfigItem label="Routing" value="ABC/XYZ auto" />
          </div>

          {/* Warnings if any */}
          {analysis.errors.length > 0 && (
            <div className="p-4 bg-yellow-500/10 rounded-lg mb-6 border-l-[3px] border-yellow-500">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                <strong>Attention :</strong> {analysis.errors.join(". ")}
              </p>
            </div>
          )}

          <div className="p-4 bg-[var(--bg-surface)] rounded-lg mb-6 border-l-[3px] border-[var(--accent)]">
            <p className="text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">
                Mode Express activé :
              </strong>{" "}
              Configuration optimale détectée automatiquement. Jusqu&apos;à 21
              modèles seront testés selon la classe ABC, avec backtesting
              multi-fold.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleReset}>
              Retour
            </Button>
            <Button onClick={startForecast} disabled={userLoading || !user}>
              {userLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  Lancer le forecast
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Processing (Upload + Job Processing) */}
      {step === 3 && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center">
              {uploadStep === "error" || isFailed ? (
                <AlertCircle size={28} className="text-red-500" />
              ) : (
                <Loader2 size={28} className="text-[var(--accent)] animate-spin" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {uploadStep === "error"
                  ? "Erreur d'upload"
                  : isFailed
                  ? "Erreur de traitement"
                  : uploadStep !== "complete"
                  ? "Lancement du forecast..."
                  : "Traitement en cours..."}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {file?.name || "fichier.csv"}
                {job?.current_step && ` • ${job.current_step}`}
              </p>
            </div>
          </div>

          {/* Progress bar globale */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[var(--text-secondary)]">
                Progression globale
              </span>
              <span className="text-sm font-medium">
                {Math.round(getTotalProgress())}%
              </span>
            </div>
            <div className="bg-[var(--bg-surface)] rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                style={{ width: `${getTotalProgress()}%` }}
              />
            </div>
          </div>

          {/* Sub-steps */}
          <div className="space-y-4 mb-8">
            {/* Phase 1: Upload */}
            <div className="p-4 bg-[var(--bg-surface)] rounded-lg">
              <p className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wide">
                Phase 1 : Envoi
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <SubStepIndicator
                    label="Upload du fichier"
                    status={getUploadSubStepStatus("uploading")}
                  />
                  {uploadStep === "uploading" && (
                    <span className="text-sm text-[var(--text-muted)]">
                      {Math.round(uploadProgress)}%
                    </span>
                  )}
                </div>
                <SubStepIndicator
                  label="Création du job"
                  status={getUploadSubStepStatus("creating_job")}
                />
                <SubStepIndicator
                  label="Déclenchement du forecast"
                  status={getUploadSubStepStatus("triggering_webhook")}
                />
              </div>
            </div>

            {/* Phase 2: Traitement (visible après upload) */}
            {uploadStep === "complete" && (
              <div className="p-4 bg-[var(--bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wide">
                  Phase 2 : Traitement
                </p>
                <div className="space-y-3">
                  <SubStepIndicator
                    label="Analyse des données"
                    status={
                      (job?.progress ?? 0) >= 10
                        ? "completed"
                        : isProcessing
                        ? "in_progress"
                        : isFailed
                        ? "error"
                        : "pending"
                    }
                  />
                  <SubStepIndicator
                    label="Classification ABC/XYZ"
                    status={
                      (job?.progress ?? 0) >= 30
                        ? "completed"
                        : (job?.progress ?? 0) >= 10
                        ? "in_progress"
                        : isFailed
                        ? "error"
                        : "pending"
                    }
                  />
                  <SubStepIndicator
                    label="Backtesting des modèles"
                    status={
                      (job?.progress ?? 0) >= 70
                        ? "completed"
                        : (job?.progress ?? 0) >= 30
                        ? "in_progress"
                        : isFailed
                        ? "error"
                        : "pending"
                    }
                  />
                  <div className="flex items-center justify-between">
                    <SubStepIndicator
                      label="Génération des forecasts"
                      status={
                        isComplete
                          ? "completed"
                          : (job?.progress ?? 0) >= 70
                          ? "in_progress"
                          : isFailed
                          ? "error"
                          : "pending"
                      }
                    />
                    {job?.series_processed != null &&
                      job?.series_count != null &&
                      job.series_count > 0 && (
                        <span className="text-sm text-[var(--text-muted)]">
                          {job.series_processed}/{job.series_count} séries
                        </span>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {(uploadStep === "error" || isFailed) && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-medium text-red-500">
                    {uploadStep === "error" ? "Erreur d'upload" : "Erreur de traitement"}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {uploadError || job?.error_message || "Une erreur est survenue"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {(uploadStep === "error" || isFailed) && (
              <>
                <Button variant="secondary" onClick={handleReset}>
                  Retour
                </Button>
                <Button onClick={startForecast}>Réessayer</Button>
              </>
            )}

            {/* Lien vers résultats pendant le traitement */}
            {uploadStep === "complete" && !isFailed && (
              <Button
                variant="secondary"
                onClick={() =>
                  router.push(`/dashboard/results?job=${activeJobId}`)
                }
              >
                Suivre sur la page résultats
                <ArrowRight size={18} />
              </Button>
            )}
          </div>

          {/* Info message */}
          {uploadStep === "complete" && !isFailed && (
            <div className="mt-6 p-4 bg-[var(--bg-surface)] rounded-lg border-l-[3px] border-[var(--accent)]">
              <p className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">
                  Statut : {getJobStatusLabel(job?.status)}
                </strong>
                {" • "}
                Vous pouvez quitter cette page, le traitement continue en arrière-plan.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-[var(--success)]" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Forecast terminé !</h2>
          <p className="text-[var(--text-secondary)] mb-2">
            {job?.series_count ?? analysis?.seriesCount ?? 0} séries analysées
            {job?.avg_smape !== undefined && job.avg_smape !== null && (
              <> • SMAPE moyen : {job.avg_smape.toFixed(1)}%</>
            )}
          </p>
          {activeJobId && (
            <p className="text-sm text-[var(--text-muted)] mb-8">
              Job ID:{" "}
              <span className="font-mono">{activeJobId.slice(0, 8)}...</span>
              {job?.compute_time_seconds && (
                <> • Durée : {Math.round(job.compute_time_seconds)}s</>
              )}
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={handleReset}>
              Nouveau forecast
            </Button>
            <Button
              size="large"
              onClick={() =>
                router.push(
                  `/dashboard/results${activeJobId ? `?job=${activeJobId}` : ""}`
                )
              }
            >
              Voir les résultats
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-[var(--bg-surface)] rounded-lg">
      <p className="text-[11px] text-[var(--text-muted)] mb-1">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}

function SubStepIndicator({
  label,
  status,
}: {
  label: string;
  status: "pending" | "in_progress" | "completed" | "error";
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          status === "completed"
            ? "bg-[var(--success)]"
            : status === "in_progress"
            ? "bg-[var(--accent)]"
            : status === "error"
            ? "bg-red-500"
            : "bg-[var(--bg-secondary)] border border-[var(--border)]"
        }`}
      >
        {status === "completed" && <Check size={14} className="text-white" />}
        {status === "in_progress" && (
          <Loader2 size={14} className="text-white animate-spin" />
        )}
        {status === "error" && (
          <AlertCircle size={14} className="text-white" />
        )}
      </div>
      <span
        className={`text-sm ${
          status === "completed"
            ? "text-[var(--success)]"
            : status === "in_progress"
            ? "text-[var(--text-primary)] font-medium"
            : status === "error"
            ? "text-red-500"
            : "text-[var(--text-muted)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
