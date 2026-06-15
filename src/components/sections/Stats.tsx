"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { stats, skills } from "@/content/profile";
import { categoryColors, categoryOrder } from "@/lib/categories";
import { SectionHeading } from "@/components/fx/Reveal";
import GlassCard from "@/components/ui/GlassCard";

function CountUp({ value, suffix, prefix }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const formatted = value >= 1000 ? Math.round(display).toLocaleString() : Math.round(display).toString();
  return (
    <span ref={ref} className="font-display text-4xl font-bold text-gradient-neon sm:text-5xl">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function Ring({ label, value, color }: { label: string; value: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: circ - (circ * value) / 100 } : {}}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold" style={{ color }}>
          {value}%
        </div>
      </div>
      <span className="text-center text-[11px] text-muted">{label}</span>
    </div>
  );
}

const COMMIT_BARS = [
  { label: "Backend platform", value: 1612, color: "#38bdf8" },
  { label: "Product UI", value: 611, color: "#5eead4" },
  { label: "Connectors", value: 1000, color: "#34d399" },
  { label: "Schema/contracts", value: 195, color: "#2dd4bf" },
];

function BarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const max = Math.max(...COMMIT_BARS.map((b) => b.value));
  return (
    <div ref={ref} className="flex h-48 items-end justify-around gap-3">
      {COMMIT_BARS.map((b, i) => (
        <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="font-mono text-xs text-muted">{b.value.toLocaleString()}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: `${(b.value / max) * 100}%` } : {}}
            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
            className="w-full rounded-t-md"
            style={{
              background: `linear-gradient(180deg, ${b.color}, ${b.color}33)`,
              boxShadow: `0 0 18px ${b.color}55`,
              minHeight: 6,
            }}
          />
          <span className="text-center text-[10px] leading-tight text-faint">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

const GROWTH = [
  { year: "'23", v: 12 },
  { year: "'24", v: 38 },
  { year: "'25", v: 76 },
  { year: "'26", v: 100 },
];

function LineGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const w = 280;
  const h = 120;
  const pts = GROWTH.map((g, i) => [(i / (GROWTH.length - 1)) * w, h - (g.v / 100) * h]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill="url(#lg)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 6px rgba(56,189,248,0.8))" }}
        />
        {pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="4"
            fill="#22d3ee"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.4 + i * 0.25 }}
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between px-1 font-mono text-[10px] text-faint">
        {GROWTH.map((g) => (
          <span key={g.year}>{g.year}</span>
        ))}
      </div>
    </div>
  );
}

export default function Stats() {
  const categoryAvg = categoryOrder.map((c) => {
    const list = skills.filter((s) => s.category === c);
    const avg = Math.round(list.reduce((a, s) => a + s.proficiency, 0) / list.length);
    return { label: c, value: avg, color: categoryColors[c] };
  });

  return (
    <section id="stats" className="section">
      <SectionHeading
        eyebrow="Impact Dashboard"
        title={<>The numbers behind the <span className="text-gradient-neon">work</span></>}
        subtitle="Verified from commit history, shipped tickets and production outcomes."
      />

      <div className="mx-auto max-w-6xl">
        {/* counters */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <GlassCard holo={false} hover={false} className="h-full text-center">
                <CountUp value={s.value} suffix={s.suffix} prefix={s.prefix} />
                <p className="mt-2 text-sm font-medium text-foreground">{s.label}</p>
                <p className="mt-1 text-xs leading-snug text-faint">{s.detail}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* charts */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <GlassCard holo hover={false} className="lg:col-span-1">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-neon-cyan">Contribution by area</h3>
            <BarChart />
          </GlassCard>

          <GlassCard holo hover={false} className="lg:col-span-1">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-neon-cyan">Growth trajectory</h3>
            <LineGraph />
            <p className="mt-3 text-xs text-faint">Cumulative contribution, intern to senior.</p>
          </GlassCard>

          <GlassCard holo hover={false} className="lg:col-span-1">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-neon-cyan">Mastery by domain</h3>
            <div className="grid grid-cols-3 gap-3">
              {categoryAvg.map((c) => (
                <Ring key={c.label} label={c.label} value={c.value} color={c.color} />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
