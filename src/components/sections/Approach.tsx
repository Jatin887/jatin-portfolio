"use client";

import { motion } from "framer-motion";
import { principles } from "@/content/profile";
import { SectionHeading } from "@/components/fx/Reveal";

const icons: Record<string, React.ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6 6 2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
    </>
  ),
};

export default function Approach() {
  return (
    <section id="approach" className="section">
      <SectionHeading
        eyebrow="How I Work"
        title={<>Principles that <span className="text-gradient-neon">ship reliably</span></>}
        subtitle="The habits behind the outcomes. Each one is backed by a real mechanism and a measurable result, not a slogan."
      />

      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className={`group rounded-2xl holo-border holo-border-hover p-6 ${
                i === principles.length - 1 && principles.length % 2 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 ring-1 ring-white/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#approachGrad)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {icons[p.icon]}
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.mechanism}</p>
                  <p className="mt-3 flex items-start gap-2 text-sm font-medium text-neon-cyan">
                    <span className="mt-0.5">▸</span>
                    {p.outcome}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="approachGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
}
