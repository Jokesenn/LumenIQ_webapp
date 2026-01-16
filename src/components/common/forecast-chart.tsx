"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from 'next-themes';

export function ForecastChart({ data }: { data: any[] }) {
    const { theme } = useTheme();

    // Simple tokens access - in a real app better to read from computed styles or a context to sync with CSS vars
    // Here we hardcode approximates for simplicity or read typical values
    const isDark = theme === 'dark';
    const colors = {
        accent: '#4F5BD5',
        accentMuted: isDark ? 'rgba(79, 91, 213, 0.2)' : 'rgba(79, 91, 213, 0.1)',
        text: isDark ? '#A0A8C0' : '#8891A8',
        grid: isDark ? '#1E2A45' : '#E0E0E0',
        tooltipBg: isDark ? '#111A30' : '#FFFFFF',
    };

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke={colors.text}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        stroke={colors.text}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: colors.tooltipBg,
                            border: `1px solid ${colors.grid}`,
                            borderRadius: 8,
                            fontSize: 12,
                        }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="upper" name="Confidence Interval" stroke="none" fill={colors.accentMuted} />
                    <Area type="monotone" dataKey="forecast" name="Forecast" stroke={colors.accent} strokeWidth={3} dot={false} strokeDasharray="5 5" fill="url(#colorForecast)" />
                    <Area type="monotone" dataKey="actual" name="Historical" stroke={isDark ? '#e2e8f0' : '#334155'} strokeWidth={2} dot={false} fill="none" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
