import {
    BarChart3,
    TrendingUp,
    Target,
    Clock,
    FileText,
    ChevronRight,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="animate-fade">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
                <p className="text-[var(--text-secondary)]">Vue d'ensemble de votre activité forecast</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard label="Séries ce mois" value="12" subtext="/ 50 disponibles" icon={<BarChart3 size={20} />} />
                <StatCard label="Forecasts" value="4" subtext="ce mois" icon={<TrendingUp size={20} />} />
                <StatCard label="SMAPE moyen" value="8.9%" subtext="excellente précision" icon={<Target size={20} />} positive />
                <StatCard label="Prochain reset" value="16j" subtext="quota mensuel" icon={<Clock size={20} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Forecasts */}
                <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold">Derniers forecasts</h2>
                        <Link href="/dashboard/history" className="text-sm text-[var(--accent)] flex items-center gap-1 hover:underline">
                            Voir tout <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {[
                            { id: 1, name: 'Q1_2025_Products.csv', date: '15 Jan 2025', series: 47, smape: 8.2 },
                            { id: 2, name: 'Winter_Sales.csv', date: '12 Jan 2025', series: 32, smape: 11.4 },
                            { id: 3, name: 'Electronics_Dec.csv', date: '08 Jan 2025', series: 89, smape: 6.8 },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-[var(--bg-surface)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{item.date} • {item.series} séries</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                                    SMAPE {item.smape}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6">
                        <h2 className="font-semibold mb-4">Actions rapides</h2>
                        <Link href="/dashboard/forecast">
                            <Button className="w-full justify-center mb-3">
                                <Upload size={18} className="mr-2" />
                                Nouveau forecast
                            </Button>
                        </Link>
                        <Button variant="secondary" className="w-full justify-center">
                            <FileText size={18} className="mr-2" />
                            Documentation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, subtext, icon, positive }: any) {
    return (
        <div className="bg-[var(--bg-secondary)] p-5 rounded-xl border border-[var(--border)]">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[var(--bg-surface)] rounded-lg text-[var(--text-secondary)]">
                    {icon}
                </div>
                {positive && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+2.4%</span>}
            </div>
            <div>
                <div className="text-sm text-[var(--text-secondary)] mb-1">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{subtext}</div>
            </div>
        </div>
    );
}
