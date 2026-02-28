"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-supabase";
import { Zap } from "lucide-react";
import { ActionsBoard } from "./actions-board";

interface ActionsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActionsDrawer({ open, onOpenChange }: ActionsDrawerProps) {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [resolvedJobId, setResolvedJobId] = useState<string | null>(null);
  const [jobFilename, setJobFilename] = useState<string | null>(null);

  // Resolve jobId from URL or fallback to latest completed job
  useEffect(() => {
    const jobFromUrl = searchParams.get("job");
    if (jobFromUrl) {
      setResolvedJobId(jobFromUrl);
      return;
    }

    if (!user?.id) return;

    const userId = user.id;
    async function fetchLatestJob() {
      const supabase = createClient();
      const { data } = await supabase
        .schema("lumeniq")
        .from("forecast_jobs")
        .select("id, filename")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setResolvedJobId(data.id);
        setJobFilename(data.filename || null);
      }
    }

    fetchLatestJob();
  }, [searchParams, user]);

  // Fetch filename when jobId changes
  useEffect(() => {
    if (!resolvedJobId || jobFilename) return;

    async function fetchFilename() {
      const supabase = createClient();
      const { data } = await supabase
        .schema("lumeniq")
        .from("forecast_jobs")
        .select("filename")
        .eq("id", resolvedJobId!)
        .single();

      if (data?.filename) setJobFilename(data.filename);
    }

    fetchFilename();
  }, [resolvedJobId, jobFilename]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="w-[420px] sm:max-w-[420px] p-0 flex flex-col h-full gap-0 bg-zinc-950 border-white/10"
      >
        <SheetHeader className="px-6 py-4 border-b border-white/10 shrink-0">
          <SheetTitle className="text-white text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Actions
          </SheetTitle>
          <SheetDescription className="text-zinc-400 text-xs">
            {jobFilename
              ? `Recommandations pour ${jobFilename}`
              : "Recommandations issues de vos prévisions"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          <ActionsBoard mode="drawer" jobId={resolvedJobId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
