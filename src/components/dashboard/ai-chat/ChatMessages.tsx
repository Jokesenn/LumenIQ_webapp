"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "./types";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onRetry: (messageId: string) => void;
  hasJobContext: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-white/40"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const WELCOME_MESSAGE =
  "Je suis votre assistant forecast. Posez-moi vos questions sur les résultats de cette analyse, ou choisissez une suggestion ci-dessous.";
const NO_JOB_MESSAGE =
  "Lancez un forecast pour que je puisse vous aider à analyser vos résultats.";

export function ChatMessages({
  messages,
  isLoading,
  onRetry,
  hasJobContext,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or loading state change
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    // Use requestAnimationFrame to ensure DOM has rendered new content
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages.length, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto"
    >
      <div className="flex flex-col gap-4 px-6 py-4">
        {/* Welcome message */}
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white/5 text-white rounded-2xl rounded-bl-md px-4 py-2.5">
            <p className="text-sm leading-relaxed text-white/70">
              {hasJobContext ? WELCOME_MESSAGE : NO_JOB_MESSAGE}
            </p>
          </div>
        </div>

        {/* Chat messages */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onRetry={
              message.error
                ? () => onRetry(message.id)
                : undefined
            }
          />
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
