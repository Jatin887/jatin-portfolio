// Single source of truth for the entire portfolio.
// Every section and the AI assistant read from this module.
// Copy follows public-safe rules: industry-universal phrasing, outcome-led,
// no internal ticket IDs / file paths / LOC counts / internal codenames.

import { asset } from "@/lib/utils";

export type SkillCategory =
  | "Languages"
  | "Cloud & DevOps"
  | "Backend & Data"
  | "Frontend"
  | "Identity & Security"
  | "AI & Tooling";

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  years: number;
  blurb: string;
  projects: string[]; // project ids
  experience: string[]; // experience ids
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  tech: string[];
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: string;
  problem: string;
  solution: string;
  architecture: string;
  impact: string;
  tech: string[];
  highlights: string[];
  metrics: ProjectMetric[];
  github?: string;
  liveUrl?: string;
  accent: string; // hex
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  detail: string;
}

export interface Principle {
  title: string;
  mechanism: string;
  outcome: string;
  icon: string;
}

export const person = {
  name: "Jatin Fulwani",
  firstName: "Jatin",
  title: "Senior Software Engineer",
  titles: [
    "Senior Software Engineer",
    "Platform & Infrastructure Engineer",
    "Identity Governance Specialist",
    "Full-Stack Systems Builder",
  ],
  tagline:
    "I build reliable, multi-tenant platforms end to end — from cloud infrastructure and CI/CD to identity data pipelines and the product UI on top.",
  location: "Bengaluru, India",
  email: "jatinfulwani8875@gmail.com",
  github: "https://github.com/Jatin887",
  githubHandle: "Jatin887",
  linkedin: "https://linkedin.com/in/jatin-fulwani-b5a3661ba",
  avatar: asset("/models/avatar.glb"),
  animations: asset("/models/animations.glb"),
  greetingAudio: asset("/audio/greeting.mp3"),
  greetingText:
    "Hey! I'm Jatin, and I'm so glad you're here! I'm a software engineer who loves turning wild ideas into things that actually work. Think of this little robot as my sidekick, here to show you around. So go on, explore, click around, ask my assistant anything, and let's build something awesome together!",
  summary:
    "Senior Software Engineer and engineering team lead with three-plus years building a multi-tenant identity governance platform end to end. I own the CI/CD platform and async workflow orchestration across 23 services on Kubernetes, designed a 38-source identity ingestion platform on tenant-isolated PostgreSQL, and lead production incident response. I ship across the full stack: schema, Go and GraphQL backend, and React frontend in the same cycle.",
  specialties: [
    "Identity Governance",
    "Full-Stack Development",
    "Cloud & Platform Engineering",
    "AI-Powered Applications",
  ],
} as const;

export const stats: Stat[] = [
  { label: "Years Building Production Systems", value: 3, suffix: "+", detail: "Intern to Senior Engineer and team lead, May 2023 to today." },
  { label: "Source Integrations Operated", value: 38, suffix: "", detail: "Identity, HRIS, SaaS and VCS connectors. 12 built from scratch." },
  { label: "Services on Kubernetes", value: 23, suffix: "", detail: "Helm-deployed mesh delivered via GitOps to multiple clusters." },
  { label: "Production Hotfixes Led", value: 34, suffix: "", detail: "Primary incident-response and root-cause point person since early 2025." },
  { label: "Commits Authored", value: 3400, suffix: "+", detail: "Across 50 repositories and 200-plus shipped tickets." },
  { label: "Identities Processed Daily", value: 50, suffix: "K+", detail: "Across the integration fleet, tenant-isolated and access-governed." },
];

