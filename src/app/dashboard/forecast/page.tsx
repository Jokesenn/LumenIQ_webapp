"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Check, Loader2, FileText, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ForecastPage() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const router = useRouter();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setStep(2);
        }
    };

    const startForecast = () => {
        setStep(3);
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 10; // Slower simulation
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setTimeout(() => {
                    router.push('/dashboard/results');
                }, 800);
            }
            setProgress(p);
        }, 300);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Nouveau forecast</h1>
                <p className="text-[var(--text-secondary)]">Mode Express — Upload, configuration automatique, résultats en 5 min</p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-10 p-5 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                {['Upload', 'Configuration', 'Calcul', 'Résultats'].map((s, i) => (
                    <div key={s} className="flex flex-1 items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                            step > i + 1 ? "bg-[var(--accent)] text-white" : step === i + 1 ? "border-2 border-[var(--accent)] text-[var(--accent)]" : "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                        )}>
                            {step > i + 1 ? <Check size={14} /> : i + 1}
                        </div>
                        <div className={cn(
                            "text-sm font-medium",
                            step === i + 1 ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                        )}>{s}</div>
                        {i < 3 && <div className="h-[2px] flex-1 bg-[var(--border)] mx-2" />}
                    </div>
                ))}
            </div>

            {/* Step 1: Upload */}
            {step === 1 && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                        "border-2 border-dashed rounded-2xl p-20 text-center cursor-pointer transition-all",
                        isDragging
                            ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                            : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] hover:bg-[var(--bg-hover)]"
                    )}
                    onClick={() => document.getElementById('file-input')?.click()}
                >
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center mx-auto mb-6">
                        <Upload size={32} className="text-[var(--accent)]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Glissez votre fichier CSV ici</h3>
                    <p className="text-[var(--text-secondary)] mb-6">ou cliquez pour parcourir vos fichiers</p>
                    <input
                        id="file-input"
                        type="file"
                        accept=".csv,.xlsx"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setFile(e.target.files[0]);
                                setStep(2);
                            }
                        }}
                    />
                    <div className="text-xs text-[var(--text-muted)]">
                        Format supporté : CSV, Excel (max 50MB) <br />
                        Colonnes requises : Date, [Target] + (optionnel) SKUs, Catégories
                    </div>
                </div>
            )}

            {/* Step 2: Configuration (Simulated) */}
            {step === 2 && file && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-8">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--border)]">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{file.name}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">{(file.size / 1024).toFixed(1)} KB • Uploadé à l'instant</p>
                        </div>
                        <Button variant="ghost" size="small" onClick={() => { setFile(null); setStep(1); }} className="ml-auto">
                            Changer
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <ConfigItem label="Fréquence détectée" value="Mensuel (MS)" confidence="High" />
                        <ConfigItem label="Horizon de prévision" value="12 mois" editable />
                        <ConfigItem label="Saisonnalité" value="Automatique" />
                        <ConfigItem label="Hiérarchie" value="SKU / Category" />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="ghost" onClick={() => setStep(1)}>Annuler</Button>
                        <Button onClick={startForecast}>
                            Lancer le calcul
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Calculation (Simulation) */}
            {step === 3 && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-12 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-surface)" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="45" fill="none" stroke="var(--accent)" strokeWidth="8"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * progress) / 100}
                                className="transition-all duration-300 ease-out -rotate-90 origin-center"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                            {Math.round(progress)}%
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2">Calcul en cours...</h3>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-8">
                        Nos algorithmes analysent vos données. Entrainement de 21 modèles en parallèle avec Cross-Validation.
                    </p>

                    <div className="space-y-2 max-w-sm mx-auto text-sm text-[var(--text-muted)] text-left">
                        <StepCheck done={progress > 10} label="Ingestion et nettoyage des données" />
                        <StepCheck done={progress > 30} label="Détection saisonnalité & tendance" />
                        <StepCheck done={progress > 60} label="Entrainement modèles (ARIMA, XGBoost...)" />
                        <StepCheck done={progress > 90} label="Sélection du champion (Backtesting)" />
                    </div>
                </div>
            )}
        </div>
    );
}

function ConfigItem({ label, value, confidence, editable }: any) {
    return (
        <div>
            <div className="text-sm text-[var(--text-secondary)] mb-1 flex items-center gap-2">
                {label}
                {confidence && <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 rounded">Confiance: {confidence}</span>}
            </div>
            <div className={cn(
                "font-medium p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border)] flex justify-between items-center",
                editable && "cursor-pointer hover:border-[var(--accent)] transition-colors"
            )}>
                {value}
                {editable && <span className="text-xs text-[var(--accent)]">Modifier</span>}
            </div>
        </div>
    );
}

function StepCheck({ done, label }: any) {
    return (
        <div className={cn("flex items-center gap-3 transition-colors", done ? "text-[var(--text-primary)]" : "opacity-50")}>
            <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center border",
                done ? "bg-[var(--success)] border-[var(--success)] text-white" : "border-[var(--border)]"
            )}>
                {done && <Check size={12} />}
            </div>
            <span>{label}</span>
        </div>
    );
}
