"use client"

import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const data = Array.from({ length: 30 }, (_, i) => ({
    name: i,
    value: 1000 + Math.random() * 500 + Math.sin(i / 5) * 400,
    forecast: i > 20 ? 1200 + Math.random() * 400 + Math.sin(i / 5) * 400 : null,
}));

export function HeroChart() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="w-full h-full min-h-[300px] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent opacity-50 z-10 pointer-events-none" />

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border)',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent)"
                        strokeWidth={3}
                        fill="url(#heroGradient)"
                        animationDuration={2000}
                    />
                    <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke="var(--success)"
                        strokeDasharray="5 5"
                        strokeWidth={3}
                        fill="none"
                        animationDuration={2000}
                        animationBegin={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Floating Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 left-4 bg-[var(--bg-surface)] border border-[var(--border)] p-3 rounded-xl shadow-xl z-20"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold">Live Training</span>
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Accuracy: 94.2%</div>
            </motion.div>
        </div>
    );
}
