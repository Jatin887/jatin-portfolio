"use client";

import { person, socials, nav } from "@/content/profile";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="relative border-t border-white/8 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg holo-border font-display text-sm font-bold text-neon-cyan">
              JF
            </span>
            <span className="font-display text-lg font-semibold text-foreground">{person.name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">{person.title} · {person.location}</p>
          <p className="mt-1 text-xs text-faint">Open to senior & staff engineering roles.</p>
        </div>

        <nav className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
          {nav.slice(1).map((n) => (
            <button
              key={n.id}
              onClick={() => document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth" })}
              className="text-left text-muted transition hover:text-neon-cyan"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-10 items-center rounded-full glass px-4 text-xs text-muted transition hover:text-neon-cyan"
              >
                {s.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full glass px-3 py-1.5 text-xs text-muted transition hover:text-neon-cyan"
          >
            ↑ Back to top
          </button>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/8 pt-6 text-center text-xs text-faint">
        <p>© {year} {person.name}. Built with Next.js, React Three Fiber, GSAP & Framer Motion.</p>
      </div>
    </footer>
  );
}
