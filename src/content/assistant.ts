// Local retrieval engine for the floating AI assistant.
// No API key: keyword/intent matching over the verified profile data.

import {
  person,
  skills,
  projects,
  experience,
  stats,
  certifications,
  education,
} from "./profile";

export interface AssistantReply {
  text: string;
  /** Optional section id to scroll the page to. */
  scrollTo?: string;
  /** Suggested follow-up chips. */
  suggestions?: string[];
}

export interface QuickAction {
  label: string;
  query: string;
}

export const quickActions: QuickAction[] = [
  { label: "Who is Jatin?", query: "who is jatin" },
  { label: "Tech stack", query: "what technologies does he work with" },
  { label: "Projects", query: "show his projects" },
  { label: "Experience", query: "show his experience" },
  { label: "Contact", query: "how can i contact him" },
];

type Intent = {
  id: string;
  keywords: string[];
  weight?: number;
  answer: () => AssistantReply;
};

const topSkills = (cat?: string) =>
  skills
    .filter((s) => (cat ? s.category === cat : true))
    .sort((a, b) => b.proficiency - a.proficiency);

const intents: Intent[] = [
  {
    id: "who",
    keywords: ["who", "about", "yourself", "introduce", "tell me about", "bio", "background", "summary"],
    answer: () => ({
      text: `${person.name} is a ${person.title} and engineering team lead based in ${person.location}. ${person.summary}`,
      scrollTo: "hero",
      suggestions: ["What technologies?", "Show his projects", "Contact him"],
    }),
  },
  {
    id: "tech",
    keywords: ["tech", "technolog", "stack", "languages", "tools", "skills", "framework", "what does he use", "work with"],
    answer: () => {
      const langs = topSkills("Languages").map((s) => s.name).join(", ");
      const cloud = topSkills("Cloud & DevOps").slice(0, 5).map((s) => s.name).join(", ");
      const data = topSkills("Backend & Data").slice(0, 4).map((s) => s.name).join(", ");
      return {
        text: `Jatin works primarily in ${langs}. On the platform side: ${cloud}. For backend and data: ${data}. He also builds React and Next.js front-ends and internal AI agents with the Model Context Protocol. Explore the rotating Tech Universe for proficiency and years on each.`,
        scrollTo: "tech",
        suggestions: ["Show the skills galaxy", "His projects", "His experience"],
      };
    },
  },
  {
    id: "projects",
    keywords: ["project", "work", "built", "case study", "portfolio", "show me", "what has he made", "ship"],
    answer: () => ({
      text: `Jatin's flagship work: ${projects
        .map((p) => p.name)
        .join("; ")}. Highlights include a 38-source identity integration platform, the CI/CD and workflow orchestration platform behind 23 services, an analytics migration to DuckDB on S3, and an internal AI bug-analysis agent that cut debugging time 60 percent. Scrolling you to the project showcase.`,
      scrollTo: "projects",
      suggestions: ["The identity platform", "The CI/CD platform", "His impact numbers"],
    }),
  },
  {
    id: "experience",
    keywords: ["experience", "career", "job", "role", "company", "balkanid", "history", "worked", "journey", "timeline"],
    answer: () => ({
      text: `Jatin has spent three-plus years at BalkanID, growing from Engineering Intern to ${experience[0].role}. ${experience[0].achievements[0]} Before that he shipped Android apps with 100K-plus downloads at AppyHigh and contributed to open source. See the 3D career timeline and experience section for the full path.`,
      scrollTo: "timeline",
      suggestions: ["His current role", "His projects", "His impact"],
    }),
  },
  {
    id: "contact",
    keywords: ["contact", "reach", "email", "hire", "connect", "linkedin", "github", "talk", "message", "get in touch", "available"],
    answer: () => ({
      text: `You can reach Jatin at ${person.email}, on GitHub (${person.githubHandle}) or on LinkedIn. There is a contact console and a resume download at the bottom of the page. Taking you there now.`,
      scrollTo: "contact",
      suggestions: ["Download resume", "His projects", "What technologies?"],
    }),
  },
  {
    id: "impact",
    keywords: ["impact", "metric", "number", "achievement", "stat", "result", "outcome", "scale"],
    answer: () => ({
      text: `By the numbers: ${stats
        .slice(0, 5)
        .map((s) => `${s.value}${s.suffix} ${s.label.toLowerCase()}`)
        .join(", ")}. He raised pod density from 58 to 110 per node and cut p95 latency 60 percent. Scrolling to the impact dashboard.`,
      scrollTo: "stats",
      suggestions: ["Show his projects", "His experience", "How does he work?"],
    }),
  },
  {
    id: "identity",
    keywords: ["identity", "governance", "iam", "provision", "connector", "extractor", "okta", "active directory", "sso", "federation"],
    answer: () => {
      const p = projects.find((x) => x.id === "identity-platform")!;
      return {
        text: `${p.name}: ${p.solution} ${p.highlights[0]}`,
        scrollTo: "projects",
        suggestions: ["The provisioners", "His tech stack", "Contact him"],
      };
    },
  },
  {
    id: "cloud",
    keywords: ["cloud", "kubernetes", "k8s", "aws", "eks", "argo", "devops", "ci/cd", "cicd", "infrastructure", "platform", "terraform"],
    answer: () => {
      const p = projects.find((x) => x.id === "cicd-argo")!;
      return {
        text: `${p.name}: ${p.solution} ${p.impact}`,
        scrollTo: "projects",
        suggestions: ["The data platform", "His impact", "How does he work?"],
      };
    },
  },
  {
    id: "ai",
    keywords: ["ai", "artificial intelligence", "agent", "mcp", "llm", "machine learning", "bug analysis", "automation"],
    answer: () => {
      const p = projects.find((x) => x.id === "ai-mcp")!;
      return {
        text: `${p.name}: ${p.solution} ${p.impact}`,
        scrollTo: "projects",
        suggestions: ["His other projects", "His tech stack", "Contact him"],
      };
    },
  },
  {
    id: "approach",
    keywords: ["how do you work", "how does he work", "approach", "philosophy", "principle", "method", "process", "reliable", "quality"],
    answer: () => ({
      text: `Jatin's engineering approach: root-cause over band-aid, reuse-first and pattern-consistent, production-grade by default, verify don't assume, and AI-augmented engineering. Each is backed by a real outcome, like turning 277 throttling failures into 19 with token-bucket rate limiting. Scrolling to How I Work.`,
      scrollTo: "approach",
      suggestions: ["His projects", "His impact", "Contact him"],
    }),
  },
  {
    id: "education",
    keywords: ["education", "study", "degree", "college", "university", "school", "certification", "certificate", "qualified"],
    answer: () => ({
      text: `Jatin holds a ${education.degree} from ${education.school} (${education.period}, ${education.detail}). Certifications: ${certifications
        .map((c) => `${c.name} (${c.issuer})`)
        .join(", ")}.`,
      scrollTo: "experience",
      suggestions: ["His experience", "His projects", "Contact him"],
    }),
  },
];

const greetingReply: AssistantReply = {
  text: `Hi, I'm Jatin's portfolio assistant. Ask me who Jatin is, what technologies he works with, to show his projects or experience, or how to reach him.`,
  suggestions: quickActions.map((q) => q.label),
};

const fallbackReply = (): AssistantReply => ({
  text: `I can answer questions about Jatin's background, technologies, projects, experience, impact and how to contact him. Try one of these:`,
  suggestions: quickActions.map((q) => q.label),
});

export function ask(rawQuery: string): AssistantReply {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return greetingReply;
  if (/^(hi|hey|hello|yo|sup|greetings)\b/.test(q)) return greetingReply;

  let best: { intent: Intent; score: number } | null = null;
  for (const intent of intents) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (q.includes(kw)) score += kw.length > 4 ? 2 : 1;
    }
    score *= intent.weight ?? 1;
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }

  if (best) return best.intent.answer();
  return fallbackReply();
}
