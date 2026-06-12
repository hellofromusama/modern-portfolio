import type { Skill } from "./types";

// Homepage skills (src/app/page.tsx) — 4 groups, 4 items each, copied VERBATIM.
// Pure data: no "use client", no JSX.
const skills: Skill[] = [
  { title: "Frontend", accent: "blue", items: ["React / Next.js 15", "TypeScript", "Tailwind CSS", "Vue.js / Nuxt.js"] },
  { title: "Backend", accent: "violet", items: ["Node.js / Express", "Python / Django", "PostgreSQL / MongoDB", "REST / GraphQL"] },
  { title: "Cloud & DevOps", accent: "emerald", items: ["AWS / Azure / GCP", "Docker / Kubernetes", "CI/CD Pipelines", "Terraform"] },
  { title: "Specializations", accent: "amber", items: ["NetSuite SuiteScripts", "N8N Automation", "AI/ML Integration", "ERP Systems"] },
  { title: "AI Protocols & Agents", accent: "amber", items: ["MCP, A2A, ACP", "LangChain / LangGraph", "CrewAI / AutoGen", "OpenAI Agents SDK", "Semantic Kernel", "LlamaIndex"] },
  { title: "RAG & Retrieval", accent: "blue", items: ["Full RAG pipelines", "Hybrid search & rerankers", "Vector DBs: Chroma / Pinecone / Milvus", "OpenSearch / Aurora pgvector"] },
  { title: "LLM Engineering", accent: "violet", items: ["Context / session / long-term memory", "System prompts & few-shot / CoT", "Prompt-injection defense", "Python & FastAPI"] },
  { title: "AI on AWS & Observability", accent: "emerald", items: ["Bedrock / OpenSearch Serverless", "Lambda / ECS / Fargate / S3", "LangSmith / Langfuse / Phoenix", "Ragas / OpenTelemetry"] },
];

export { skills };
export default skills;
