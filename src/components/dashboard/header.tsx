"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Settings, LogOut } from "lucide-react";
import { useProfile, getInitials, formatPlanName } from "@/hooks/use-profile";
import { useUser, useLogout } from "@/hooks/use-supabase";
import { CommandPaletteTrigger } from "@/components/dashboard/command-palette";
import Link from "next/link";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenCommand?: () => void;
}

const planBadgeStyles: Record<string, string> = {
  standard: "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]",
  ml: "bg-[var(--color-copper-bg)] text-[var(--color-copper)]",
  premium: "bg-gradient-to-r from-[var(--color-copper-bg)] to-orange-500/15 text-[var(--color-copper)]",
};

export function Header({ onToggleSidebar, onOpenCommand }: HeaderProps) {
  const { user } = useUser();
  const { profile, loading } = useProfile();
  const logout = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user
    ? getInitials(profile?.full_name, user.email ?? "")
    : "...";

  const plan = profile?.plan ?? "standard";
  const seriesUsed = profile?.series_used_this_period ?? 0;
  const defaultQuotas: Record<string, number> = { standard: 50, ml: 150, premium: 300 };
  const seriesQuota = (profile as Record<string, unknown> | null)?.series_quota as number | undefined ?? defaultQuotas[plan] ?? 50;
  const usagePercent = Math.min((seriesUsed / seriesQuota) * 100, 100);

  return (
    <header className="px-8 py-4 flex justify-between items-center bg-white shadow-[var(--shadow-nav)] sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-surface)] rounded-lg transition-colors duration-200"
        >
          <Menu size={20} />
        </button>

        {onOpenCommand && (
          <CommandPaletteTrigger onClick={onOpenCommand} />
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Plan badge */}
        <div
          className={`px-3 py-1.5 rounded-md text-xs font-medium font-display ${
            loading ? "bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)]" : planBadgeStyles[plan] ?? planBadgeStyles.standard
          }`}
        >
          {loading ? (
            <span className="animate-pulse">Chargement...</span>
          ) : (
            `Plan ${formatPlanName(plan)}`
          )}
        </div>

        {/* Usage indicator */}
        {!loading && (
          <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-copper)] rounded-full transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {seriesUsed}/{seriesQuota}
            </span>
          </div>
        )}

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-[var(--color-copper-bg)] flex items-center justify-center text-sm font-semibold text-[var(--color-copper)] hover:bg-[var(--color-copper-bg)] transition-colors ring-2 ring-[var(--color-copper)]/20 hover:ring-[var(--color-copper)]/40"
            title={profile?.full_name ?? user?.email ?? ""}
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-card)] py-2 z-50">
              <div className="px-4 py-2.5 border-b border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-text)] truncate">
                  {profile?.full_name ?? "Utilisateur"}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                  {user?.email}
                </p>
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text)] transition-colors"
              >
                <Settings size={16} />
                Paramètres
              </Link>
              <button
                onClick={() => { setDropdownOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
