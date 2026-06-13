"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nav, person } from "@/content/profile";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2 transition-all duration-300 sm:px-6",
            scrolled ? "glass-strong mx-3 shadow-glow-blue sm:mx-auto" : "bg-transparent"
          )}
        >
          <button onClick={() => go("hero")} className="group flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg holo-border font-display text-sm font-bold text-neon-cyan">
              JF
              <span className="absolute inset-0 rounded-lg bg-neon-cyan/10 blur-sm transition group-hover:bg-neon-cyan/20" />
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-wide text-foreground sm:block xl:hidden 2xl:block">
              {person.name}
            </span>
          </button>

          <div className="hidden items-center gap-0.5 xl:flex">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active === n.id ? "text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/8 ring-1 ring-neon-blue/40"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{n.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go("contact")}
              className="hidden rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-1.5 text-sm font-semibold text-white shadow-glow-purple transition hover:opacity-90 sm:inline-block"
            >
              Let&apos;s talk
            </button>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full glass xl:hidden"
            >
              <div className="flex flex-col gap-1">
                <span className={cn("h-0.5 w-4 bg-foreground transition", open && "translate-y-1.5 rotate-45")} />
                <span className={cn("h-0.5 w-4 bg-foreground transition", open && "opacity-0")} />
                <span className={cn("h-0.5 w-4 bg-foreground transition", open && "-translate-y-1.5 -rotate-45")} />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            <div className="absolute inset-0 bg-base/80 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute inset-x-4 top-20 grid grid-cols-2 gap-2 rounded-2xl glass-strong p-4"
            >
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-left text-sm font-medium transition",
                    active === n.id ? "bg-white/10 text-neon-cyan" : "text-muted hover:bg-white/5"
                  )}
                >
                  {n.label}
                </button>
              ))}
              <button
                onClick={() => go("contact")}
                className="col-span-2 mt-1 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Get in touch
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
