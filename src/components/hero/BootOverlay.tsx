"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { person } from "@/content/profile";

const BOOT_LINES = [
  "> initializing neural interface ...",
  "> loading identity matrix ........ ok",
  "> mounting portfolio modules ..... ok",
  "> calibrating digital human ...... ok",
  "> JF.OS ready",
];

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
      setLines(BOOT_LINES.slice(0, n)); // deterministic: never skips or duplicates
      if (n < BOOT_LINES.length) setTimeout(step, 360);
    };
    const id = setTimeout(step, 360);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [visible]);

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
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl holo-border font-display text-3xl font-bold text-neon-cyan neon-text"
            >
              JF
            </motion.div>

            <div className="mb-10 h-32 w-full max-w-sm font-mono text-xs text-neon-cyan/80 sm:text-sm">
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
              animate={{ opacity: lines.length >= BOOT_LINES.length ? 1 : 0.3, y: 0 }}
              disabled={lines.length < BOOT_LINES.length}
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
              Loads a 3D avatar with voice narration. Best with sound on.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
