"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Sidebar, Header } from "@/components/dashboard";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { AiChatButton, AiChatDrawer } from "@/components/dashboard/ai-chat";
import { ActionsDrawer } from "@/components/dashboard/actions-drawer";
import { ActionsFab } from "@/components/dashboard/actions-fab";
import { ErrorBoundary } from "@/components/error-boundary";

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
  const [actionsOpen, setActionsOpen] = useState(false);

  // One-drawer-at-a-time logic
  const openChat = useCallback(() => {
    setActionsOpen(false);
    setChatOpen(true);
  }, []);

  const openActions = useCallback(() => {
    setChatOpen(false);
    setActionsOpen(true);
  }, []);

  // Keyboard shortcut: Cmd+Shift+A to toggle actions drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "a" && e.metaKey && e.shiftKey) {
        e.preventDefault();
        setActionsOpen((prev) => {
          if (!prev) setChatOpen(false);
          return !prev;
        });
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950 bg-hex-pattern">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenCommand={() => setCommandOpen(true)}
        />

        <ErrorBoundary>
          <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
        </ErrorBoundary>
      </div>

      <Suspense>
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </Suspense>

      <Suspense>
        <AiChatDrawer open={chatOpen} onOpenChange={setChatOpen} />
      </Suspense>
      <AiChatButton onClick={openChat} isOpen={chatOpen} />

      <Suspense>
        <ActionsDrawer open={actionsOpen} onOpenChange={setActionsOpen} />
      </Suspense>
      <ActionsFab onClick={openActions} isOpen={actionsOpen} />
    </div>
  );
}
