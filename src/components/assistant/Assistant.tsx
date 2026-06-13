"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ask, quickActions, type AssistantReply } from "@/content/assistant";
import { useSpeech } from "@/hooks/useSpeech";
import { person } from "@/content/profile";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  text: string;
  suggestions?: string[];
}

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `Hi, I'm ${person.firstName}'s portfolio assistant. Ask me anything about his work, or tap a chip below.`,
      suggestions: quickActions.map((q) => q.label),
    },
  ]);
  const [input, setInput] = useState("");
  const { speak, cancel, speaking, supported, enabled, setEnabled } = useSpeech();
  const listRef = useRef<HTMLDivElement>(null);
  const [pulse, setPulse] = useState(true);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Surface a hint so visitors notice the assistant exists.
  useEffect(() => {
    const show = setTimeout(() => setShowHint(true), 4000);
    const hide = setTimeout(() => setShowHint(false), 16000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const handle = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    const reply: AssistantReply = ask(q);
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      { role: "assistant", text: reply.text, suggestions: reply.suggestions },
    ]);
    setInput("");
    if (enabled) speak(reply.text);
    if (reply.scrollTo) {
      setTimeout(() => {
        document.getElementById(reply.scrollTo!)?.scrollIntoView({ behavior: "smooth" });
      }, 450);
    }
  };

  return (
    <>
      {/* Discoverability hint */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.button
            initial={{ opacity: 0, x: 12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.9 }}
            onClick={() => {
              setOpen(true);
              setPulse(false);
              setShowHint(false);
            }}
            className="fixed bottom-[1.65rem] right-24 z-[80] flex items-center gap-2 rounded-full glass-strong px-4 py-2.5 text-sm font-medium text-foreground shadow-glow-blue sm:bottom-8"
          >
            <span className="text-base">👋</span>
            Hi! Ask me anything
            <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-[#0b0e18]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: "spring" }}
        onClick={() => {
          setOpen((o) => !o);
          setPulse(false);
          setShowHint(false);
        }}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple shadow-glow-purple sm:bottom-6 sm:right-6"
      >
        {pulse && (
          <span className="absolute inset-0 animate-ping rounded-full bg-neon-blue/40" />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg key="bot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4M8 8h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" />
              <circle cx="9.5" cy="13" r="1" fill="white" stroke="none" />
              <circle cx="14.5" cy="13" r="1" fill="white" stroke="none" />
              <path d="M4 13H2M22 13h-2" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-24 right-4 z-[80] flex h-[min(70vh,560px)] w-[min(92vw,400px)] flex-col overflow-hidden rounded-3xl glass-strong shadow-glow-blue sm:right-6"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple text-sm">
                ◑
                <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface", speaking ? "animate-pulse bg-neon-green" : "bg-neon-green")} />
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-foreground">Jarvis</p>
                <p className="text-[11px] text-muted">{speaking ? "speaking…" : "portfolio assistant"}</p>
              </div>
              {supported && (
                <button
                  onClick={() => {
                    if (speaking) cancel();
                    setEnabled(!enabled);
                  }}
                  className="rounded-full glass px-2.5 py-1 text-[11px] text-muted transition hover:text-neon-cyan"
                  title="Toggle voice"
                >
                  {enabled ? "🔊 voice" : "🔇 muted"}
                </button>
              )}
            </div>

            {/* messages */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex flex-col gap-2", m.role === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-gradient-to-br from-neon-blue/90 to-neon-purple/90 text-white"
                        : "glass text-foreground/90"
                    )}
                  >
                    {m.text}
                  </div>
                  {m.suggestions && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => handle(s)}
                          className="rounded-full border border-neon-blue/30 bg-neon-blue/5 px-2.5 py-1 text-xs text-neon-cyan transition hover:bg-neon-blue/15"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handle(input);
              }}
              className="flex items-center gap-2 border-t border-white/8 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Jatin…"
                className="flex-1 rounded-full bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none ring-1 ring-white/10 placeholder:text-faint focus:ring-neon-blue/50"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
