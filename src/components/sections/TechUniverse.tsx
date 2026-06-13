"use client";

import dynamic from "next/dynamic";
import { useInView } from "@/hooks/useInView";
import { SectionHeading } from "@/components/fx/Reveal";
import { skills } from "@/content/profile";

const TechSphereCanvas = dynamic(() => import("./TechSphereCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin-slow rounded-full border-2 border-neon-cyan/30 border-t-neon-cyan" />
    </div>
  ),
});

export default function TechUniverse() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" });

  return (
    <section id="tech" className="section">
      <SectionHeading
        eyebrow="Technology Universe"
        title={<>The full <span className="text-gradient-neon">stack</span>, in orbit</>}
        subtitle="A living sphere of everything Jatin builds with. Hover any technology to see proficiency and years of hands-on experience."
      />

      <div ref={ref} className="relative mx-auto h-[460px] max-w-4xl sm:h-[560px]">
        {inView && <TechSphereCanvas />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <p className="rounded-full bg-base/60 px-4 py-1.5 text-xs text-faint backdrop-blur">
            {skills.length} technologies · drag to rotate · hover to inspect
          </p>
        </div>
      </div>
    </section>
  );
}
