"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Sidebar, Header } from "@/components/dashboard";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { AiChatButton, AiChatDrawer } from "@/components/dashboard/ai-chat";

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
  const [chatOpen, setChatOpen] = useState(false);

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

      <Suspense>
        <AiChatDrawer open={chatOpen} onOpenChange={setChatOpen} />
      </Suspense>
      <AiChatButton onClick={() => setChatOpen(true)} isOpen={chatOpen} />
    </div>
  );
}
