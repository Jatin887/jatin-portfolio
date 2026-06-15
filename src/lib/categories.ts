import type { SkillCategory } from "@/content/profile";

export const categoryColors: Record<SkillCategory, string> = {
  Languages: "#38bdf8",
  "Cloud & DevOps": "#2dd4bf",
  "Backend & Data": "#22d3ee",
  Frontend: "#5eead4",
  "Identity & Security": "#34d399",
  "AI & Tooling": "#fbbf24",
};

export const categoryOrder: SkillCategory[] = [
  "Languages",
  "Cloud & DevOps",
  "Backend & Data",
  "Identity & Security",
  "Frontend",
  "AI & Tooling",
];
