"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  List,
  BarChart3,
  Sparkles,
  Moon,
  Sun,
  Search,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/** Custom event dispatched to switch tabs in ResultsContent without a server round-trip */
export const RESULTS_TAB_EVENT = "lumeniq:switch-results-tab";

interface CommandSeries {
  series_id: string;
  abc_class: string | null;
  xyz_class: string | null;
}

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [series, setSeries] = useState<CommandSeries[]>([]);
  const [loadingSeries, setLoadingSeries] = useState(false);

  const jobId = searchParams.get("job");
  const isOnResultsPage = pathname === "/dashboard/results";

  // Navigate to a results tab: event if already on the page, router.push otherwise
  const goToTab = useCallback(
    (tab: string) => {
      if (isOnResultsPage) {
        window.dispatchEvent(new CustomEvent(RESULTS_TAB_EVENT, { detail: tab }));
      } else {
        router.push(`/dashboard/results?tab=${tab}`);
      }
    },
    [isOnResultsPage, router]
  );

  // Wait for mount to avoid hydration mismatch from Radix ID generation
  useEffect(() => {
    setMounted(true);
    setIsMac(navigator.userAgent.includes("Mac"));
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  // Fetch series when dialog opens and a job is active
  useEffect(() => {
    if (!open || !jobId || series.length > 0) return;

    let cancelled = false;
    async function fetchSeries() {
      setLoadingSeries(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("forecast_results")
          .select("series_id, abc_class, xyz_class")
          .eq("job_id", jobId!)
          .order("series_id", { ascending: true });

        if (!cancelled && data) {
          setSeries(data as CommandSeries[]);
        }
      } catch {
        // silently fail — series section just won't appear
      } finally {
        if (!cancelled) setLoadingSeries(false);
      }
    }
    fetchSeries();
    return () => {
      cancelled = true;
    };
  }, [open, jobId, series.length]);

  // Reset series cache when job changes
  useEffect(() => {
    setSeries([]);
  }, [jobId]);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  const modifier = isMac ? "⌘" : "Ctrl+";

  if (!mounted) return null;

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Palette de commandes"
      description="Rechercher une série, naviguer ou exécuter une action"
    >
      <CommandInput placeholder="Rechercher ou exécuter..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => goToTab("overview"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Vue d&apos;ensemble
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => goToTab("series"))}>
            <List className="mr-2 h-4 w-4" />
            Séries
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => goToTab("reliability"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Fiabilité
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => goToTab("synthesis"))}>
            <Sparkles className="mr-2 h-4 w-4" />
            Synthèse IA
          </CommandItem>
        </CommandGroup>

        {/* Series (only when a job is active) */}
        {jobId && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Séries">
              {loadingSeries ? (
                <CommandItem disabled>Chargement...</CommandItem>
              ) : series.length === 0 ? (
                <CommandItem disabled>Aucune série disponible</CommandItem>
              ) : (
                series.map((s) => (
                  <CommandItem
                    key={s.series_id}
                    value={s.series_id}
                    onSelect={() =>
                      runCommand(() =>
                        router.push(
                          `/dashboard/results/series?job=${jobId}&series=${s.series_id}`
                        )
                      )
                    }
                  >
                    {s.series_id}
                    <div className="ml-auto flex gap-1">
                      <span className="px-1.5 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-400">
                        {s.abc_class}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs rounded bg-violet-500/20 text-violet-400">
                        {s.xyz_class}
                      </span>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </>
        )}

        {/* Actions */}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                setTheme(theme === "dark" ? "light" : "dark")
              )
            }
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            Basculer thème
            <CommandShortcut>{modifier}T</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// Search trigger button for the header
export function CommandPaletteTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.userAgent.includes("Mac"));
  }, []);

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 bg-white/5 rounded-lg hover:bg-white/10 hover:text-zinc-300 transition-colors"
    >
      <Search className="w-4 h-4" />
      <span className="hidden sm:inline">Rechercher...</span>
      <kbd className="ml-1 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-white/10 rounded text-zinc-500">
        {isMac ? "⌘K" : "Ctrl+K"}
      </kbd>
    </button>
  );
}
