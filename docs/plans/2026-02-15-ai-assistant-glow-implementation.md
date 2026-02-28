# AI Assistant Glow Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an animated conic gradient border to the AI chat drawer that reacts to assistant state (idle/thinking/streaming), plus premium visual upgrades to header, message bubbles, input, suggestions, and FAB button.

**Architecture:** Pure CSS animations for the glow border (conic-gradient + @property for GPU-accelerated angle rotation). React state (`isLoading`) drives a `data-state` attribute on the drawer wrapper, and CSS selectors handle all visual transitions. No new files — all changes go into existing components and `globals.css`.

**Tech Stack:** Tailwind CSS v4, CSS @property, CSS conic-gradient, Framer Motion (existing), React state management (existing)

---

### Task 1: Add CSS keyframes and AI drawer glow classes to globals.css

**Files:**
- Modify: `src/app/globals.css` (insert after line 497, after the `glow-pulse` keyframe closing brace)

**Step 1: Add the `@property` declaration and keyframe for conic rotation**

Insert the following block in `globals.css` inside the `@layer utilities` block, right after the `glow-pulse` keyframe (after line 497):

```css
  /* ============================================
     AI ASSISTANT — Animated glow border
     ============================================ */

  @property --ai-glow-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes ai-border-spin {
    to { --ai-glow-angle: 360deg; }
  }

  @keyframes ai-glow-breathe {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.85; }
  }

  /* Wrapper: creates the luminous border via ::before pseudo-element */
  .ai-drawer-glow {
    position: relative;
    border-radius: 0; /* sheet is flush to edge */
  }

  .ai-drawer-glow::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.5px;
    background: conic-gradient(
      from var(--ai-glow-angle),
      rgba(99, 102, 241, 0.6),
      rgba(139, 92, 246, 0.4),
      rgba(59, 130, 246, 0.3),
      rgba(139, 92, 246, 0.4),
      rgba(99, 102, 241, 0.6)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 1;
    /* Default: idle state */
    animation: ai-border-spin 8s linear infinite;
    opacity: 0.4;
    transition: opacity 0.6s ease, filter 0.6s ease;
    filter: blur(0px);
  }

  /* Outer glow shadow — lives on the wrapper itself */
  .ai-drawer-glow {
    transition: box-shadow 0.6s ease;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.08);
  }

  /* --- State: thinking (waiting for AI response) --- */
  .ai-drawer-glow[data-state="thinking"]::before {
    animation:
      ai-border-spin 2.5s linear infinite,
      ai-glow-breathe 1.5s ease-in-out infinite;
    opacity: 0.75;
    filter: blur(2px);
  }

  .ai-drawer-glow[data-state="thinking"] {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.15);
  }

  /* --- State: streaming (AI is responding) --- */
  .ai-drawer-glow[data-state="streaming"]::before {
    animation: ai-border-spin 5s linear infinite;
    opacity: 1;
    filter: blur(3px);
  }

  .ai-drawer-glow[data-state="streaming"] {
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.2);
  }

  /* --- Header gradient line — reactive opacity --- */
  .ai-header-line {
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.2), transparent);
    transition: opacity 0.6s ease;
    opacity: 0.5;
  }

  .ai-drawer-glow[data-state="thinking"] .ai-header-line {
    opacity: 0.8;
    animation: ai-glow-breathe 1.5s ease-in-out infinite;
  }

  .ai-drawer-glow[data-state="streaming"] .ai-header-line {
    opacity: 1;
  }

  /* --- Status dot indicator --- */
  .ai-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.5);
    transition: background 0.3s, box-shadow 0.3s;
    flex-shrink: 0;
  }

  .ai-drawer-glow[data-state="thinking"] .ai-status-dot {
    background: rgba(139, 92, 246, 0.8);
    animation: pulse 1.5s ease-in-out infinite;
    box-shadow: 0 0 6px rgba(139, 92, 246, 0.4);
  }

  .ai-drawer-glow[data-state="streaming"] .ai-status-dot {
    background: rgba(99, 102, 241, 1);
    box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
  }

  /* --- FAB pulse ring --- */
  @keyframes ai-fab-ring {
    0% {
      box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.35);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(167, 139, 250, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(167, 139, 250, 0);
    }
  }

  .ai-fab-pulse {
    animation: ai-fab-ring 2.5s ease-out infinite;
  }
```

