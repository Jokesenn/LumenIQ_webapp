"use client"

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LumenIQLogo } from '@/components/common/logo';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
            scrolled
                ? "bg-[var(--bg-primary)]/90 backdrop-blur-md border-[var(--border)]"
                : "bg-transparent border-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <LumenIQLogo size={32} />
                    <span className="text-xl font-bold tracking-tight">LumenIQ</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="/#features">Features</NavLink>
                    <NavLink href="/pricing">Pricing</NavLink>
                    <NavLink href="/docs">Documentation</NavLink>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link href="/login">
                        <Button variant="ghost">Connexion</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="primary">Démarrer gratuitement</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
        >
            {children}
        </Link>
    );
}
