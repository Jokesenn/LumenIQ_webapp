"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Sidebar, Header } from "@/components/dashboard";
import { CommandPalette } from "@/components/dashboard/command-palette";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSidebarCollapsed(e.matches);
    };
    handleChange(mql);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenCommand={() => setCommandOpen(true)}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>

      <Suspense>
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </Suspense>
    </div>
  );
}
