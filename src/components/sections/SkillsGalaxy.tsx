"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skills, projects, experience, type Skill } from "@/content/profile";
import { categoryColors, categoryOrder } from "@/lib/categories";
import { useInView } from "@/hooks/useInView";
import { SectionHeading } from "@/components/fx/Reveal";

const GalaxyCanvas = dynamic(() => import("./GalaxyCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin-slow rounded-full border-2 border-neon-purple/30 border-t-neon-purple" />
    </div>
  ),
});

export default function SkillsGalaxy() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" });
  const [selected, setSelected] = useState<Skill | null>(null);

  const relatedProjects = selected
    ? projects.filter((p) => selected.projects.includes(p.id))
    : [];
  const relatedExp = selected
    ? experience.filter((e) => selected.experience.includes(e.id))
    : [];

  return (
    <section id="skills" className="section">
      <SectionHeading
        eyebrow="Skills Galaxy"
        title={<>An orbit of <span className="text-gradient-neon">capabilities</span></>}
        subtitle="Rotate the galaxy and tap any skill to see where it shows up in Jatin's work. Node size maps to proficiency."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div ref={ref} className="relative h-[440px] overflow-hidden rounded-3xl holo-border sm:h-[520px]">
            {inView && <GalaxyCanvas onSelect={setSelected} selected={selected} />}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
            {categoryOrder.map((c) => (
              <span key={c} className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: categoryColors[c] }} />
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="rounded-3xl glass p-6">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: categoryColors[selected.category] }} />
                  <span className="text-xs uppercase tracking-wider text-muted">{selected.category}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">{selected.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{selected.blurb}</p>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Proficiency</span>
                      <span style={{ color: categoryColors[selected.category] }}>{selected.proficiency}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.proficiency}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${categoryColors[selected.category]}, #fff)` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <span className="font-mono text-neon-cyan">{selected.years}+</span> years of hands-on use
                  </div>
                </div>

                {relatedProjects.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs uppercase tracking-wider text-faint">Used in projects</p>
                    <div className="flex flex-wrap gap-2">
                      {relatedProjects.map((p) => (
                        <a
                          key={p.id}
                          href="#projects"
                          className="rounded-full border border-neon-blue/30 bg-neon-blue/5 px-3 py-1 text-xs text-neon-cyan transition hover:bg-neon-blue/15"
                        >
                          {p.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {relatedExp.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs uppercase tracking-wider text-faint">Applied at</p>
                    <div className="space-y-1">
                      {relatedExp.map((e) => (
                        <p key={e.id} className="text-sm text-foreground/80">
                          {e.role} <span className="text-faint">· {e.company}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"
              >
                <div className="mb-4 h-14 w-14 animate-pulse-glow rounded-full bg-gradient-to-br from-neon-blue to-neon-purple" />
                <p className="font-display text-lg text-foreground">Explore the galaxy</p>
                <p className="mt-2 max-w-xs text-sm text-muted">
                  Click any glowing node to reveal proficiency, years of experience, and the projects it powers.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2 text-left">
                  {skills.slice(0, 6).map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelected(s)}
                      className="rounded-lg glass px-3 py-1.5 text-xs text-muted transition hover:text-neon-cyan"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
