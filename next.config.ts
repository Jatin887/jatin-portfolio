import type { NextConfig } from "next";

// Empty for root hosts (Vercel/Netlify); set to "/jatin-portfolio" for a
// GitHub Pages project page so routing + assets resolve under the sub-path.
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Static export only at build time (npm run build sets STATIC_EXPORT) so
  // `next dev` keeps working normally. Produces ./out — host anywhere.
  ...(process.env.STATIC_EXPORT === "true" ? { output: "export" } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
  ...(base ? { basePath: base, assetPrefix: base } : {}),
};

export default nextConfig;
