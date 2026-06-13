import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://jatinfulwani.dev",
      lastModified: new Date("2026-06-13"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
