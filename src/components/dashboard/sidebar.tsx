"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoWithText, Logo } from "@/components/shared/logo";
import {
  BarChart3,
  Upload,
  Zap,
  TrendingUp,
  Clock,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUrgentCount } from "@/hooks/use-actions";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useLogout } from "@/hooks/use-supabase";

interface SidebarProps {
  collapsed: boolean;
  onToggle?: () => void;
}

const navItems = [
  { href: "/dashboard", icon: BarChart3, label: "Tableau de bord" },
  { href: "/dashboard/actions", icon: Zap, label: "Actions", badge: true },
  { href: "/dashboard/forecast", icon: Upload, label: "Nouvelle prévision" },
  { href: "/dashboard/results", icon: TrendingUp, label: "Résultats" },
  { href: "/dashboard/history", icon: Clock, label: "Historique" },
  { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const logout = useLogout();
  const [loggingOut, setLoggingOut] = useState(false);
  const urgentCount = useUrgentCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={`${
        collapsed ? "w-[72px]" : "w-[260px]"
      } bg-zinc-950 border-r border-white/[0.08] p-5 flex flex-col transition-all duration-300 ease-in-out shrink-0`}
    >
      {/* Logo + Collapse toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="px-3">
          {collapsed ? <Logo size={32} /> : <LogoWithText size={32} />}
        </div>
        {onToggle && !collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {onToggle && collapsed && (
          <button
            onClick={onToggle}
            className="absolute left-[72px] top-6 -translate-x-1/2 p-1 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors z-10"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const showBadge = (item as { badge?: boolean }).badge && urgentCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 relative ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="relative shrink-0">
                <item.icon size={20} />
                {showBadge && collapsed && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
              </span>
              {!collapsed && (
                <>
                  <span
                    className={`text-sm flex-1 ${isActive ? "font-semibold" : "font-normal"}`}
                  >
                    {item.label}
                  </span>
                  {showBadge && (
                    <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                      {urgentCount}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-white/[0.08] pt-4 space-y-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-colors duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {mounted ? (
            theme === "dark" ? <Sun size={20} /> : <Moon size={20} />
          ) : (
            <Moon size={20} />
          )}
          {!collapsed && (
            <span className="text-sm">
              {mounted ? (theme === "dark" ? "Mode clair" : "Mode sombre") : "Mode sombre"}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 disabled:opacity-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} className={loggingOut ? "animate-pulse" : ""} />
          {!collapsed && (
            <span className="text-sm">
              {loggingOut ? "Déconnexion..." : "Déconnexion"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
