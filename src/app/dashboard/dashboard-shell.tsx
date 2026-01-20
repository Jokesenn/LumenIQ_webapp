"use client";

import { useState } from "react";
import { Sidebar, Header } from "@/components/dashboard";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
