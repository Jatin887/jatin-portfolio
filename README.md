# Jatin Fulwani — Portfolio

A premium, futuristic personal portfolio. Dark theme with neon blue/purple accents, a speaking 3D AI avatar hero, an AI assistant, and multiple interactive 3D + animated-data sections.

Built with **Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · React Three Fiber · Three.js · Framer Motion · GSAP**.

Lighthouse (desktop, production build): **Accessibility 100 · Best Practices 100 · SEO 100**, with **LCP ~0.8s** and **CLS 0**.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
# static production build -> ./out (host anywhere)
npm run build
```

The app is a fully static export (`output: 'export'`), so it can be hosted on any static host with no server.

## Deploy

- **Vercel (recommended):** import this repo at [vercel.com/new](https://vercel.com/new) — zero config, auto-redeploys on push. Leave `NEXT_PUBLIC_BASE_PATH` unset (serves at root).
- **GitHub Pages:** the included workflow (`.github/workflows/deploy.yml`) builds with `NEXT_PUBLIC_BASE_PATH=/jatin-portfolio` and publishes `out/` on every push to `main`. Enable Pages → Source: GitHub Actions.
- **Any static host (Netlify/Cloudflare Pages/S3):** upload the `out/` folder.

## What's inside

- **Hero** — a 3D digital-human avatar (Ready Player Me rig) in a neon workspace with idle breathing, natural blinking, occasional gestures, cursor eye-tracking, a cinematic "boot" intro, and a spoken greeting with amplitude-driven lip-sync + live subtitles.
- **AI Assistant ("Jarvis")** — floating panel that answers questions about Jatin (who he is, tech, projects, experience, contact) using local retrieval over the profile data, with optional voice (Web Speech) and deep-links to sections.
- **Skills Galaxy** — skills orbit a glowing core; rotate it and click a node to see proficiency, years, and related projects.
- **Career Timeline**, **Project Showcase** (holographic case-study cards), **Technology Universe** (rotating 3D sphere, hover to inspect), **Impact Dashboard** (animated counters, bar/line charts, progress rings), **Experience**, **How I Work**, and a command-center **Contact** section.
- Fully responsive, `prefers-reduced-motion` aware, lazy-mounted 3D, SEO metadata + JSON-LD.

## Everything is data-driven

All content lives in **`src/content/profile.ts`** (and the assistant's intent map in `src/content/assistant.ts`). Edit those to update copy everywhere — sections and the assistant both read from them.

## Customization points

| What | Where |
| --- | --- |
| All bio / skills / projects / experience copy | `src/content/profile.ts` |
| Assistant answers & intents | `src/content/assistant.ts` |
| 3D avatar (swap for a closer likeness) | replace `public/models/avatar.glb` with your Ready Player Me `.glb` (request `morphTargets=ARKit,Oculus Visemes`); matching animation clips in `public/models/animations.glb` |
| Greeting voice/audio | `public/audio/greeting.m4a` (regenerate: `say -v Rishi -o g.aiff "..." && afconvert g.aiff public/audio/greeting.m4a -f m4af -d aac`) |
| Resume PDF | `public/Jatin-Fulwani-Resume.pdf` |
| Calendar booking link | `BOOKING_URL` in `src/components/sections/Contact.tsx` |
| Contact form delivery | set `NEXT_PUBLIC_WEB3FORMS_KEY` (free key from web3forms.com) to deliver email; otherwise the form opens the visitor's mail client (`mailto:`) |
| Theme tokens / colors | `src/app/globals.css` (`@theme` block) |

## Notes

- The avatar is a stylized Ready Player Me human, not a photo-exact likeness (no headshot/3D scan was available). Swap the GLB anytime for a closer match.
- The scripted hero greeting uses pre-baked audio with amplitude-based lip-sync; live assistant answers use browser Web Speech with procedural mouth motion.
- Audio requires a user gesture (the boot "Enter" button) due to browser autoplay policies.
