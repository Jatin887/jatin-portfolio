"use client";

import { motion } from "framer-motion";
import { person } from "@/content/profile";
import { SectionHeading } from "@/components/fx/Reveal";

const channels = [
  {
    label: "GitHub",
    handle: "@Jatin887",
    href: person.github,
    color: "#e7edf7",
    icon: (
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    ),
  },
  {
    label: "LinkedIn",
    handle: "Jatin Fulwani",
    href: person.linkedin,
    color: "#38bdf8",
    icon: (
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34v-7.2H6.06v7.2h2.28ZM7.2 10.1a1.32 1.32 0 1 0 0-2.64 1.32 1.32 0 0 0 0 2.64Zm11.14 8.24v-4.13c0-2.2-1.18-3.23-2.75-3.23-1.27 0-1.83.7-2.15 1.19v-1.03h-2.28c.03.64 0 7.2 0 7.2h2.28v-4.02c0-.2.01-.41.07-.55.17-.41.54-.84 1.18-.84.83 0 1.17.63 1.17 1.56v3.85h2.28Z" />
    ),
  },
  {
    label: "Email",
    handle: person.email,
    href: `mailto:${person.email}`,
    color: "#2dd4bf",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section">
      <SectionHeading
        eyebrow="Command Center"
        title={<>Let&apos;s build something <span className="text-gradient-neon">great</span></>}
        subtitle="Open to senior and staff engineering roles. The fastest ways to reach me are below."
      />

      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl holo-border p-8 sm:p-10">
          {/* radar backdrop */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 opacity-20">
            <div className="absolute inset-0 rounded-full border border-neon-blue/40" />
            <div className="absolute inset-8 rounded-full border border-neon-blue/30" />
            <div className="absolute inset-16 rounded-full border border-neon-blue/20" />
            <div
              className="absolute inset-0 origin-center animate-spin-slow"
              style={{ background: "conic-gradient(from 0deg, transparent 70%, rgba(56,189,248,0.4))", borderRadius: "9999px" }}
            />
          </div>

          <div className="relative">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-neon-green" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted">channel open</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {channels.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group flex flex-col items-center gap-3 rounded-2xl bg-white/5 p-6 text-center transition hover:bg-white/10"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                    style={{ background: `${c.color}1a`, boxShadow: `0 0 22px ${c.color}33` }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill={c.label === "Email" ? "none" : c.color} stroke={c.label === "Email" ? c.color : "none"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {c.icon}
                    </svg>
                  </span>
                  <span className="font-display text-lg font-semibold text-foreground">{c.label}</span>
                  <span className="break-all text-xs text-muted">{c.handle}</span>
                </motion.a>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-faint">
              {person.location} · open to remote · usually replies within a day
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
