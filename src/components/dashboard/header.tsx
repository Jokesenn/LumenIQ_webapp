"use client"

import { Menu } from 'lucide-react';

interface HeaderProps {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}

export function DashboardHeader({ collapsed, setCollapsed }: HeaderProps) {
    return (
        <header className="h-16 bg-[var(--bg-primary)] border-b border-[var(--border)] flex items-center justify-between px-8 sticky top-0 z-10">
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 -ml-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
                <Menu size={20} />
            </button>

            <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-[var(--accent-muted)] rounded-md text-xs font-medium text-[var(--accent)]">
                    Plan Standard • 12/50 séries
                </div>
                <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-semibold text-sm">
                    JD
                </div>
            </div>
        </header>
    );
}