export const skills: Skill[] = [
  // Languages
  { name: "Go", category: "Languages", proficiency: 95, years: 3, blurb: "Primary language. Microservices, source connectors, worker-pool patterns, internal CLIs.", projects: ["identity-platform", "cicd-argo", "graphql-perf", "provisioners", "ai-mcp"], experience: ["balkanid-senior", "balkanid-swe", "balkanid-intern"] },
  { name: "TypeScript", category: "Languages", proficiency: 85, years: 2, blurb: "React product UI and the dashboard for internal AI tooling.", projects: ["ai-mcp"], experience: ["balkanid-swe", "balkanid-senior"] },
  { name: "Python", category: "Languages", proficiency: 75, years: 3, blurb: "Role-mining tooling, lifecycle scripts, automation.", projects: ["identity-platform"], experience: ["balkanid-swe"] },
  { name: "SQL", category: "Languages", proficiency: 88, years: 3, blurb: "Postgres-heavy: partial indexes, materialized views, JSONB, analytics transforms.", projects: ["graphql-perf", "data-platform", "identity-platform"], experience: ["balkanid-swe", "balkanid-senior"] },

  // Cloud & DevOps
  { name: "Kubernetes", category: "Cloud & DevOps", proficiency: 92, years: 3, blurb: "Daily operations, multi-cluster debugging, pod lifecycle and resource tuning.", projects: ["cicd-argo"], experience: ["balkanid-senior"] },
  { name: "AWS / EKS", category: "Cloud & DevOps", proficiency: 88, years: 3, blurb: "EKS tuning, IAM/IRSA, S3 data lake, Glue, SNS, networking and pod-density work.", projects: ["cicd-argo", "data-platform"], experience: ["balkanid-senior", "balkanid-swe"] },
  { name: "Argo Workflows & CD", category: "Cloud & DevOps", proficiency: 90, years: 3, blurb: "Own the async orchestration layer: artifact GC, pod GC, TTL tuning, GitOps delivery.", projects: ["cicd-argo", "provisioners"], experience: ["balkanid-senior"] },
  { name: "Terraform", category: "Cloud & DevOps", proficiency: 80, years: 2, blurb: "EKS, VPC networking, IAM and the data-lake catalog as code.", projects: ["cicd-argo", "data-platform"], experience: ["balkanid-senior"] },
  { name: "GitHub Actions", category: "Cloud & DevOps", proficiency: 88, years: 2, blurb: "Selective-rebuild release pipeline across 17 services on self-hosted runners.", projects: ["cicd-argo"], experience: ["balkanid-senior", "balkanid-swe"] },
  { name: "Helm", category: "Cloud & DevOps", proficiency: 82, years: 2, blurb: "Charts for a 23-service mesh with secret-manager integration.", projects: ["cicd-argo"], experience: ["balkanid-senior"] },
  { name: "Docker", category: "Cloud & DevOps", proficiency: 85, years: 3, blurb: "Image authoring and supply-chain hardening with verified toolchains.", projects: ["cicd-argo"], experience: ["balkanid-swe"] },

  // Backend & Data
  { name: "GraphQL", category: "Backend & Data", proficiency: 86, years: 2, blurb: "Cursor pagination, query-cost analysis and materialized-view aggregation.", projects: ["graphql-perf", "identity-platform"], experience: ["balkanid-swe", "balkanid-senior"] },
  { name: "PostgreSQL", category: "Backend & Data", proficiency: 90, years: 3, blurb: "Tenant-isolated, schema-per-tenant multi-tenancy at scale.", projects: ["identity-platform", "graphql-perf", "data-platform"], experience: ["balkanid-swe", "balkanid-senior"] },
  { name: "DuckDB", category: "Backend & Data", proficiency: 80, years: 1, blurb: "Led the analytics migration to DuckDB on S3 with bounded memory and spill.", projects: ["data-platform"], experience: ["balkanid-senior"] },
  { name: "Parquet / Data Lake", category: "Backend & Data", proficiency: 80, years: 2, blurb: "Hive-partitioned curated S3 lake with a Glue catalog.", projects: ["data-platform"], experience: ["balkanid-senior"] },
  { name: "Protocol Buffers", category: "Backend & Data", proficiency: 75, years: 2, blurb: "Shared entity-model contracts across services and connectors.", projects: ["identity-platform"], experience: ["balkanid-swe"] },

  // Frontend
  { name: "React", category: "Frontend", proficiency: 82, years: 2, blurb: "Access-review screens, dashboards and integration onboarding flows.", projects: ["graphql-perf", "identity-platform"], experience: ["balkanid-swe", "balkanid-senior"] },
  { name: "Next.js", category: "Frontend", proficiency: 78, years: 1, blurb: "This site, plus internal tooling front-ends.", projects: ["ai-mcp"], experience: ["balkanid-senior"] },
  { name: "Three.js / R3F", category: "Frontend", proficiency: 72, years: 1, blurb: "Interactive 3D experiences and data visualization.", projects: [], experience: ["balkanid-senior"] },

  // Identity & Security
  { name: "OPA / Rego", category: "Identity & Security", proficiency: 80, years: 2, blurb: "Policy-driven authorization and a findings/severity rules engine.", projects: ["identity-platform"], experience: ["balkanid-swe", "balkanid-senior"] },
  { name: "SCIM / Provisioning", category: "Identity & Security", proficiency: 84, years: 2, blurb: "Built provisioners for GitHub, Active Directory and Okta from scratch.", projects: ["provisioners"], experience: ["balkanid-swe"] },
  { name: "OAuth / OIDC / SSO", category: "Identity & Security", proficiency: 80, years: 2, blurb: "Federation and trust modeling across identity providers and apps.", projects: ["identity-platform"], experience: ["balkanid-swe", "balkanid-senior"] },
  { name: "DevSecOps", category: "Identity & Security", proficiency: 78, years: 2, blurb: "Vulnerability and secret scanning wired into CI.", projects: ["cicd-argo"], experience: ["balkanid-senior"] },

  // AI & Tooling
  { name: "MCP / AI Agents", category: "AI & Tooling", proficiency: 85, years: 1, blurb: "Built and operate internal AI agents and Model Context Protocol servers.", projects: ["ai-mcp"], experience: ["balkanid-senior"] },
  { name: "Prometheus / Observability", category: "AI & Tooling", proficiency: 76, years: 2, blurb: "Retention tuning and signal-first debugging across the platform.", projects: ["cicd-argo"], experience: ["balkanid-senior"] },
];

