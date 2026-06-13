"use client";

import { motion } from "framer-motion";
import { experience } from "@/content/profile";
import { SectionHeading } from "@/components/fx/Reveal";

// Ascending journey: intern -> senior.
const journey = [...experience].reverse();

export default function Timeline() {
  return (
    <section id="timeline" className="section">
      <SectionHeading
        eyebrow="Career Timeline"
        title={<>The <span className="text-gradient-neon">journey</span> so far</>}
        subtitle="From founding intern to senior engineer and team lead — each milestone compounding on the last."
      />

      <div className="relative mx-auto max-w-4xl" style={{ perspective: "1200px" }}>
        {/* central glowing spine */}
        <div className="absolute left-4 top-0 h-full w-px sm:left-1/2 sm:-translate-x-1/2">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-neon-blue/40 to-transparent" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute inset-0 origin-top bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent"
            style={{ boxShadow: "0 0 12px rgba(56,189,248,0.6)" }}
          />
        </div>

        <div className="space-y-10">
          {journey.map((item, i) => {
            const left = i % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40, rotateX: 12 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex ${left ? "sm:justify-start" : "sm:justify-end"}`}
              >
                {/* node */}
                <div className="absolute left-4 top-6 z-10 -translate-x-1/2 sm:left-1/2">
                  <span className="block h-4 w-4 rounded-full bg-neon-cyan ring-4 ring-neon-cyan/20" style={{ boxShadow: "0 0 14px rgba(34,211,238,0.9)" }} />
                </div>

                <div className={`ml-12 w-full sm:ml-0 sm:w-[46%] ${left ? "" : "sm:text-right"}`}>
                  <div className="rounded-2xl holo-border holo-border-hover p-5">
                    <span className="font-mono text-xs text-neon-cyan">{item.period}</span>
                    <h3 className="mt-1 font-display text-lg font-bold text-foreground">{item.role}</h3>
                    <p className="text-sm text-neon-purple">{item.company}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>
                    <div className={`mt-3 flex flex-wrap gap-1.5 ${left ? "" : "sm:justify-end"}`}>
                      {item.tech.slice(0, 5).map((t) => (
                        <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
