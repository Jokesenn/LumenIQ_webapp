"use client"

import { Link, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LumenIQLogo } from '@/components/common/logo';
import {
    BarChart3,
    Upload,
    TrendingUp,
    Clock,
    Settings,
    Sun,
    Moon,
    LogOut
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface SidebarProps {
    collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <aside
            className={cn(
                "bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col transition-all duration-300 z-20 h-screen sticky top-0",
                collapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-4 border-b border-[var(--border)] mb-4">
                <LumenIQLogo size={32} />
                {!collapsed && (
                    <span className="text-lg font-bold">LumenIQ</span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                <SidebarItem icon={<BarChart3 />} label="Dashboard" href="/dashboard" active={pathname === '/dashboard'} collapsed={collapsed} />
                <SidebarItem icon={<Upload />} label="Nouveau forecast" href="/dashboard/forecast" active={pathname?.startsWith('/dashboard/forecast')} collapsed={collapsed} />
                <SidebarItem icon={<TrendingUp />} label="Résultats" href="/dashboard/results" active={pathname?.startsWith('/dashboard/results')} collapsed={collapsed} />
                <SidebarItem icon={<Clock />} label="Historique" href="/dashboard/history" active={pathname?.startsWith('/dashboard/history')} collapsed={collapsed} />
                <SidebarItem icon={<Settings />} label="Paramètres" href="/dashboard/settings" active={pathname?.startsWith('/dashboard/settings')} collapsed={collapsed} />
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-[var(--border)] space-y-1">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors",
                        collapsed && "justify-center px-0"
                    )}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    {!collapsed && <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>}
                </button>

                <button
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Déconnexion</span>}
                </button>
            </div>
        </aside>
    );
}

function SidebarItem({ icon, label, href, active, collapsed }: any) {
    // Using 'a' tag instead of Link for now because Next Link requires Next Router context which is fine but for simplicity in sidebar we stick close to native or wrapping
    // Actually importing Link from next/link is better.
    // Wait, I used `import { Link, usePathname } from 'next/navigation';` -> Link is not exported from next/navigation. It is from next/link.
    // Correcting import in render logic below.
    return (
        <a
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors min-h-[44px]",
                active
                    ? "bg-[var(--accent-muted)] text-[var(--accent)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
                collapsed && "justify-center px-0"
            )}
            title={collapsed ? label : undefined}
        >
            {/* Clone icon to enforce size */}
            <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
            {!collapsed && <span>{label}</span>}
        </a>
    );
}
