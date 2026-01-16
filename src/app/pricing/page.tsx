import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Check, Brain, Cpu, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="text-center mb-16 px-6">
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Tarification simple</h1>
                    <p className="text-xl text-[var(--text-secondary)]">Essai gratuit 3 mois. Aucun engagement.</p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                    <PricingCard
                        name="Standard"
                        price="99"
                        icon={<BarChart3 />}
                        color="var(--text-primary)"
                        features={[
                            '50 séries / mois',
                            '10 modèles statistiques',
                            'Routing ABC/XYZ intelligent',
                            'Backtesting multi-fold',
                            'Synthèse LLM (Claude)',
                            'Support email 48h'
                        ]}
                    />
                    <PricingCard
                        name="ML"
                        price="179"
                        icon={<Cpu />}
                        color="var(--accent)"
                        popular
                        features={[
                            '150 séries / mois',
                            'Tout Standard inclus',
                            'Ridge (batch vectorisé)',
                            'LightGBM (tree-based)',
                            '75% win-rate sur séries stables',
                            'Support email 24h'
                        ]}
                    />
                    <PricingCard
                        name="Foundation"
                        price="299"
                        icon={<Brain />}
                        color="#F59E0B"
                        features={[
                            '300 séries / mois',
                            'Tout ML inclus',
                            'TimeGPT (Foundation Model)',
                            'EnsembleTop2',
                            'API REST complète',
                            'Support prioritaire 4h'
                        ]}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}

function PricingCard({ name, price, icon, features, popular, color }: any) {
    return (
        <div className={cn(
            "relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2",
            popular
                ? "bg-[var(--bg-secondary)] border-[var(--accent)] shadow-2xl shadow-indigo-500/10"
                : "bg-[var(--bg-surface)] border-[var(--border)]"
        )}>
            {popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Best Value
                </div>
            )}

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]" style={{ color }}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{name}</h3>
            </div>

            <div className="mb-6">
                <span className="text-4xl font-extrabold">€{price}</span>
                <span className="text-[var(--text-secondary)]">/mois</span>
            </div>

            <div className="space-y-4 mb-8">
                {features.map((f: string) => (
                    <div key={f} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                        <Check size={16} className="text-[var(--success)] mt-0.5 shrink-0" />
                        {f}
                    </div>
                ))}
            </div>

            <Button
                className="w-full"
                variant={popular ? 'primary' : 'secondary'}
            >
                Commencer l'essai
            </Button>
        </div>
    );
}
