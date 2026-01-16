"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
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
          Plan Standard • 12/50 séries
        </div>
        <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-sm font-semibold text-white">
          JD
        </div>
      </div>
    </header>
  );
}
