"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/content/profile";
import { SectionHeading } from "@/components/fx/Reveal";

function TiltCard({ project, onOpen, index }: { project: Project; onOpen: () => void; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(6px)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onOpen}
        className="group relative h-full cursor-pointer overflow-hidden rounded-2xl holo-border p-6 transition-transform duration-200 will-change-transform"
      >
        {/* glare */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(380px circle at var(--mx,50%) var(--my,50%), ${project.accent}22, transparent 60%)`,
          }}
        />
        <div className="relative">
          <div className="mb-4 flex items-start justify-between">
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{ background: `${project.accent}1a`, color: project.accent }}
            >
              {project.category}
            </span>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-transform group-hover:rotate-45"
              style={{ borderColor: `${project.accent}55`, color: project.accent }}
            >
              ↗
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-foreground">{project.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.tagline}</p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-lg bg-white/5 px-2 py-2 text-center">
                <p className="font-display text-sm font-bold" style={{ color: project.accent }}>
                  {m.value}
                </p>
                <p className="text-[10px] text-faint">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-muted">
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-faint">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          <p className="mt-5 text-xs font-medium" style={{ color: project.accent }}>
            Read case study →
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const sections: { label: string; body: string }[] = [
    { label: "Problem", body: project.problem },
    { label: "Solution", body: project.solution },
    { label: "Architecture", body: project.architecture },
    { label: "Impact", body: project.impact },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-base/85 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl glass-strong p-7"
        style={{ borderTop: `2px solid ${project.accent}` }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full glass text-muted transition hover:text-foreground"
        >
          ✕
        </button>

        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{ background: `${project.accent}1a`, color: project.accent }}
        >
          {project.category}
        </span>
        <h3 className="mt-3 font-display text-3xl font-bold text-gradient">{project.name}</h3>
        <p className="mt-2 text-muted">{project.tagline}</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-white/5 p-3 text-center">
              <p className="font-display text-lg font-bold" style={{ color: project.accent }}>
                {m.value}
              </p>
              <p className="text-[11px] text-faint">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-5">
          {sections.map((s) => (
            <div key={s.label}>
              <h4 className="mb-1.5 font-mono text-xs uppercase tracking-wider" style={{ color: project.accent }}>
                {s.label}
              </h4>
              <p className="text-sm leading-relaxed text-foreground/85">{s.body}</p>
            </div>
          ))}

          <div>
            <h4 className="mb-2 font-mono text-xs uppercase tracking-wider" style={{ color: project.accent }}>
              Highlights
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-foreground/85">
                  <span style={{ color: project.accent }}>▹</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-mono text-xs uppercase tracking-wider" style={{ color: project.accent }}>
              Tech stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-foreground/80">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/10"
          >
            View on GitHub ↗
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="section">
      <SectionHeading
        eyebrow="Project Showcase"
        title={<>Work that <span className="text-gradient-neon">shipped</span></>}
        subtitle="Holographic case studies. Each one is a real system in production, framed as problem, solution, architecture and measurable impact."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <TiltCard key={p.id} project={p} index={i} onOpen={() => setActive(p)} />
        ))}
      </div>

      <AnimatePresence>
        {active && <CaseStudyModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
