export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

// Prefix for static hosting under a sub-path (e.g. GitHub Pages project page).
// Set NEXT_PUBLIC_BASE_PATH at build time; empty for root hosts like Vercel.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => `${BASE_PATH}${p}`;

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Deterministic pseudo-random in [0,1) from an integer seed (avoids Math.random for SSR stability). */
export function seeded(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Distribute N points on a sphere surface (Fibonacci sphere). */
export function fibonacciSphere(samples: number, radius = 1): [number, number, number][] {
  const points: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}
