import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Cpu, Target, Brain, FileText, BarChart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="text-center mb-16 px-6">
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Fonctionnalités</h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Une suite complète d'outils de prévision professionnels,
                        conçue pour les PME e-commerce qui veulent des résultats fiables.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto px-6 space-y-24">
                    <FeatureSection
                        icon={<Cpu size={32} />}
                        title="Routing ABC/XYZ Intelligent"
                        description="Innovation différenciante : allocation dynamique du budget compute selon la valeur business de chaque série. Classification automatique selon contribution CA (ABC) et volatilité demande (XYZ)."
                        benefits={[
                            "Classe A (Top 20% CA) : jusqu'à 30 modèles, 5-fold CV",
                            "Classe B (30% suivants) : jusqu'à 20 modèles, 3-fold CV",
                            "Classe C (50% restants) : jusqu'à 10 modèles, 2-fold CV",
                            "Impact : ~60% réduction temps de calcul vs approche naïve"
                        ]}
                    />

                    <FeatureSection
                        icon={<Target size={32} />}
                        title="Backtesting Multi-Fold"
                        description="Chaque forecast est validé par cross-validation temporelle. Vous savez exactement quelle aurait été la précision sur vos données historiques avant de faire confiance au forecast."
                        benefits={[
                            "Métriques : WAPE, SMAPE, MAPE, MASE, RMSE",
                            "Gating : évite de recalculer si données stables",
                            "Intervalle de confiance 80% calibré sur l'historique"
                        ]}
                        reversed
                    />

                    <FeatureSection
                        icon={<Brain size={32} />}
                        title="21 Modèles Statistiques/ML"
                        description="Du classique ARIMA aux modèles ML avancés et foundation models. L'algorithme sélectionne automatiquement le champion pour chaque série."
                        benefits={[
                            "Standard : ETS, ARIMA, Theta, Croston...",
                            "ML : Ridge, LightGBM (Vectorisé)",
                            "Foundation : TimeGPT (Zero-shot)"
                        ]}
                    />

                    <FeatureSection
                        icon={<FileText size={32} />}
                        title="Rapports & Synthèse LLM"
                        description="Export complet pour audit et intégration ERP/BI. Rapport exécutif généré par IA qui traduit les résultats techniques en conseils actionnables."
                        benefits={[
                            "Exports CSV/JSON complets",
                            "Synthèse narrative par Claude AI",
                            "Audit trail complet du choix des modèles"
                        ]}
                        reversed
                    />
                </div>

                <div className="text-center mt-24">
                    <Link href="/dashboard">
                        <Button size="large">
                            Essayer gratuitement
                            <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function FeatureSection({ icon, title, description, benefits, reversed }: any) {
    return (
        <div className={cn("grid md:grid-cols-2 gap-12 items-center", reversed && "md:grid-flow-col-dense")}>
            <div className={reversed ? "md:col-start-2" : ""}>
                <div className="inline-flex p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] mb-6">
                    {icon}
                </div>
                <h2 className="text-3xl font-bold mb-4">{title}</h2>
                <p className="text-[var(--text-secondary)] mb-8 text-lg leading-relaxed">
                    {description}
                </p>
                <ul className="space-y-3">
                    {benefits.map((b: string) => (
                        <li key={b} className="flex items-start gap-3 text-[var(--text-primary)]">
                            <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckIcon />
                            </div>
                            {b}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={reversed ? "md:col-start-1" : ""}>
                <div className="aspect-square rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] relative overflow-hidden glow flex items-center justify-center">
                    {/* Placeholder visualization */}
                    <div className="text-[var(--text-muted)] text-sm">Visualisation: {title}</div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-muted)] to-transparent opacity-20" />
                </div>
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