**Step 2: Verify the CSS parses correctly**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npx tsc --noEmit 2>&1 | head -5`
Expected: No CSS-related errors (TypeScript won't catch CSS issues, but it confirms no import breakage)

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm run build 2>&1 | tail -20`
Expected: Build succeeds. If `@property` causes issues with Tailwind v4, we'll need to move it outside `@layer utilities`.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add AI drawer glow animation CSS classes and keyframes"
```

---

### Task 2: Add glow wrapper and reactive state to AiChatDrawer

**Files:**
- Modify: `src/components/dashboard/ai-chat/AiChatDrawer.tsx`

**Step 1: Compute the `glowState` value from existing state**

After line 39 (`const lastKnownJobId = useRef<string | null>(null);`), add:

```tsx
// Glow state for animated border: idle | thinking | streaming
// For now both loading states map to "thinking" — streaming can be
// differentiated later if we switch to SSE/streaming responses
const glowState = isLoading ? "thinking" : "idle";
```

**Step 2: Wrap SheetContent with the glow container**

Replace the return block (lines 251-285) with:

```tsx
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
```

Key changes vs original:
- Added `overflow-hidden` to SheetContent (prevents glow bleed)
- Wrapped everything in `<div className="ai-drawer-glow" data-state={glowState}>`
- Header gets `bg-zinc-950/80 backdrop-blur-xl` for glassmorphism
- Title gets `flex items-center gap-2.5` + `<span className="ai-status-dot" />`
- Gradient line uses new `ai-header-line` class instead of inline gradient

**Step 3: Verify it renders**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm run build 2>&1 | tail -10`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/dashboard/ai-chat/AiChatDrawer.tsx
git commit -m "feat: add animated glow wrapper and reactive state to AI chat drawer"
```

---

### Task 3: Enhance ChatMessage bubbles

**Files:**
- Modify: `src/components/dashboard/ai-chat/ChatMessage.tsx`

**Step 1: Update the bubble styling**

Replace the className logic in the inner `<div>` (lines 27-34) with:

```tsx
        className={cn(
          "max-w-[85%] px-4 py-2.5",
          isUser
            ? "bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/15 shadow-lg shadow-violet-500/5 text-white rounded-2xl rounded-br-md"
            : isError
              ? "bg-red-500/10 border border-red-500/30 text-white rounded-2xl rounded-bl-md backdrop-blur-sm"
              : "bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-indigo-500/[0.03] text-white rounded-2xl rounded-bl-md"
        )}