export const experience: ExperienceItem[] = [
  {
    id: "balkanid-senior",
    company: "BalkanID",
    role: "Senior Software Engineer & Engineering Team Lead",
    start: "2025-08",
    end: "present",
    period: "Aug 2025 — Present",
    location: "Remote",
    summary:
      "Lead an engineering team while owning platform engineering and production reliability for a multi-tenant identity governance product.",
    achievements: [
      "Own the CI/CD platform and async workflow orchestration across a 23-service Kubernetes mesh delivered via GitOps.",
      "Lead production incident response as the primary hotfix and root-cause point person, resolving payload-limit, data-migration and integration regressions across live tenants.",
      "Raised pod density from 58 to 110 per node and cut p95 GraphQL latency 60 percent on the busiest surfaces.",
      "Built an internal AI bug-analysis agent that cut manual debugging time 60 percent and dev-cycle time 35 percent.",
    ],
    tech: ["Go", "Kubernetes", "Argo", "AWS / EKS", "PostgreSQL", "DuckDB", "GraphQL", "React", "MCP / AI Agents"],
  },
  {
    id: "balkanid-swe",
    company: "BalkanID",
    role: "Software Engineer",
    start: "2024-06",
    end: "2025-08",
    period: "Jun 2024 — Aug 2025",
    location: "Remote",
    summary:
      "Full-stack IC with architectural ownership of the integration platform and several major migrations.",
    achievements: [
      "Built source connectors and three production identity provisioners (GitHub, Active Directory, Okta) from scratch.",
      "Migrated cloud provisioning from in-process to async workflow orchestration for parallelism and fault isolation.",
      "Drove the analytics migration from a query service to DuckDB on S3, improving bulk throughput 25 percent.",
      "Shipped end to end across schema, Go and GraphQL backend, and React UI in single delivery cycles.",
    ],
    tech: ["Go", "TypeScript", "PostgreSQL", "GraphQL", "Argo", "AWS", "Terraform", "OPA / Rego"],
  },
  {
    id: "balkanid-intern",
    company: "BalkanID",
    role: "Engineering Intern",
    start: "2023-05",
    end: "2024-06",
    period: "May 2023 — Jun 2024",
    location: "Remote",
    summary:
      "Founding intern. Built backend connectors and customer-facing UI features across the early platform.",
    achievements: [
      "Delivered the first set of source connectors that grew into a 38-source ingestion fleet.",
      "Implemented product UI features and learned the multi-tenant architecture end to end.",
    ],
    tech: ["Go", "React", "PostgreSQL", "GraphQL"],
  },
  {
    id: "appyhigh",
    company: "AppyHigh",
    role: "Android Developer Intern",
    start: "2022-04",
    end: "2022-06",
    period: "Apr 2022 — Jun 2022",
    location: "Remote",
    summary: "Shipped production Android apps used by a large audience.",
    achievements: [
      "Shipped Android applications with 100K-plus downloads.",
      "Cut crash rate 20 percent and built reusable mobile components.",
    ],
    tech: ["Kotlin", "Java", "MVVM", "Android"],
  },
  {
    id: "ankidroid",
    company: "AnkiDroid",
    role: "Open-Source Contributor",
    start: "2022-04",
    end: "2022-05",
    period: "2022",
    location: "Open Source",
    summary: "Contributed to a flashcard app with a multi-million user community.",
    achievements: [
      "Migrated legacy Java modules to Kotlin and resolved high-priority bugs.",
    ],
    tech: ["Kotlin", "Java", "Open Source"],
  },
];

