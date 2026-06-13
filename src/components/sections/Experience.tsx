"use client";

import { motion } from "framer-motion";
import { experience, certifications, education } from "@/content/profile";
import { SectionHeading } from "@/components/fx/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <SectionHeading
        eyebrow="Experience"
        title={<>Where it all <span className="text-gradient-neon">happened</span></>}
        subtitle="Roles, achievements and the stack behind each. Hover to surface the detail."
      />

      <div className="mx-auto max-w-4xl space-y-5">
        {experience.map((exp, i) => (
          <motion.article
            key={exp.id}
            initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl holo-border holo-border-hover p-6"
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">{exp.role}</h3>
                <p className="text-neon-purple">{exp.company}</p>
              </div>
              <div className="text-sm text-muted sm:text-right">
                <p className="font-mono text-neon-cyan">{exp.period}</p>
                <p className="text-xs text-faint">{exp.location}</p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted">{exp.summary}</p>

            <ul className="mt-4 space-y-2">
              {exp.achievements.map((a) => (
                <li key={a} className="flex gap-2.5 text-sm text-foreground/85">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" style={{ boxShadow: "0 0 6px #22d3ee" }} />
                  {a}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {exp.tech.map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-muted">
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Education + certs */}
      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl glass p-6"
        >
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-neon-cyan">Education</h3>
          <p className="font-display text-lg font-semibold text-foreground">{education.school}</p>
          <p className="text-sm text-muted">{education.degree}</p>
          <p className="mt-1 text-sm text-faint">
            {education.period} · {education.detail}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl glass p-6"
        >
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-neon-cyan">Certifications</h3>
          <ul className="space-y-2">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{c.name}</span>
                <span className="text-faint">{c.issuer} · {c.year}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
