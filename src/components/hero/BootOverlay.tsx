"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { person } from "@/content/profile";

const BOOT_LINES = [
  "> booting up the robot ........... ok",
  "> loading Jatin's brain .......... ok",
  "> charging enthusiasm ........... 100%",
  "> all systems online",
];

function Core() {
  return (
    <div className="relative mb-9 h-32 w-32" style={{ perspective: 600 }}>
      <div className="absolute inset-0 rounded-full bg-neon-blue/20 blur-2xl animate-pulse-glow" />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-neon-blue/60"
        animate={{ rotateX: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-neon-purple/60"
        animate={{ rotateY: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-5 rounded-full border border-neon-cyan/50"
        animate={{ rotateZ: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-[38%] rounded-full bg-gradient-to-br from-neon-blue to-neon-purple animate-pulse-glow"
        style={{ boxShadow: "0 0 28px rgba(56,189,248,0.8), 0 0 50px rgba(168,85,247,0.5)" }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <span
          className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-neon-cyan"
          style={{ boxShadow: "0 0 12px #22d3ee" }}
        />
      </motion.div>
    </div>
  );
}

export default function BootOverlay({
  visible,
  onInitialize,
}: {
  visible: boolean;
  onInitialize: () => void;
}) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let n = 0;
    const step = () => {
      if (cancelled) return;
      n++;
      setLines(BOOT_LINES.slice(0, n));
      if (n < BOOT_LINES.length) setTimeout(step, 320);
    };
    const id = setTimeout(step, 320);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [visible]);

  const ready = lines.length >= BOOT_LINES.length;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-base px-6"
        >
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div
            className="glow-orb animate-pulse-glow"
            style={{ top: "20%", left: "35%", width: 360, height: 360, background: "#6d28d9" }}
          />
          <div className="relative flex flex-col items-center">
            <Core />

            <div className="mb-9 h-24 w-full max-w-sm font-mono text-xs text-neon-cyan/80 sm:text-sm">
              {lines.map((l, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={i === BOOT_LINES.length - 1 ? "mt-1 text-neon-green" : ""}
                >
                  {l}
                </motion.p>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: ready ? 1 : 0.3, y: 0 }}
              disabled={!ready}
              onClick={onInitialize}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-8 py-3.5 font-display text-sm font-semibold tracking-wide text-white shadow-glow-purple disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse-glow rounded-full bg-white" />
                Enter {person.firstName}&apos;s World
              </span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </motion.button>

            <p className="mt-5 max-w-xs text-center text-xs text-faint">
              Meet my robot sidekick — with voice. Best with sound on.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
