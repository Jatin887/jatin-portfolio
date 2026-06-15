"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMedia";

/** Animated global backdrop: drifting grid, glow orbs and a light particle field. */
export default function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const count = Math.min(70, Math.floor((w * h) / 26000));
    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
      hue: Math.random() > 0.5 ? 199 : 270,
      a: Math.random() * 0.5 + 0.2,
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base" />
      <div className="absolute inset-0 grid-bg grid-bg-animated" />
      <div
        className="glow-orb animate-pulse-glow"
        style={{ top: "-10%", left: "5%", width: 420, height: 420, background: "#1d4ed8" }}
      />
      <div
        className="glow-orb animate-pulse-glow"
        style={{ top: "30%", right: "-5%", width: 480, height: 480, background: "#0d9488", animationDelay: "1.5s" }}
      />
      <div
        className="glow-orb animate-pulse-glow"
        style={{ bottom: "-10%", left: "30%", width: 520, height: 520, background: "#0e7490", animationDelay: "3s" }}
      />
      {!reduced && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(45,212,191,0.10), transparent 60%)",
        }}
      />
    </div>
  );
}
