"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoWithText, Logo } from "@/components/shared/logo";
import {
  BarChart3,
  Upload,
  TrendingUp,
  Clock,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useLogout } from "@/hooks/use-supabase";

interface SidebarProps {
  collapsed: boolean;
}

const navItems = [
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/dashboard/forecast", icon: Upload, label: "Nouveau forecast" },
  { href: "/dashboard/results", icon: TrendingUp, label: "Résultats" },
  { href: "/dashboard/history", icon: Clock, label: "Historique" },
  { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const logout = useLogout();
  const [loggingOut, setLoggingOut] = useState(false);

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
      } bg-[var(--bg-secondary)] border-r border-[var(--border)] p-5 flex flex-col transition-all duration-300 shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        {collapsed ? <Logo size={32} /> : <LogoWithText size={32} />}
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
              }`}
            >
              <item.icon size={20} />
              {!collapsed && (
                <span
                  className={`text-sm ${isActive ? "font-semibold" : "font-normal"}`}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-[var(--border)] pt-4 space-y-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all ${
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
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all disabled:opacity-50 ${
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
