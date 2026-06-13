// Local retrieval engine for the floating AI assistant.
// No API key: keyword/intent matching over the verified profile data.
// Each answer maps to a pre-baked voice clip in /audio/assistant/<id>.mp3.

import speech from "./assistant-speech.json";

export interface AssistantReply {
  text: string;
  /** id of the pre-baked voice clip + intent. */
  id?: string;
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
  id: keyof typeof speech;
  keywords: string[];
  scrollTo?: string;
  suggestions?: string[];
};

const intents: Intent[] = [
  { id: "who", keywords: ["who", "about", "yourself", "introduce", "tell me about", "bio", "background", "summary"], scrollTo: "hero", suggestions: ["What technologies?", "Show his projects", "Contact him"] },
  { id: "tech", keywords: ["tech", "technolog", "stack", "languages", "tools", "skills", "framework", "what does he use", "work with"], scrollTo: "tech", suggestions: ["Show the skills galaxy", "His projects", "His experience"] },
  { id: "projects", keywords: ["project", "work", "built", "case study", "portfolio", "show me", "what has he made", "ship"], scrollTo: "projects", suggestions: ["The identity platform", "The CI/CD platform", "His impact numbers"] },
  { id: "experience", keywords: ["experience", "career", "job", "role", "company", "balkanid", "history", "worked", "journey", "timeline"], scrollTo: "timeline", suggestions: ["His current role", "His projects", "His impact"] },
  { id: "contact", keywords: ["contact", "reach", "email", "hire", "connect", "linkedin", "github", "talk", "message", "get in touch", "available"], scrollTo: "contact", suggestions: ["His projects", "What technologies?", "His experience"] },
  { id: "impact", keywords: ["impact", "metric", "number", "achievement", "stat", "result", "outcome", "scale"], scrollTo: "stats", suggestions: ["Show his projects", "His experience", "How does he work?"] },
  { id: "identity", keywords: ["identity", "governance", "iam", "provision", "connector", "extractor", "okta", "active directory", "sso", "federation"], scrollTo: "projects", suggestions: ["The provisioners", "His tech stack", "Contact him"] },
  { id: "cloud", keywords: ["cloud", "kubernetes", "k8s", "aws", "eks", "argo", "devops", "ci/cd", "cicd", "infrastructure", "platform", "terraform"], scrollTo: "projects", suggestions: ["The data platform", "His impact", "How does he work?"] },
  { id: "ai", keywords: ["ai", "artificial intelligence", "agent", "mcp", "llm", "machine learning", "bug analysis", "automation"], scrollTo: "projects", suggestions: ["His other projects", "His tech stack", "Contact him"] },
  { id: "approach", keywords: ["how do you work", "how does he work", "approach", "philosophy", "principle", "method", "process", "reliable", "quality"], scrollTo: "approach", suggestions: ["His projects", "His impact", "Contact him"] },
  { id: "education", keywords: ["education", "study", "degree", "college", "university", "school", "certification", "certificate", "qualified"], scrollTo: "experience", suggestions: ["His experience", "His projects", "Contact him"] },
];

const greetingReply: AssistantReply = {
  text: `Hey! I'm Jatin's portfolio assistant. Ask me who Jatin is, what he works with, to show his projects or experience, or how to reach him.`,
  suggestions: quickActions.map((q) => q.label),
};

function fromIntent(intent: Intent): AssistantReply {
  return {
    id: intent.id,
    text: speech[intent.id],
    scrollTo: intent.scrollTo,
    suggestions: intent.suggestions,
  };
}

const fallbackReply = (): AssistantReply => ({
  id: "fallback",
  text: speech.fallback,
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
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }

  if (best) return fromIntent(best.intent);
  return fallbackReply();
}
