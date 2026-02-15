"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import type { ChatMessage, JobSummarySnapshot } from "./types";

interface AiChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiChatDrawer({ open, onOpenChange }: AiChatDrawerProps) {
  const { user } = useUser();
  const searchParams = useSearchParams();

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Job context state
  const [resolvedJobId, setResolvedJobId] = useState<string | null>(null);
  const [summarySnapshot, setSummarySnapshot] =
    useState<JobSummarySnapshot | null>(null);
  const [xyzZCount, setXyzZCount] = useState(0);
  const lastKnownJobId = useRef<string | null>(null);

  // Glow state for animated border: idle | thinking | streaming
  const glowState = isLoading ? "thinking" : "idle";

  // Resolve jobId from URL or fallback to latest completed job
  useEffect(() => {
    const jobFromUrl = searchParams.get("job");

    if (jobFromUrl) {
      lastKnownJobId.current = jobFromUrl;
      setResolvedJobId(jobFromUrl);
      return;
    }

    // Use last known jobId if available (navigation away from results)
    if (lastKnownJobId.current) {
      setResolvedJobId(lastKnownJobId.current);
      return;
    }

    // Fallback: fetch latest completed job
    if (!user?.id) return;

    const userId = user.id;
    async function fetchLatestJob() {
      const supabase = createClient();
      const { data } = await supabase
        .schema("lumeniq")
        .from("forecast_jobs")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data?.id) {
        lastKnownJobId.current = data.id;
        setResolvedJobId(data.id);
      }
    }

    fetchLatestJob();
  }, [searchParams, user]);

  // Fetch summary snapshot when jobId changes and drawer is open
  useEffect(() => {
    if (!open || !resolvedJobId || !user?.id) return;

    const userId = user.id;
    async function fetchSummary() {
      const supabase = createClient();

      const { data: summaryData } = await supabase
        .schema("lumeniq")
        .from("job_summaries")
        .select(
          "global_wape, global_bias_pct, n_series_total, n_series_failed, winner_models"
        )
        .eq("job_id", resolvedJobId!)
        .eq("user_id", userId)
        .single();

      const { count: zCount } = await supabase
        .schema("lumeniq")
        .from("forecast_results")
        .select("*", { count: "exact", head: true })
        .eq("job_id", resolvedJobId!)
        .eq("user_id", userId)
        .eq("xyz_class", "Z");

      if (summaryData) {
        setSummarySnapshot({
          global_wape: summaryData.global_wape != null ? Number(summaryData.global_wape) : null,
          global_bias_pct: summaryData.global_bias_pct != null ? Number(summaryData.global_bias_pct) : null,
          n_series_total: Number(summaryData.n_series_total),
          n_series_failed: Number(summaryData.n_series_failed),
          winner_models: summaryData.winner_models as Record<string, number> | null,
        });
      }
      setXyzZCount(zCount ?? 0);
    }

    fetchSummary();
  }, [open, resolvedJobId, user]);

  // Keep messagesRef in sync for use inside callbacks without stale closures
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Send message to N8N webhook
  const sendMessage = useCallback(
    async (question: string) => {
      // Guard: prevent duplicate sends while already loading
      if (isLoadingRef.current) return;
      if (!resolvedJobId || !user?.id) return;

      const webhookUrl = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL;
      if (!webhookUrl) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Erreur de configuration : URL du webhook non définie.",
            timestamp: new Date(),
            error: true,
          },
        ]);
        return;
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
        timestamp: new Date(),
      };
      isLoadingRef.current = true;
      setMessages((prev) => [...prev, userMessage]);
      setHasSentFirstMessage(true);
      setIsLoading(true);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        // Use ref to get latest messages (avoids stale closure)
        const history = [...messagesRef.current, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: resolvedJobId,
            userId: user.id,
            question,
            history,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Erreur serveur (${response.status})`);
        }

        const data = await response.json();
        const responseText =
          data.response || data.output || data.message || data.text || "";

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              responseText ||
              "Je n'ai pas pu générer une réponse. Veuillez réessayer.",
            timestamp: new Date(),
            error: !responseText,
          },
        ]);
      } catch (err) {
        const errorMessage =
          err instanceof DOMException && err.name === "AbortError"
            ? "La requête a expiré. Le serveur met trop de temps à répondre."
            : "Une erreur est survenue. Vérifiez votre connexion et réessayez.";

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: errorMessage,
            timestamp: new Date(),
            error: true,
          },
        ]);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [resolvedJobId, user?.id]
  );

  // Retry a failed message
  const handleRetry = useCallback(
    (errorMessageId: string) => {
      // Use ref to read latest messages (avoids stale closure)
      const currentMessages = messagesRef.current;
      const errorIndex = currentMessages.findIndex((m) => m.id === errorMessageId);
      if (errorIndex < 1) return;

      const userMessage = currentMessages[errorIndex - 1];
      if (userMessage.role !== "user") return;

      // Remove the error message
      setMessages((prev) => prev.filter((m) => m.id !== errorMessageId));

      // Re-send the user's question
      sendMessage(userMessage.content);
    },
    [sendMessage]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="w-[420px] sm:max-w-[420px] p-0 flex flex-col h-full gap-0 bg-zinc-950 border-white/10 overflow-hidden"
      >
        <div
          className="ai-drawer-glow flex flex-col h-full"
          data-state={glowState}
        >
          <SheetHeader className="px-6 py-4 border-b border-white/10 shrink-0 bg-zinc-950/80 backdrop-blur-xl">
            <SheetTitle className="text-white text-lg font-display flex items-center gap-2.5">
              Assistant IA
              <span className="ai-status-dot" />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Posez des questions sur vos résultats de forecast
            </SheetDescription>
          </SheetHeader>
          <div className="ai-header-line" />

          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            onRetry={handleRetry}
            hasJobContext={!!resolvedJobId}
          />

          <SuggestedQuestions
            summary={summarySnapshot}
            xyzZCount={xyzZCount}
            onSelect={sendMessage}
            visible={!hasSentFirstMessage && !!resolvedJobId}
          />

          <ChatInput onSend={sendMessage} disabled={isLoading || !resolvedJobId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
