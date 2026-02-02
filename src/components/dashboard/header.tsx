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
  standard: "bg-zinc-800 text-zinc-300",
  ml: "bg-indigo-500/20 text-indigo-400",
  premium: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400",
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
  const seriesQuota = 50;
  const usagePercent = Math.min((seriesUsed / seriesQuota) * 100, 100);

  return (
    <header className="px-8 py-4 border-b border-white/[0.08] flex justify-between items-center bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
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
          className={`px-3 py-1.5 rounded-md text-xs font-medium ${
            loading ? "bg-zinc-800 text-zinc-500" : planBadgeStyles[plan] ?? planBadgeStyles.standard
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
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <span className="text-sm text-zinc-400">
              {seriesUsed}/{seriesQuota}
            </span>
          </div>
        )}

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-semibold text-indigo-400 hover:bg-indigo-500/30 transition-colors"
            title={profile?.full_name ?? user?.email ?? ""}
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-56 bg-zinc-900 border border-white/[0.1] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] py-2 z-50">
              <div className="px-4 py-2.5 border-b border-white/[0.08]">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.full_name ?? "Utilisateur"}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {user?.email}
                </p>
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Settings size={16} />
                Paramètres
              </Link>
              <button
                onClick={() => { setDropdownOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
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
