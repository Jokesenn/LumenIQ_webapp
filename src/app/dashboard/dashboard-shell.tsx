"use client";

import { useState, Suspense } from "react";
import { Sidebar, Header } from "@/components/dashboard";
import { CommandPalette } from "@/components/dashboard/command-palette";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenCommand={() => setCommandOpen(true)}
        />

        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>

      <Suspense>
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </Suspense>
    </div>
  );
}
