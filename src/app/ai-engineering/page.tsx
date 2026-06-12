import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import AiBridgeDiagram from "@/components/AiBridgeDiagram";

export const metadata: Metadata = {
  title: "AI Engineering — Production MCP & LLM Systems",
  description:
    "A production AI engineering case study: building an MCP server that bridges a local Ollama LLM to NetSuite ERP for a marketing team — OAuth, SuiteScript RESTlets, LangGraph multi-step reasoning, and the batching and prompting fixes that made it reliable.",
  keywords: [
    "AI engineering",
    "MCP server",
    "Model Context Protocol",
    "Ollama LLM integration",
    "NetSuite ERP automation",
    "SuiteScript RESTlet",
    "LangGraph",
    "production LLM systems",
    "AI engineer Perth",
  ],
};

const queryFlow = [
  {
    title: "Natural-language question in the UI",
    detail:
      'A marketing user asks a plain question — for example, "Show me details for Jim Brown" — directly in the marketing interface.',
  },
  {
    title: "MCP server receives the request",
    detail:
      "The Model Context Protocol server interprets the request and decides which tool to invoke against the ERP.",
  },
  {
    title: "OAuth + NetSuite API authentication",
    detail:
      "The server authenticates to NetSuite over OAuth and issues an authorised API call.",
  },
  {
    title: "SuiteScript RESTlet queries the database",
    detail:
      "A SuiteScript RESTlet runs inside NetSuite, querying the underlying records the question needs.",
  },
  {
    title: "Data returns to the Ollama LLM",
    detail:
      "The raw records flow back to a locally hosted Ollama LLM, which turns structured data into a readable answer.",
  },
  {
    title: "Formatted answer in the UI",
    detail:
      "The formatted response is returned to the marketing interface, closing the loop on the original question.",
  },
];

const productionFixes = [
  {
    title: "Batching to respect NetSuite governance limits",
    detail:
      "NetSuite enforces script execution and governance limits, so large pulls were processed in batches of 250 records alongside query optimisation — keeping each request comfortably inside the platform's execution budget.",
  },
  {
    title: "Explicit system-prompt definitions",
    detail:
      "The LLM initially blurred leads and customers. Adding explicit definitions to the system prompt disambiguated the two entity types so answers referenced the right records.",
  },
  {
    title: "Pagination through batches for large datasets",
    detail:
      "For datasets larger than a single batch, the server paginates through batches so complete results are assembled without exceeding limits.",
  },
];

export default function AiEngineeringPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Production MCP & LLM Systems — AI Engineering",
    description:
      "A production engineering case study on bridging a local Ollama LLM to NetSuite ERP through an MCP server, with LangGraph multi-step reasoning and reliability fixes.",
    url: "https://www.usamajaved.com.au/ai-engineering",
    author: {
      "@id": "https://www.usamajaved.com.au/#person",
    },
    publisher: {
      "@id": "https://www.usamajaved.com.au/#person",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.usamajaved.com.au/ai-engineering",
    },
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Hero */}
        <header className="mb-16">
          <p
            className="text-xs tracking-widest uppercase mb-4 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: "var(--accent-violet)" }}
          >
            AI Engineering
          </p>
          <h1
            className="text-4xl md:text-5xl font-semibold mb-6 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: "var(--text-primary)" }}
          >
            Production MCP &amp; LLM Systems
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            A real production system: an MCP server that lets a marketing team ask
            plain-language questions and get answers straight from NetSuite ERP —
            authenticated, queried, and formatted by a locally hosted LLM.
          </p>
        </header>

        {/* Problem */}
        <section className="mb-16">
          <h2
            className="text-2xl font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: "var(--text-primary)" }}
          >
            The Problem
          </h2>
          <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            At the Ear Science Institute Australia in Perth, as a Senior Systems
            Developer, the marketing team needed answers that lived inside NetSuite
            ERP — but reaching them meant knowing the system, the records, and the
            queries. The goal was to let anyone ask in natural language and have the
            data come back formatted, without learning NetSuite at all.
          </p>
        </section>

        {/* Architecture */}
        <section className="mb-16">
          <h2
            className="text-2xl font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: "var(--text-primary)" }}
          >
            The Architecture
          </h2>
          <p
            className="leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            An MCP server sits between the marketing UI and NetSuite, connecting a
            local Ollama LLM to the ERP. A natural-language question travels through
            six steps before the formatted answer returns to the interface.
          </p>

          {/* Diagram */}
          <div
            className="rounded-xl p-6 mb-10"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <AiBridgeDiagram />
          </div>

          {/* Six-step flow */}
          <ol className="space-y-5">
            {queryFlow.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-[family-name:var(--font-space-grotesk)]"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-default)",
                    color: "var(--accent-blue)",
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Evolution */}
        <section className="mb-16">
          <h2
            className="text-2xl font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: "var(--text-primary)" }}
          >
            From v1 to v2
          </h2>
          <p
            className="leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Version 1 was deliberately simple: a question came in, the server fetched
            the data, and the LLM answered. It worked for direct lookups but struggled
            with anything that needed more than one step of reasoning.
          </p>
          <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Version 2 introduced LangGraph for multi-step reasoning, with intelligent
            chunking so the system could break a request into stages and assemble a
            coherent answer from larger, more complex queries.
          </p>
        </section>

        {/* Trade-offs / Impact */}
        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: "var(--text-primary)" }}
          >
            Trade-offs &amp; Production Fixes
          </h2>
          <p
            className="leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Moving from a working prototype to a system the marketing team could rely
            on came down to three fixes — each one a constraint the platform or the
            model imposed in production.
          </p>

          <div className="space-y-6">
            {productionFixes.map((fix, i) => (
              <div
                key={i}
                className="rounded-xl p-6"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <h3
                  className="font-semibold mb-2 font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {fix.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {fix.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
