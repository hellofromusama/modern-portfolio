import type { Skill } from "./types";

// Homepage skills (src/app/page.tsx) — 4 groups, 4 items each, copied VERBATIM.
// Pure data: no "use client", no JSX.
const skills: Skill[] = [
  { title: "Frontend", accent: "blue", items: ["React / Next.js 15", "TypeScript", "Tailwind CSS", "Vue.js / Nuxt.js"] },
  { title: "Backend", accent: "violet", items: ["Node.js / Express", "Python / Django", "PostgreSQL / MongoDB", "REST / GraphQL"] },
  { title: "Cloud & DevOps", accent: "emerald", items: ["AWS / Azure / GCP", "Docker / Kubernetes", "CI/CD Pipelines", "Terraform"] },
  { title: "Specializations", accent: "amber", items: ["NetSuite SuiteScripts", "N8N Automation", "AI/ML Integration", "ERP Systems"] },
];

export { skills };
export default skills;
