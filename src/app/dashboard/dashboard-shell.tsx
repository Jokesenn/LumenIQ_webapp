"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Sidebar, Header } from "@/components/dashboard";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { AiChatButton, AiChatDrawer } from "@/components/dashboard/ai-chat";
import { ActionsDrawer } from "@/components/dashboard/actions-drawer";
import { ActionsFab } from "@/components/dashboard/actions-fab";
import { ErrorBoundary } from "@/components/error-boundary";
import { SectionErrorBoundary } from "@/components/ui/section-error-boundary";
import { ThresholdsProvider } from "@/lib/thresholds/context";

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

  type ActiveDrawer = 'none' | 'command' | 'chat' | 'actions';
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>('none');

  // One-drawer-at-a-time logic
  const openChat = useCallback(() => {
    setActiveDrawer('chat');
  }, []);

  const openActions = useCallback(() => {
    setActiveDrawer('actions');
  }, []);

  // Keyboard shortcut: Cmd+Shift+A to toggle actions drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "a" && e.metaKey && e.shiftKey) {
        e.preventDefault();
        setActiveDrawer((prev) => (prev === 'actions' ? 'none' : 'actions'));
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <ThresholdsProvider>
      <div className="flex min-h-screen bg-zinc-950 bg-hex-pattern">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onOpenCommand={() => setActiveDrawer('command')}
          />

          <ErrorBoundary>
            <main className="flex-1 overflow-auto p-4 lg:p-8">
              {children}
            </main>
          </ErrorBoundary>
        </div>

        <Suspense>
          <CommandPalette open={activeDrawer === 'command'} onOpenChange={(open) => setActiveDrawer(open ? 'command' : 'none')} />
        </Suspense>

        <Suspense>
          <SectionErrorBoundary
            sectionName="chat-drawer"
            fallbackTitle="Le chat n'a pas pu être chargé"
          >
            <AiChatDrawer open={activeDrawer === 'chat'} onOpenChange={(open) => setActiveDrawer(open ? 'chat' : 'none')} />
          </SectionErrorBoundary>
        </Suspense>
        <AiChatButton onClick={openChat} isOpen={activeDrawer === 'chat'} />

        <Suspense>
          <SectionErrorBoundary
            sectionName="actions-drawer"
            fallbackTitle="Le panneau d'actions n'a pas pu être chargé"
          >
            <ActionsDrawer open={activeDrawer === 'actions'} onOpenChange={(open) => setActiveDrawer(open ? 'actions' : 'none')} />
          </SectionErrorBoundary>
        </Suspense>
        <ActionsFab onClick={openActions} isOpen={activeDrawer === 'actions'} />
      </div>
    </ThresholdsProvider>
  );
}