export const projects: Project[] = [
  {
    id: "identity-platform",
    name: "Identity Integration Platform",
    tagline: "38 source connectors stitched into one governed identity graph.",
    category: "Distributed Systems · Identity",
    accent: "#38bdf8",
    problem:
      "Enterprises run identities across dozens of disconnected systems: identity providers, HRIS, SaaS apps and version control. Governing access means first unifying all of them, correctly, without duplicating people across systems.",
    solution:
      "A multi-repo source-connector platform that ingests identities, groups, applications and access relationships from 38 sources into tenant-isolated PostgreSQL, then stitches them into a single graph using directional federation edges (who trusts whom) and equivalence on strong external identifiers (who is the same person).",
    architecture:
      "Connectors share consistent patterns: tolerant JSON decoding for inconsistent source APIs, per-endpoint token-bucket rate limiting with server-side filtering, and bounded concurrent fan-out. Cross-system equivalence resolves on strong IDs such as object GUIDs (with byte-order normalization) rather than fragile email or username matches.",
    impact:
      "Processes 50K-plus identities per day with tenant isolation and policy-based authorization. Twelve connectors were built from scratch; coordinated cross-fleet sweeps standardized rate limiting and error handling across the whole set.",
    tech: ["Go", "PostgreSQL", "Protocol Buffers", "OPA / Rego", "GraphQL", "REST"],
    highlights: [
      "Federation edges plus strong-ID equivalence give zero-duplicate cross-system identity resolution.",
      "Closest-sibling-first connector design keeps 38 integrations consistent instead of 38 rewrites.",
      "Token-bucket rate limiting with Retry-After backoff turned 277 throttling failures into 19 on a single source.",
    ],
    metrics: [
      { label: "Sources", value: "38" },
      { label: "Built from scratch", value: "12" },
      { label: "Identities / day", value: "50K+" },
    ],
  },
  {
    id: "cicd-argo",
    name: "CI/CD & Workflow Orchestration Platform",
    tagline: "One platform shipping 23 services to many clusters.",
    category: "Platform Engineering · DevOps",
    accent: "#2dd4bf",
    problem:
      "A growing microservice fleet needs fast, reliable delivery to dev, prod, sandbox and per-customer clusters without rebuilding everything on every commit or drowning the cluster in orphaned workflow resources.",
    solution:
      "A GitHub Actions release pipeline with path-based selective rebuilds across 17 services, Helm charts for a 23-service mesh, and GitOps delivery. I own the async workflow orchestration layer that runs long-lived provisioning and data jobs.",
    architecture:
      "Selective rebuilds map source paths to images so a commit only rebuilds what it touches. The orchestration layer adds shared artifact garbage collection, pod-GC tuned to preserve a debug window, and time-to-live policies that relieve cluster pressure. EKS is hardened with VPC CNI prefix delegation and right-sized controllers.",
    impact:
      "Raised pod density from 58 to 110 per node, cut successful-workflow retention from three days to one to relieve control-plane pressure, and consolidated duplicated workflow configuration into a single reusable helper.",
    tech: ["GitHub Actions", "Argo Workflows & CD", "Helm", "Kubernetes", "AWS / EKS", "Terraform"],
    highlights: [
      "Path-filtered selective rebuilds avoid full-fleet rebuilds on every commit.",
      "Migrated four cloud provisioners from in-process to async orchestration for parallelism and fault isolation.",
      "EKS prefix delegation nearly doubled pod density per node.",
    ],
    metrics: [
      { label: "Services", value: "23" },
      { label: "Pod density", value: "58 → 110" },
      { label: "CI scope", value: "17 svcs" },
    ],
  },
  {
    id: "data-platform",
    name: "Analytics Data Platform Modernization",
    tagline: "Moved analytics to DuckDB on S3 and made the data trustworthy.",
    category: "Data Engineering",
    accent: "#22d3ee",
    problem:
      "The analytics query layer was costly and slow, customer onboarding waited on redundant pipeline stages, and a migration had left stale access records that surfaced wrong data in the product.",
    solution:
      "Migrated analytics from a managed query service to DuckDB reading a Hive-partitioned Parquet lake on S3, with credentials issued through workload identity. Redesigned the downstream ETL to gate redundant stages and removed an entire storage hop.",
    architecture:
      "DuckDB runs with bounded memory and spill-to-disk against partitioned curated data. A single-source-of-truth verification pass in PostgreSQL reconciles access relationships, catching and dropping stale rows that the old pipeline left behind.",
    impact:
      "Improved bulk throughput 25 percent on million-record exports, cut onboarding latency by collapsing redundant stages, and fixed a wrong-data regression across multiple live tenants.",
    tech: ["DuckDB", "AWS / EKS", "Parquet / Data Lake", "Terraform", "Go", "PostgreSQL"],
    highlights: [
      "Hive-partitioned curated lake with workload-identity credential issuance.",
      "Single-source-of-truth reconciliation fixed stale access records in production.",
      "Removed a redundant storage hop by folding stages into curated transforms.",
    ],
    metrics: [
      { label: "Throughput", value: "+25%" },
      { label: "Records", value: "1M+" },
      { label: "Tenants fixed", value: "3+" },
    ],
  },
  {
    id: "graphql-perf",
    name: "GraphQL API Performance",
    tagline: "60% faster p95 on the busiest access-review surfaces.",
    category: "Backend · Performance",
    accent: "#34d399",
    problem:
      "Access-review and entity-management screens were slow under load, and pathological queries could overwhelm the server.",
    solution:
      "Reworked the GraphQL layer with cursor pagination, query-cost analysis to refuse pathological requests, and materialized-view aggregation serving both flat and grouped consumers.",
    architecture:
      "A hybrid dispatch strategy reads from a grouped materialized view for aggregate consumers while preserving flat reads, with cost limits enforced before execution.",
    impact:
      "Cut p95 response time 60 percent and server load 35 percent at the same traffic, with grouped CSV export for bulk review past a thousand items.",
    tech: ["Go", "GraphQL", "PostgreSQL", "React"],
    highlights: [
      "Cursor pagination plus query-cost guards stop runaway queries.",
      "Materialized-view aggregation serves grouped and flat consumers from one path.",
    ],
    metrics: [
      { label: "p95 latency", value: "-60%" },
      { label: "Server load", value: "-35%" },
      { label: "Bulk review", value: "1000+" },
    ],
  },
  {
    id: "ai-mcp",
    name: "AI-Powered Bug Analysis Agent",
    tagline: "An internal agent that triages bugs across teams.",
    category: "AI Tooling",
    accent: "#5eead4",
    problem:
      "Engineers spent significant cycles on manual root-cause analysis, and tribal debugging knowledge was hard to scale across a team.",
    solution:
      "Built an internal AI bug-analysis agent (Go backend, TypeScript dashboard, issue-tracker integration) plus a composition of custom AI coding skills and persistent project memory that encode the team's debugging and review workflows.",
    architecture:
      "Model Context Protocol servers expose internal context to AI agents; a dispatcher routes work by complexity to the right workflow, and persistent memory captures conventions so the system improves over time.",
    impact:
      "Runs 20-plus analyses a day across teams, cutting manual debugging time 60 percent and dev-cycle time 35 percent, and turning one-off runbooks into repeatable, composable workflows.",
    tech: ["Go", "TypeScript", "MCP / AI Agents", "Next.js"],
    highlights: [
      "MCP servers give AI agents structured access to internal engineering context.",
      "Composable skills plus persistent memory scale debugging discipline across a team.",
    ],
    metrics: [
      { label: "Debugging time", value: "-60%" },
      { label: "Dev cycle", value: "-35%" },
      { label: "Daily analyses", value: "20+" },
    ],
  },
  {
    id: "provisioners",
    name: "Identity Provisioners",
    tagline: "GitHub, Active Directory and Okta provisioning, built from scratch.",
    category: "Identity · Automation",
    accent: "#fbbf24",
    problem:
      "Granting and revoking access by hand across GitHub, directory services and identity providers is slow, error-prone and hard to audit.",
    solution:
      "Built three production provisioners from scratch that automate org-role, team and repository access on GitHub, directory accounts on Active Directory, and resource scoping on Okta, all driven by just-in-time access policy.",
    architecture:
      "Each provisioner runs as an async workflow with credentials decrypted at run time and per-recipient fan-out, isolating failures and enabling parallel execution.",
    impact:
      "Automated previously manual access changes with full audit trails, and established a reusable provisioning pattern later applied to additional access flows.",
    tech: ["Go", "Argo Workflows & CD", "SCIM / Provisioning", "OAuth / OIDC / SSO"],
    highlights: [
      "Async, credential-isolated provisioning with per-recipient fan-out.",
      "Just-in-time policy integration for least-privilege access changes.",
    ],
    metrics: [
      { label: "Provisioners", value: "3" },
      { label: "Pattern reuse", value: "Multiple flows" },
    ],
  },
];

