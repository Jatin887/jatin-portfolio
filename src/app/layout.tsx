import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { person } from "@/content/profile";
import CursorGlow from "@/components/fx/CursorGlow";
import Backdrop from "@/components/fx/Backdrop";
import Nav from "@/components/Nav";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://jatinfulwani.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${person.name} — ${person.title}`,
    template: `%s — ${person.name}`,
  },
  description: person.summary,
  keywords: [
    "Jatin Fulwani",
    "Software Engineer",
    "Identity Governance",
    "Platform Engineering",
    "Kubernetes",
    "Go",
    "Full Stack Developer",
    "Cloud",
    "AI",
  ],
  authors: [{ name: person.name, url: person.github }],
  creator: person.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${person.name} — ${person.title}`,
    description: person.tagline,
    siteName: `${person.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — ${person.title}`,
    description: person.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.title,
  email: person.email,
  url: siteUrl,
  sameAs: [person.github, person.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  knowsAbout: [
    "Identity Governance",
    "Kubernetes",
    "Go",
    "Cloud Infrastructure",
    "GraphQL",
    "AI Agents",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-neon-blue focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <Backdrop />
        <CursorGlow />
        <Nav />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
