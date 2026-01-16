import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Play, Check, Brain, Clock, Target } from "lucide-react";
import Link from "next/link";
import { HeroChart } from "@/components/landing/hero-chart";

export default function Home() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,var(--accent-muted)_0%,transparent_70%)] blur-[80px] pointer-events-none" />
                    <div className="absolute top-[50%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(99,112,232,0.1)_0%,transparent_70%)] blur-[60px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                        {/* Left Content */}
                        <div className="animate-fade">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-muted)] rounded-full mb-6 text-sm font-medium text-[var(--accent)]">
                                <Zap size={16} />
                                Beta ouverte — Essai gratuit 3 mois
                            </div>

                            <h1 className="text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                                Prévisions<br />
                                <span className="gradient-text">professionnelles</span><br />
                                validées par backtesting
                            </h1>

                            <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-lg">
                                Transformez vos historiques de ventes en forecasts fiables.
                                21 modèles statistiques/ML, routing ABC/XYZ intelligent.
                                <strong className="text-[var(--text-primary)]"> En 5 minutes.</strong>
                            </p>

                            <div className="flex gap-4 mb-12">
                                <Link href="/dashboard">
                                    <Button size="large">
                                        Démarrer gratuitement
                                        <ArrowRight size={20} className="ml-2" />
                                    </Button>
                                </Link>
                                <Button variant="secondary" size="large">
                                    Voir la démo
                                    <Play size={18} className="ml-2" />
                                </Button>
                            </div>

                            <div className="flex gap-8">
                                <TrustItem icon={<Clock size={20} />} value="5 min" label="Setup" />
                                <TrustItem icon={<Brain size={20} />} value="21" label="Modèles" />
                                <TrustItem icon={<Target size={20} />} value="~60%" label="Réduction compute" />
                            </div>
                        </div>

                        {/* Right Content - Placeholder for Dashboard Preview */}
                        <div className="relative animate-fade delay-100 min-h-[400px]">
                            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-1 relative z-10 glow animate-float h-[400px] overflow-hidden">
                                <HeroChart />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function TrustItem({ icon, value, label }: { icon: any, value: string, label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] border border-[var(--border)]">
                {icon}
            </div>
            <div>
                <div className="font-bold text-lg leading-none mb-1">{value}</div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
            </div>
        </div>
    );
}
