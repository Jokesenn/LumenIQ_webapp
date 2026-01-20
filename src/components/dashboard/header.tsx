"use client";

import { Menu } from "lucide-react";
import { useProfile, getInitials, formatPlanName } from "@/hooks/use-profile";
import { useUser } from "@/hooks/use-supabase";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useUser();
  const { profile, loading } = useProfile();

  const initials = user
    ? getInitials(profile?.full_name, user.email ?? "")
    : "...";

  const planDisplay = profile
    ? `Plan ${formatPlanName(profile.plan)} • ${profile.series_used_this_period ?? 0}/50 séries`
    : "Chargement...";

  return (
    <header className="px-8 py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-primary)] sticky top-0 z-10">
      <button
        onClick={onToggleSidebar}
        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-[var(--accent-muted)] rounded-md text-xs font-medium text-[var(--accent)]">
          {loading ? (
            <span className="animate-pulse">Chargement...</span>
          ) : (
            planDisplay
          )}
        </div>
        <div
          className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-sm font-semibold text-white"
          title={profile?.full_name ?? user?.email ?? ""}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