```

Changes:
- User bubble: added `border border-violet-500/15 shadow-lg shadow-violet-500/5`
- Assistant bubble: added `shadow-lg shadow-indigo-500/[0.03]`
- Error bubble: unchanged

**Step 2: Verify build**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm run build 2>&1 | tail -10`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/dashboard/ai-chat/ChatMessage.tsx
git commit -m "style: add subtle border and shadow to AI chat message bubbles"
```

---

### Task 4: Enhance ChatInput with gradient separator and focus ring

**Files:**
- Modify: `src/components/dashboard/ai-chat/ChatInput.tsx`

**Step 1: Replace the return block (lines 38-60)**

```tsx
  return (
    <div className="shrink-0">
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <div className="bg-zinc-900/30 backdrop-blur-xl p-4 flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 resize-none outline-none leading-relaxed disabled:opacity-50 rounded-lg px-0 py-0 ring-0 focus:ring-1 focus:ring-indigo-500/30 transition-shadow duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "h-8 w-8 p-0 shrink-0 transition-all duration-200",
            value.trim() && !disabled
              ? "text-violet-300 bg-indigo-500/20 hover:bg-indigo-500/30 hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]"
              : "text-violet-400/50 hover:text-violet-300 hover:bg-violet-500/10"
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
```

**Step 2: Add `cn` import**

Add to the existing imports at the top of the file:

```tsx
import { cn } from "@/lib/utils";
```

**Step 3: Verify build**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm run build 2>&1 | tail -10`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/dashboard/ai-chat/ChatInput.tsx
git commit -m "style: enhance AI chat input with gradient separator and focus ring"
```

---

### Task 5: Add shimmer effect to SuggestedQuestions

**Files:**
- Modify: `src/components/dashboard/ai-chat/SuggestedQuestions.tsx`

**Step 1: Enhance the suggestion buttons**

Replace the Button element (lines 106-114) with:

```tsx
              <Button
                key={s.question}
                variant="outline"
                size="sm"
                onClick={() => onSelect(s.question)}
                className="shimmer text-xs text-white/70 border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:text-indigo-300 hover:shadow-sm hover:shadow-indigo-500/10 h-auto py-1.5 px-3 transition-all duration-200"
              >
                {s.label}
              </Button>
```

Changes:
- Added `shimmer` class (existing CSS in globals.css — plays once on mount)
- `hover:border-indigo-500/40` (was `/30`)
- Added `hover:shadow-sm hover:shadow-indigo-500/10`
- Added `transition-all duration-200`

**Step 2: Verify build**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm run build 2>&1 | tail -10`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/dashboard/ai-chat/SuggestedQuestions.tsx
git commit -m "style: add shimmer effect and enhanced hover to suggested questions"
```

---

### Task 6: Enhance AiChatButton FAB with pulse ring

**Files:**
- Modify: `src/components/dashboard/ai-chat/AiChatButton.tsx`

**Step 1: Replace the component (full file)**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AiChatButton({ onClick, isOpen }: AiChatButtonProps) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={onClick}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "flex items-center justify-center",
            "w-14 h-14 rounded-full",
            "bg-violet-600 hover:bg-violet-500",
            "text-white shadow-lg shadow-violet-500/25",
            "transition-colors cursor-pointer",
            "ai-fab-pulse"
          )}
          aria-label="Ouvrir l'assistant IA"
        >
          <motion.span
            whileHover={{ rotate: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
```

Changes:
- Added `ai-fab-pulse` class for the ring animation
- Wrapped `MessageCircle` in `motion.span` with `whileHover={{ rotate: 8 }}` for micro-rotation

**Step 2: Verify build**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm run build 2>&1 | tail -10`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/dashboard/ai-chat/AiChatButton.tsx
git commit -m "style: add pulse ring animation and hover rotation to AI chat FAB"
```

---

### Task 7: Visual QA and final verification

**Step 1: Run full build**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm run build`
Expected: Build succeeds with no errors

**Step 2: Run linter**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm run lint`
Expected: No new warnings or errors

**Step 3: Run type check**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npx tsc --noEmit`
Expected: No type errors

**Step 4: Run existing tests**

Run: `cd /Users/johannsenn/Documents/Git_repo/LumenIQ_webapp && npm test`
Expected: All existing tests pass (no AI chat tests exist, but ensure nothing breaks)

**Step 5: Manual visual QA**

Open dev server (`npm run dev`) and verify:
1. Open the AI chat drawer — confirm animated conic gradient border is visible and rotating slowly (idle state)
2. Send a message — confirm border speeds up and pulses (thinking state)
3. When response arrives — confirm border returns to idle
4. Header shows status dot that changes with state
5. Message bubbles have subtle borders and shadows
6. Input area has gradient separator and focus ring
7. Suggested questions have shimmer on appear and enhanced hover
8. FAB button has pulse ring when drawer is closed
9. FAB icon rotates slightly on hover
10. No visual regressions on the rest of the dashboard

**Step 6: Fix any @property compatibility issue**

If `@property --ai-glow-angle` doesn't work inside `@layer utilities` with Tailwind v4, move the `@property` declaration to before the `@layer utilities` block (after the `:root` and `.light` blocks, around line 155). The `@property` at-rule is not a utility and may need to be at the top level.

**Step 7: Commit any fixes**

```bash
git add -A
git commit -m "fix: final QA adjustments for AI assistant glow redesign"
```
