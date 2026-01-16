"use client"

import { ForecastChart } from '@/components/common/forecast-chart';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

// Mock Data for the Result
const forecastData = Array.from({ length: 30 }, (_, i) => {
    const dateObj = new Date(2025, 0, i + 1);
    const date = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const actual = i < 20 ? Math.floor(1200 + Math.random() * 600 + Math.sin(i / 3) * 200) : null;
    const forecast = i >= 18 ? Math.floor(1400 + Math.random() * 400 + Math.sin(i / 3) * 150) : null;
    // Make interval line up with forecast
    const lower = forecast ? forecast - 200 : null;
    const upper = forecast ? forecast + 200 : null;
    return { date, actual, forecast, lower, upper };
});

export default function ResultsPage() {
    return (
        <div className="animate-fade">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Résultats: Q1_2025_Products.csv</h1>
                    <p className="text-[var(--text-secondary)]">Calcul terminé le 16 Janv. 10:24 • Durée 4m 12s</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary">
                        <Share2 size={18} className="mr-2" />
                        Partager
                    </Button>
                    <Button>
                        <Download size={18} className="mr-2" />
                        Export complet
                    </Button>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6 mb-8">
                <h2 className="font-semibold mb-6 flex items-center justify-between">
                    <span>Agrégat Global</span>
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded font-medium">SMAPE 8.4%</span>
                </h2>
                <ForecastChart data={forecastData} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border)]">
                    <h3 className="text-sm text-[var(--text-secondary)] mb-2">Précision Globale (1-SMAPE)</h3>
                    <div className="text-3xl font-bold text-[var(--success)]">91.6%</div>
                </div>
                <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border)]">
                    <h3 className="text-sm text-[var(--text-secondary)] mb-2">Biais</h3>
                    <div className="text-3xl font-bold text-[var(--text-primary)]">+2.1%</div>
                </div>
                <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border)]">
                    <h3 className="text-sm text-[var(--text-secondary)] mb-2">Volatilité Historique</h3>
                    <div className="text-3xl font-bold text-[var(--warning)]">High</div>
                </div>
            </div>
        </div>
    );
}