export const principles: Principle[] = [
  {
    title: "Root-cause over band-aid",
    mechanism:
      "I establish ground truth at every layer (UI, API, database, deployment, logs, data pipeline) before forming a hypothesis, and trace the data shape at each consumer independently because reshape layers silently drop fields.",
    outcome: "Led 34 production hotfixes as the primary point person, fixing causes instead of symptoms.",
    icon: "target",
  },
  {
    title: "Reuse-first, pattern-consistent",
    mechanism:
      "Before writing new code I find how the codebase already solves the adjacent case and fold into it, so 38 connectors stay one consistent pattern instead of 38 rewrites.",
    outcome: "Coordinated cross-fleet sweeps standardized rate limiting and error handling across the entire connector set.",
    icon: "layers",
  },
  {
    title: "Production-grade by default",
    mechanism:
      "Code ships efficient, modular, testable, observable and safe: bounded concurrency, server-side filtering, input validation, multi-tenant isolation and error messages that name the operation.",
    outcome: "Token-bucket rate limiting with backoff turned 277 throttling failures into 19 on a single source.",
    icon: "shield",
  },
  {
    title: "Verify, don't assume",
    mechanism:
      "I enumerate the blast radius of a change across every reader and writer, verify each against the live source or sibling code, and state conclusions as a traced summary rather than a guess.",
    outcome: "Sibling-set verification in code review separates real deviations from existing project patterns before anything ships.",
    icon: "search",
  },
  {
    title: "AI-augmented engineering",
    mechanism:
      "I encode team workflows as composable AI skills backed by persistent context and Model Context Protocol servers, so debugging and review discipline scales beyond any single person.",
    outcome: "Cut manual debugging time 60 percent and dev-cycle time 35 percent across teams.",
    icon: "sparkles",
  },
];

export const certifications = [
  { name: "Google Gen AI Academy", issuer: "Google", year: "2025" },
  { name: "Software Engineering Virtual Experience", issuer: "JPMorgan Chase", year: "2023" },
];

export const education = {
  school: "Vellore Institute of Technology",
  degree: "B.Tech, Computer Science and Engineering",
  period: "2020 — 2024",
  detail: "CGPA 8.98",
};

export const socials = [
  { label: "GitHub", href: person.github, handle: "@Jatin887" },
  { label: "LinkedIn", href: person.linkedin, handle: "Jatin Fulwani" },
  { label: "Email", href: `mailto:${person.email}`, handle: person.email },
];

export const nav = [
  { id: "hero", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "timeline", label: "Journey" },
  { id: "projects", label: "Projects" },
  { id: "tech", label: "Tech" },
  { id: "stats", label: "Impact" },
  { id: "experience", label: "Experience" },
  { id: "approach", label: "How I Work" },
  { id: "contact", label: "Contact" },
] as const;
