"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Subtitles({ text }: { text: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-30 flex justify-center px-4 sm:bottom-24">
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.35 }}
            className="max-w-2xl rounded-2xl glass-strong px-5 py-3 text-center"
          >
            <span className="mr-2 inline-block h-2 w-2 animate-pulse-glow rounded-full bg-neon-cyan align-middle" />
            <span className="text-sm font-medium text-foreground sm:text-base">{text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
