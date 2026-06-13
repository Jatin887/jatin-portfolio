"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Only hide the native cursor once the custom one is actually running.
    document.documentElement.classList.add("hide-cursor");

    const glow = glowRef.current!;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      glow.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [role='button'], input, textarea, .cursor-grow");
      ring.style.width = interactive ? "56px" : "30px";
      ring.style.height = interactive ? "56px" : "30px";
      ring.style.borderColor = interactive ? "rgba(168,85,247,0.9)" : "rgba(56,189,248,0.7)";
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("hide-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={glowRef}
        className="absolute -left-[250px] -top-[250px] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        className="absolute -left-[15px] -top-[15px] h-[30px] w-[30px] rounded-full border transition-[width,height,border-color] duration-200"
        style={{ borderColor: "rgba(56,189,248,0.7)", willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="absolute -left-[3px] -top-[3px] h-[6px] w-[6px] rounded-full bg-neon-cyan"
        style={{ boxShadow: "0 0 10px rgba(34,211,238,0.9)", willChange: "transform" }}
      />
    </div>
  );
}
