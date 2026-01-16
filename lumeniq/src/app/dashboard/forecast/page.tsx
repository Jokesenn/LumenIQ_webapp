"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Check, ArrowRight, Loader2 } from "lucide-react";

export default function ForecastPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    let droppedFile: File | null = null;
    
    if ('dataTransfer' in e) {
      droppedFile = e.dataTransfer?.files[0] || null;
    } else {
      droppedFile = e.target.files?.[0] || null;
    }
    
    if (droppedFile) {
      setFile(droppedFile);
      setStep(2);
    }
  };

  const startForecast = () => {
    setStep(3);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setStep(4);
        }, 500);
      }
      setProgress(p);
    }, 400);
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
      {step === 1 && (
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

      {/* Step 2: Configuration */}
      {step === 2 && (
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

          <h3 className="text-base font-semibold mb-4">Configuration détectée</h3>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <ConfigItem label="Fréquence" value="Hebdomadaire" />
            <ConfigItem label="Séries détectées" value="47" />
            <ConfigItem label="Historique" value="104 semaines" />
            <ConfigItem label="Saisonnalité" value="Oui (52 périodes)" />
            <ConfigItem label="Horizon forecast" value="12 semaines" />
            <ConfigItem label="Routing" value="ABC/XYZ auto" />
          </div>

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
            <Button variant="secondary" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button onClick={startForecast}>
              Lancer le forecast
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Processing */}
      {step === 3 && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-6">
            <Loader2
              size={36}
              className="text-[var(--accent)] animate-spin-slow"
            />
          </div>

          <h2 className="text-xl font-semibold mb-2">Calcul en cours...</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Test de 21 modèles avec backtesting multi-fold et routing ABC/XYZ
          </p>

          <div className="max-w-[400px] mx-auto bg-[var(--bg-surface)] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-3">
            {Math.round(progress)}% — Estimation :{" "}
            {Math.max(1, Math.round((100 - progress) / 20))} min restantes
          </p>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-[var(--success)]" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Forecast terminé !</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            47 séries analysées • SMAPE moyen : 8.2%
          </p>

          <Button size="large" onClick={() => router.push("/dashboard/results")}>
            Voir les résultats
            <ArrowRight size={20} />
          </Button>
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
