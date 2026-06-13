"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Reveal({
  children,
  index = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <Reveal>
        <p className="eyebrow mb-4">{eyebrow}</p>
      </Reveal>
      <Reveal index={1}>
        <h2 className="font-display text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal index={2}>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
