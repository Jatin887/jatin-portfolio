import type { NextConfig } from "next";

// Empty for root hosts (Vercel/Netlify); set to "/jatin-portfolio" for a
// GitHub Pages project page so routing + assets resolve under the sub-path.
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export", // fully static site: host anywhere, no server needed
  images: { unoptimized: true },
  trailingSlash: true,
  ...(base ? { basePath: base, assetPrefix: base } : {}),
};

export default nextConfig;
