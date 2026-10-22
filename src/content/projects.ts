import type { Project } from "./types";

// The single source of truth for all 7 projects. Stored as a keyed map (slug ->
// Project) so lookups are O(1) and the slug appears as a 2-space-indented key —
// then exposed as the ordered `projects` array below.
//
// Each entry is the SUPERSET of every consumer's fields, copied VERBATIM:
//   - detail fields (title/subtitle/description/longDescription/tech/category/
//     timeline/team/features/challenges/results/gradient/liveUrl) from
//     src/app/projects/[id]/page.tsx
//   - grid* fields (the home grid's OWN distinct title/description/tech/category)
//     from src/app/page.tsx  (modern-portfolio is NOT in the grid -> no grid*)
//   - seo* fields (curated JSON-LD ItemList copy) from src/app/layout.tsx
//     (kashmir-fund is NOT in the ItemList -> no seo*)
//   - sitemapPriority from src/app/sitemap.ts
//
// Order of keys matches the detail map order:
//   kashmir-fund, n8n-automation, voice-ai-agent, erp-system,
//   netsuite-integration, modern-portfolio, cloud-infrastructure
const projects = {
  "ai-backoffice-construction": {
    id: "ai-backoffice-construction",
    title: "AI Back-Office Platform for a Construction Company",
    subtitle: "Invoices, suppliers and fleet, from inbox to ERP",
    description: "Lead engineer on a production platform for a Perth construction contractor running on SimPro: invoice and quote extraction with a human review gate, supplier onboarding with document verification and fraud screening, fleet inspections by consensus extraction, and a permission-scoped chat assistant over a 7,000-document corpus.",
    longDescription: `Problem: supplier invoices were re-keyed into SimPro by hand, ~2,000 suppliers were onboarded over email and spreadsheets, and monthly fleet inspections arrived as photos in a shared mailbox and SharePoint workbooks nobody could search.

Design: a Bun + Hono API on Vercel with a React 19 front end, Supabase Postgres under row-level security, and Trigger.dev tasks for everything that takes longer than a request. Gemini Flash does extraction into Zod-validated schemas; a judge layer (JEV for classification, CDM for arbitrating between candidate extractions) scores every output before it is used, and anything below threshold goes to a person. The invoice agent takes a PDF from inbox or upload to a SimPro vendor order and receipt when confidence and drift checks pass, and escalates the rest with the reason. A GST TaxAdjustment makes the SimPro total land on the printed figure, proven by a live read-back check. SimPro webhooks feed a local mirror and a daily job reconciles it against the live API.

Trade-offs: the human approval gate was kept over straight-through processing until the judge layer earned the right to bypass it. Gemini Flash everywhere for cost and multimodal PDFs, with promptfoo benchmarks before any model change after an upstream model retirement broke quote extraction. The chat assistant's SQL tool runs as a dedicated NOLOGIN Postgres role reached by PostgREST JWT role-switching, because SET ROLE is blocked on managed Supabase; two signing paths were the price of a real privilege boundary.

Result: office staff process invoices from PDF to ERP receipt in one screen, suppliers onboard themselves through a public wizard with ABN, ABR, BSB and certificate checks, inspection reports flow from driver to review sheet, and staff ask questions of company data with cited answers. 276 migrations, 96 RLS policies, exploit tests in CI, and 76 incident-born project skills that keep coding agents from repeating past failures.`,
    tech: ["Bun", "TypeScript", "Hono", "React 19", "TanStack", "Supabase", "Trigger.dev", "Gemini", "Langfuse", "promptfoo", "SimPro API", "Microsoft Graph"],
    category: "AI Engineering",
    timeline: "Live in production",
    team: "Lead engineer, Lakestone AI",
    features: [
      "Invoice agent: Gemini extraction, confidence and drift gates, straight-through to SimPro receipt or escalation with reason",
      "LLM as judge: JEV scores classifications, CDM arbitrates between candidate extractions, low scores go to a person",
      "GST rounding correction with a live read-back proof so a quiet day isn't mistaken for a pass",
      "SimPro mirror fed by 34+ webhook event types and reconciled daily against the live API",
      "Supplier agent: ABN and ABR checks, AusPayNet BSB validation, certificate verification, banking-change fraud screening with ABA pre-flight",
      "Inspection agent: tokenised driver requests, mail and SharePoint ingest, three-run consensus extraction, SharePoint write-back",
      "7,367-document corpus migrated byte-for-byte with hash verification, Postgres FTS plus pgvector behind per-tree permissions",
      "Chat assistant with cited answers, permission-gated tool registry and a read-only Postgres role for SQL",
    ],
    challenges: [
      "A rounding fix that passed every test still drifted in production because the CREATE path dropped the adjustment",
      "Making an LLM's SQL tool safe on managed Postgres where SET ROLE inside SECURITY DEFINER is blocked",
      "A stale SharePoint delta cursor let 29 nightly syncs report success while doing nothing",
      "Parallel coding agents colliding on migration timestamps and leaking scope",
    ],
    results: [
      "Invoices go from PDF to SimPro receipt without re-keying; totals land on the printed figure",
      "Postgres itself rejects out-of-scope reads from the assistant, proven by exploit tests in CI",
      "Per-root delta cursors and fail-visible aborts made the vehicle mirror self-recovering",
      "CI gates and 76 project skills stopped agents repeating incidents",
    ],
    gradient: "from-blue-500 to-violet-600",
    gridTitle: "AI Back-Office Platform (Construction)",
    gridDescription: "Lead engineer. Invoices, suppliers and fleet inspections taken from inbox to SimPro by agents with judge models behind them. Live in production.",
    gridTech: ["Bun", "Hono", "Supabase", "Gemini"],
    gridCategory: "In Production",
    seoName: "AI Back-Office Platform for a Construction Company",
    seoDescription: "Production invoice, supplier and fleet platform integrated with SimPro: Gemini extraction, LLM-as-judge, agents with human escalation, Supabase RLS",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.9,
  },
  "property-agency-ems": {
    id: "property-agency-ems",
    title: "Mail, Property and Agreement Platform for a Property Agency",
    subtitle: "Graph mail sync, Gemini classification, drafts a person approves",
    description: "A comms control centre for a commercial property agency in Perth: Microsoft 365 mailboxes synced and classified, every proposal and reply reviewed by a person, a gated Management Agency Agreement workflow, and a property portfolio mirrored from Cirrus8. Live in production since October 2026.",
    longDescription: `Problem: property managers triaged a shared intake mailbox by hand, tracked new managements in a spreadsheet, and answered property questions by searching Cirrus8 and SharePoint one record at a time.

Design: Microsoft Graph delta sync and webhooks land each message; a Gemini insight loop classifies it, judged by JEV, and proposes the client, property and job it belongs to with a confidence. A person accepts, edits or rejects. The email agent drafts the reply and files the attachments, and send is a confirmed, idempotent, audited command from the member's own mailbox with an Undo window. Every write is a Zod command with an Idempotency-Key and expected version; every external effect goes through an outbox and is simulated unless its flag is on. A fake LLM provider, a call ledger and provider pauses mean CI, seeds and end-to-end tests run with zero paid calls.

My areas: the client research and knowledge base, the Cirrus8 integration (the roadmap assumed CSV-only; I proved a read API by live session capture under a secrets rule and built a mirror whose freshness is a health check), the MAA workshop and generator, schema, access control, the email and property agents, and the production go-live.

Trade-offs: drafts only, with send behind a flag, costs reply speed and buys trust on a client mailbox. The command kernel adds ceremony to every write and removes a whole class of double-click and stale-edit bugs over shared mail.

Result: production live at the agency on 14 October 2026 after a release that had not built for three weeks: 2,240 commits merged, 94 migrations replayed, the tier guard changed with recorded reasons, 42 stale env overrides cleaned, readiness measured. 201 RLS policies with every application table covered, separate database logins per service, Entra sign-in.`,
    tech: ["Bun", "Hono", "zod-openapi", "React 19", "Supabase", "Vercel Workflow SDK", "Gemini", "Langfuse", "Microsoft Graph", "Cirrus8", "Entra ID"],
    category: "AI Engineering",
    timeline: "Live in production",
    team: "Engineer, Lakestone AI (research, Cirrus8, MAA, schema, access, go-live)",
    features: [
      "Email agent: classify, link to the record, draft the reply, file attachments, hand the draft to a person",
      "Property agent: keeps each property's story current from mail, Cirrus8 and documents; prepares MAA renewals and critical-date actions",
      "Command kernel with Idempotency-Key and expected version on every write, Undo on every action",
      "Outbox for every external effect, simulated unless flagged; fake LLM provider and call ledger for free CI",
      "MAA workflow: onboarding workshop, board, KPI dashboard, gated generator from brief to letter, REIWA form and annexures",
      "Roles, permissions, global admins and an access log with pgTAP permission matrices",
    ],
    challenges: [
      "A production build that rejected the prod tier for three weeks while 2,240 commits piled up on staging",
      "Permissions over shared mail delivered in one day across schema, API, CLI and UI",
      "Sending from a client mailbox safely with a Graph grant scoped to the intake mailbox",
    ],
    results: [
      "Production live 14 October 2026 with measured readiness and RLS state recorded",
      "Every proposal, draft, send and MAA bundle has a person in the loop",
      "A Portfolio page on real Cirrus8 data and a corrected integration premise",
    ],
    gradient: "from-emerald-500 to-teal-600",
    gridTitle: "Mail & Property Platform (Property Agency)",
    gridDescription: "Microsoft 365 mail synced and classified, replies drafted for a person to approve, MAA workflow and Cirrus8 portfolio mirror. Live since October 2026.",
    gridTech: ["Hono", "Supabase", "Gemini", "Microsoft Graph"],
    gridCategory: "In Production",
    seoName: "Mail, Property and Agreement Platform for a Property Agency",
    seoDescription: "Production comms and property-management workbench: Microsoft Graph mail sync, Gemini classification with human approval, command kernel, outbox, Cirrus8 mirror",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.9,
  },
  "lakestone-esign": {
    id: "lakestone-esign",
    title: "Headless E-Signature Service and PDF Toolkit",
    subtitle: "OTP signers, CAdES seals, HMAC webhooks, 40+ PDF tools, one CLI",
    description: "A headless e-signature service built in six days as sole author to replace a per-envelope SaaS subscription, with a 40-tool PDF toolkit in our own TypeScript so documents never leave the stack. In production as the signing step for the products above.",
    longDescription: `Problem: products needed signing as a step, not a vendor-hosted flow with a per-envelope fee, and documents had to stay inside the stack.

Design: a calling project sends a PDF, recipients and fields through the client SDK or the esign CLI. The service emails invitations, authenticates each signer by email OTP, renders every field into the PDF, seals it with a CAdES detached signature and reports back by HMAC-signed webhooks. The CMS/DER construction, signature dictionaries, byte ranges and X.509 chain handling are our own TypeScript, verified against the CA by a script with its own tests. Version 1.1 added esign.pdf.*: organise, fill, redact with an audit trail, protect, sanitise, compare, optimise, convert, PDF/A conformance (XMP, xref rewriting, ICC sRGB, standard-14 fonts) and OCR. Version 1.2 made every capability a feature module an operator switches per project, with requireFeature on every route and job.

Trade-offs: owning PKI instead of a vendor; a large in-house PDF module set and licence diligence as a CI gate (attribution checked, AGPL never copied); a feature gate on every route and the idempotency-caching trap that came with it, recorded as a rule.

Result: signing became an API call, a coding agent can drive the whole service through one CLI with profiles, exit codes and a wait contract, and loopback-only development is proven by static egress scans, a runtime watch and a proxy sinkhole.`,
    tech: ["Bun", "Hono", "zod-openapi", "React 19", "Supabase", "Vercel Workflow SDK", "@libpdf/core", "pdfjs", "tesseract.js", "jose"],
    category: "Backend & Crypto",
    timeline: "v1.2, in production",
    team: "Sole author, Lakestone AI",
    features: [
      "Envelopes with email OTP signer authentication, field rendering and a CAdES detached seal",
      "HMAC-signed webhooks with a receiver fixture for callers",
      "40+ PDF tools in TypeScript: organise, fill, redact, protect, sanitise, compare, optimise, convert, PDF/A, OCR",
      "Feature modules switched per project by an operator; requireFeature on every route and job",
      "One esign CLI with profiles, JSON output, exit codes and a wait contract for people and agents",
      "Loopback-only development proven by egress guards; licence hygiene as a CI gate",
    ],
    challenges: [
      "A standards-compliant seal in TypeScript: CMS and DER construction, byte ranges, X.509 chains, a verifier with tests",
      "PDF/A conformance: XMP, xref rewriting, ICC sRGB, standard-14 fonts",
      "Feature gating without breaking idempotent calls",
    ],
    results: [
      "v1.0 to v1.2 in six days, in work packages with written briefs and acceptance scripts run on a real stack",
      "Sealed PDFs verify against the CA; the runbook tells an operator how to move to a production CA",
      "Contract tests keep core, client, API and CLI aligned",
    ],
    gradient: "from-amber-500 to-orange-600",
    gridTitle: "Headless E-Signature & PDF Toolkit",
    gridDescription: "Sole author. OTP signers, CAdES seals, HMAC webhooks and 40+ PDF tools in TypeScript, behind one CLI an agent can drive. Replaced a SaaS subscription.",
    gridTech: ["Hono", "Supabase", "CAdES", "PDF/A"],
    gridCategory: "In Production",
    seoName: "Headless E-Signature Service and PDF Toolkit",
    seoDescription: "Headless e-signature service with OTP signers, CAdES detached seals, HMAC webhooks and a 40-tool PDF toolkit in TypeScript, per-project feature modules and an agent-driven CLI",
    applicationCategory: "DeveloperApplication",
    sitemapPriority: 0.9,
  },
  "kashmir-fund": {
    id: "kashmir-fund",
    title: "Fund for Azad Kashmir",
    subtitle: "Humanitarian Donation Platform",
    description: "A beautiful humanitarian donation platform supporting relief efforts in Azad Kashmir, featuring Stripe payment integration, transparent fund tracking, and stunning Chinar leaf animations representing Kashmir's natural heritage.",
    longDescription: `This humanitarian platform provides a secure and transparent way for people worldwide to contribute to relief efforts in Azad Kashmir. Built with modern web technologies, the platform ensures smooth donation processing while maintaining the highest standards of security and transparency.

    The website features beautiful Chinar leaf animations that represent Kashmir's natural beauty and cultural heritage. Each falling leaf symbolizes hope and support for the people of Azad Kashmir. The platform integrates with Stripe for secure payment processing, ensuring donors' financial information is protected.

    All donations are tracked transparently with detailed usage reports, showing exactly how funds are being utilized for humanitarian efforts including food, shelter, medical supplies, and education support for affected communities.`,
    tech: ["Next.js 15", "React 19", "Stripe", "Tailwind CSS v4", "TypeScript", "Vercel"],
    category: "Humanitarian",
    timeline: "1 month",
    team: "1 developer (solo project)",
    liveUrl: "https://iamstandingwithkashmir.org",
    features: [
      "Secure Stripe payment integration for donations",
      "Beautiful Chinar leaf animations representing Kashmir's heritage",
      "Transparent fund usage tracking and reporting",
      "Responsive design optimized for all devices",
      "Real-time donation processing and confirmation",
      "Email receipts for all donations",
      "Success page with donation confirmation",
      "Deployed on custom domain with SSL security"
    ],
    challenges: [
      "Implementing secure Stripe checkout with proper error handling",
      "Creating smooth, performant animations without affecting page speed",
      "Ensuring proper DNS configuration for custom domain",
      "Maintaining cultural sensitivity in design and messaging"
    ],
    results: [
      "Live platform accepting donations at iamstandingwithkashmir.org",
      "Secure payment processing with Stripe integration",
      "Beautiful, culturally respectful design",
      "Fast loading times with 95+ Lighthouse score"
    ],
    gradient: "from-green-500 to-orange-600",
    // Home grid (own copy, DISTINCT from detail above)
    gridTitle: "Fund for Azad Kashmir",
    gridDescription: "Built in 48 hours after the crisis. Stripe-powered donations with real-time fund tracking so donors can see exactly where money goes.",
    gridTech: ["Next.js 15", "React 19", "Stripe", "Tailwind CSS"],
    gridCategory: "Humanitarian",
    // NOT in the JSON-LD ItemList -> no seo* fields
    sitemapPriority: 0.7,
  },
  "n8n-automation": {
    id: "n8n-automation",
    title: "N8N Automation Platform (Concept)",
    subtitle: "Architecture study: workflow automation across disconnected systems",
    description: "A comprehensive automation platform built with N8N that connects over 200+ services and applications, enabling businesses to streamline their workflows and eliminate manual processes.",
    longDescription: `This enterprise-grade automation platform revolutionizes how businesses handle repetitive tasks and data integration. Built on N8N's powerful workflow engine, the system provides a visual interface for creating complex automation workflows that span multiple applications and services.

    The platform features advanced error handling, retry mechanisms, and comprehensive logging to ensure reliability in mission-critical business processes. Custom nodes were developed to handle specific business logic and integrate with proprietary systems.

    This is an architecture and design study, not a delivered client project. The figures that appeared in earlier versions of this page were illustrative targets; the value here is the design: how to reconcile eight systems through one workflow engine without making any of them the loser.`,
    tech: ["N8N", "Node.js", "PostgreSQL", "Docker", "Redis", "REST APIs", "Webhooks", "OAuth 2.0"],
    category: "Automation",
    timeline: "Concept / architecture study",
    team: "1 developer (design study)",
    features: [
      "Visual workflow designer with drag-and-drop interface",
      "200+ pre-built service integrations",
      "Custom node development for specialized tasks",
      "Real-time monitoring and error handling",
      "Advanced scheduling and trigger mechanisms",
      "Multi-tenant architecture for enterprise deployment",
      "Comprehensive audit logging and reporting",
      "High availability cluster setup with load balancing"
    ],
    challenges: [
      "Handling complex data transformations between different service APIs",
      "Ensuring reliability and fault tolerance in long-running workflows",
      "Optimizing performance for high-volume data processing",
      "Implementing secure authentication across multiple third-party services"
    ],
    results: [
      "A documented workflow design for eight-system reconciliation with error handling and retries",
      "A reusable pattern later applied in production n8n marketing workflows",
      "Illustrative only: no client metrics are claimed for this study"
    ],
    gradient: "from-blue-500 to-purple-600",
    gridTitle: "N8N Automation Platform",
    gridDescription: "Architecture study: how a company losing a week per week to manual data entry across 8 systems could reconcile them through one n8n workflow engine. Concept, not a client delivery.",
    gridTech: ["N8N", "Node.js", "PostgreSQL", "Docker"],
    gridCategory: "Concept",
    seoName: "N8N Automation Platform (Concept)",
    seoDescription: "Architecture study for workflow automation across eight disconnected business systems using n8n, Node.js and PostgreSQL",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.8,
  },
  "voice-ai-agent": {
    id: "voice-ai-agent",
    title: "Voice AI Booking Agent (Concept)",
    subtitle: "Design study: appointment booking by voice",
    description: "An AI-powered voice assistant that handles appointment scheduling, customer inquiries, and booking management through natural language conversations.",
    longDescription: `This sophisticated voice AI agent transforms customer service and appointment booking through natural language processing and machine learning. The system understands complex scheduling requests, manages calendar conflicts, and provides intelligent responses to customer inquiries.

    Built with OpenAI's latest models, the agent can handle multi-turn conversations, understand context, and make intelligent decisions about scheduling conflicts and customer preferences. The system integrates with popular calendar applications and CRM systems.

    This is a design study rather than a shipped product. Earlier versions of this page quoted booking volumes and conversion figures; those were illustrative and are withdrawn. The production voice and agent work I can speak to is on the Lakestone AI platforms above.`,
    tech: ["OpenAI GPT-4", "Speech-to-Text", "Text-to-Speech", "Node.js", "WebRTC", "Socket.io", "MongoDB", "Express.js"],
    category: "AI/ML",
    timeline: "Concept / design study",
    team: "1 developer (design study)",
    features: [
      "Natural language conversation interface",
      "Intelligent appointment scheduling and conflict resolution",
      "Multi-language support with accent recognition",
      "Calendar integration (Google Calendar, Outlook, etc.)",
      "CRM system synchronization",
      "Customer preference learning and memory",
      "Real-time availability checking",
      "Automated confirmation and reminder systems"
    ],
    challenges: [
      "Achieving high accuracy in speech recognition across different accents",
      "Handling complex scheduling logic with multiple constraints",
      "Maintaining conversation context across long interactions",
      "Ensuring data privacy and security for sensitive information"
    ],
    results: [
      "A documented conversation and scheduling design with calendar and CRM integration points",
      "Clear separation between speech, intent, scheduling logic and confirmation",
      "Illustrative only: no client metrics are claimed for this study"
    ],
    gradient: "from-purple-500 to-pink-600",
    gridTitle: "Voice AI Booking Agent",
    gridDescription: "Design study for a GPT-4 and Whisper voice agent that takes bookings without hold time. Concept, not a client delivery.",
    gridTech: ["OpenAI", "Whisper", "Node.js", "Twilio"],
    gridCategory: "Concept",
    seoName: "Voice AI Booking Agent (Concept)",
    seoDescription: "Design study for a voice AI booking agent using OpenAI GPT-4, Whisper, Node.js and Twilio",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.8,
  },
  "erp-system": {
    id: "erp-system",
    title: "Enterprise ERP Consolidation (Concept)",
    subtitle: "Design study: five legacy apps into one NetSuite",
    description: "A full-scale ERP solution designed for mid to large enterprises, featuring inventory management, CRM, financial tracking, and comprehensive reporting modules.",
    longDescription: `This comprehensive ERP system provides end-to-end business management capabilities for enterprises looking to streamline their operations. The platform integrates all business processes into a single, cohesive system that provides real-time visibility and control.

    The system features modular architecture allowing businesses to implement components as needed. Each module is designed with scalability in mind, supporting thousands of concurrent users and handling large volumes of transactional data.

    This is an architecture study. The figures quoted in earlier versions of this page were illustrative and are withdrawn. For NetSuite work that ran in production, see the MCP NetSuite-Ollama bridge and the Finance Sync work at Ear Science Institute Australia.`,
    tech: ["React", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "GraphQL", "JWT"],
    category: "Enterprise",
    timeline: "Concept / architecture study",
    team: "1 developer (design study)",
    features: [
      "Inventory management with real-time tracking",
      "Customer relationship management (CRM)",
      "Financial accounting and reporting",
      "Human resources management",
      "Supply chain management",
      "Multi-location and multi-currency support",
      "Advanced reporting and analytics dashboard",
      "Role-based access control and permissions"
    ],
    challenges: [
      "Designing a scalable architecture for complex business logic",
      "Ensuring data consistency across multiple modules",
      "Implementing real-time synchronization for inventory tracking",
      "Creating an intuitive UX for complex enterprise workflows"
    ],
    results: [
      "A modular consolidation design with role-based access and reporting as first-class concerns",
      "A migration sequence that retires legacy systems one at a time",
      "Illustrative only: no client metrics are claimed for this study"
    ],
    gradient: "from-green-500 to-blue-600",
    gridTitle: "Enterprise ERP System",
    gridDescription: "Architecture study for consolidating five legacy applications into NetSuite with mobile field access. Concept, not a client delivery.",
    gridTech: ["NetSuite", "SuiteScript", "React", "PostgreSQL"],
    gridCategory: "Concept",
    seoName: "Enterprise ERP Consolidation (Concept)",
    seoDescription: "Architecture study for consolidating legacy business applications into NetSuite with SuiteScript, React and PostgreSQL",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.8,
  },
  "netsuite-integration": {
    id: "netsuite-integration",
    title: "NetSuite Integration Suite (Concept)",
    subtitle: "Design study: SuiteScripts and RESTlets as an integration layer",
    description: "A comprehensive collection of custom SuiteScripts and RESTlets enabling seamless integration between NetSuite and third-party applications.",
    longDescription: `This integration suite bridges the gap between NetSuite and external systems through custom-built SuiteScripts and RESTlets. The solution enables bidirectional data synchronization, automated business processes, and real-time integrations.

    Each script is designed with performance and reliability in mind, handling large data volumes while maintaining NetSuite's governance limits. The suite includes comprehensive error handling, logging, and monitoring capabilities.

    This is a design study drawn from real SuiteScript 2.1 experience; the transaction volumes quoted in earlier versions of this page were illustrative and are withdrawn. Production NetSuite work is described under the MCP NetSuite-Ollama bridge.`,
    tech: ["SuiteScript 2.0", "RESTlets", "JavaScript", "OAuth 2.0", "JSON", "XML", "Web Services", "NetSuite APIs"],
    category: "Integration",
    timeline: "Concept / design study",
    team: "1 developer (design study)",
    features: [
      "Custom SuiteScript development for business automation",
      "RESTlet creation for external API integrations",
      "Scheduled scripts for batch processing",
      "User event scripts for data validation",
      "Client scripts for enhanced user experience",
      "Map/Reduce scripts for large dataset processing",
      "Workflow customizations and approvals",
      "Custom record types and fields"
    ],
    challenges: [
      "Working within NetSuite's script governance and execution limits",
      "Handling complex data transformations between systems",
      "Ensuring script performance with large datasets",
      "Maintaining security while enabling external access"
    ],
    results: [
      "A script-type-by-script-type design for staying inside NetSuite governance limits",
      "A RESTlet contract for external systems with OAuth 2.0",
      "Illustrative only: no client metrics are claimed for this study"
    ],
    gradient: "from-orange-500 to-red-600",
    gridTitle: "NetSuite Integration Suite",
    gridDescription: "Design study for middleware connecting a dozen business systems to NetSuite through SuiteScript and RESTlets. Concept, not a client delivery.",
    gridTech: ["SuiteScript", "REST APIs", "Redis", "Docker"],
    gridCategory: "Concept",
    seoName: "NetSuite Integration Suite (Concept)",
    seoDescription: "Design study for a NetSuite integration layer built from SuiteScript 2.x, RESTlets and OAuth 2.0",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.8,
  },
  "modern-portfolio": {
    id: "modern-portfolio",
    title: "Modern Portfolio Website",
    subtitle: "This Website You're Viewing",
    description: "A responsive, high-performance portfolio website built with the latest web technologies, featuring modern animations and optimal user experience.",
    longDescription: `This portfolio website showcases modern web development practices using cutting-edge technologies. Built with Next.js 15 and React 19, it demonstrates advanced techniques in performance optimization, user experience design, and responsive development.

    The site features custom animations, interactive elements, and a mobile-first responsive design. Every aspect has been optimized for performance, accessibility, and SEO, resulting in excellent Lighthouse scores across all metrics.

    The architecture follows modern best practices with component-based design, TypeScript for type safety, and automated deployment pipelines for continuous integration.`,
    tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Vercel", "GitHub Actions"],
    category: "Web Development",
    timeline: "2 months",
    team: "1 developer (solo project)",
    features: [
      "Server-side rendering with Next.js App Router",
      "Modern animations and interactive elements",
      "Mobile-first responsive design",
      "SEO optimization with meta tags and structured data",
      "Accessibility compliance (WCAG 2.1)",
      "Performance optimization with 95+ Lighthouse score",
      "Contact form with email integration",
      "Dynamic project showcase system"
    ],
    challenges: [
      "Achieving optimal performance while maintaining rich interactions",
      "Ensuring cross-browser compatibility for modern CSS features",
      "Implementing smooth animations without affecting performance",
      "Creating an engaging UX that showcases technical skills"
    ],
    results: [
      "95+ Lighthouse performance score",
      "100% accessibility compliance",
      "Sub-second page load times",
      "Responsive design across all device sizes"
    ],
    gradient: "from-cyan-500 to-blue-600",
    // NOT in the home grid -> no grid* fields
    seoName: "Modern Portfolio Website",
    seoDescription: "Next.js 15 portfolio with React 19 and Tailwind CSS 4",
    applicationCategory: "WebApplication",
    sitemapPriority: 0.7,
  },
  "cloud-infrastructure": {
    id: "cloud-infrastructure",
    title: "Cloud Infrastructure Platform (Concept)",
    subtitle: "Architecture study: Kubernetes microservices on AWS",
    description: "A robust cloud infrastructure platform featuring microservices architecture, automated CI/CD pipelines, and comprehensive monitoring solutions.",
    longDescription: `This cloud infrastructure platform provides a scalable foundation for modern applications using microservices architecture and DevOps best practices. The platform includes automated provisioning, deployment, monitoring, and scaling capabilities.

    Built on AWS with Infrastructure as Code principles, the platform ensures consistent, repeatable deployments across multiple environments. Container orchestration with Kubernetes provides efficient resource utilization and fault tolerance.

    This is an architecture study. The user and uptime figures in earlier versions of this page were illustrative and are withdrawn. Production infrastructure I can speak to: AWS Lambda and ECS with Terraform at Ear Science Institute Australia, and the Vercel, Supabase, Trigger.dev and bare-metal mix at Lakestone AI.`,
    tech: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Prometheus", "Grafana", "ELK Stack"],
    category: "DevOps",
    timeline: "Concept / architecture study",
    team: "1 developer (design study)",
    features: [
      "Microservices architecture with Docker containerization",
      "Kubernetes orchestration for container management",
      "Infrastructure as Code with Terraform",
      "Automated CI/CD pipelines with Jenkins",
      "Comprehensive monitoring with Prometheus and Grafana",
      "Centralized logging with ELK Stack",
      "Auto-scaling based on demand",
      "Multi-environment deployment (dev, staging, prod)"
    ],
    challenges: [
      "Designing resilient microservices communication patterns",
      "Implementing effective service discovery and load balancing",
      "Ensuring security across distributed systems",
      "Managing complex deployment dependencies"
    ],
    results: [
      "A reference architecture for EKS with Terraform, CI/CD and observability",
      "Documented service-discovery, scaling and failure-domain decisions",
      "Illustrative only: no client metrics are claimed for this study"
    ],
    gradient: "from-yellow-500 to-orange-600",
    gridTitle: "Cloud Infrastructure Platform",
    gridDescription: "Architecture study for taking a SaaS product from one to many thousands of concurrent users on EKS. Concept, not a client delivery.",
    gridTech: ["AWS EKS", "Docker", "Kubernetes", "Terraform"],
    gridCategory: "Concept",
    seoName: "Cloud Infrastructure Platform (Concept)",
    seoDescription: "Architecture study for a Kubernetes microservices platform on AWS EKS with Terraform, Prometheus and Grafana",
    applicationCategory: "DeveloperApplication",
    sitemapPriority: 0.8,
  },
  // ---------------------------------------------------------------------------
  // Phase 02 (AICON-04): 5 new AI projects appended below. Surface "production
  // AI engineer". Append-only — none of the 7 entries above were touched.
  // ---------------------------------------------------------------------------
  "mcp-netsuite-ollama-bridge": {
    id: "mcp-netsuite-ollama-bridge",
    title: "MCP NetSuite-Ollama Bridge",
    subtitle: "Natural-Language ERP Queries via a Local LLM",
    description: "A production Model Context Protocol server that lets the marketing team ask NetSuite ERP questions in plain English and get answers back from a locally hosted Ollama LLM — no SQL, no report builder, no data leaving the building.",
    longDescription: `Problem: the marketing team at Ear Science Institute Australia needed answers from NetSuite ERP that lived several clicks deep in saved searches and report builders. Every "what's the status of this contact?" turned into a ticket for someone who knew SuiteScript. The data was sensitive, so a cloud LLM was off the table.

Architecture: an MCP server sits between a local Ollama LLM and NetSuite. A marketing user types a natural-language question into the UI ("Show me details for Jim Brown"). The MCP server interprets the intent, authenticates to NetSuite over OAuth 2.0, and calls a SuiteScript RESTlet that queries the ERP database. The records flow back through the MCP server to the Ollama model, which formats a human-readable answer and returns it to the UI. The whole loop runs on-premises, so customer and lead data never leaves the institute's network.

Trade-offs: v1 was deliberately simple — a single query -> fetch -> answer path that proved the loop end to end. It worked, but it couldn't reason across multiple lookups or handle large result sets gracefully. v2 added a LangGraph multi-step reasoning layer so the agent can chain lookups, plus intelligent chunking to stay inside NetSuite's script governance limits. The cost of that power is complexity: more moving parts to monitor and a longer round-trip for multi-step questions, accepted because the marketing team's questions are rarely single-hop.

Impact: marketing self-serves ERP answers in plain English instead of filing tickets, and because inference is local, sensitive contact data stays on-premises. The system runs in production at ESIA.`,
    tech: ["MCP", "Ollama", "NetSuite", "SuiteScript", "LangGraph", "OAuth 2.0", "Python"],
    category: "AI Engineering",
    timeline: "Production (ongoing)",
    team: "1 developer (Senior Systems Developer @ ESIA)",
    features: [
      "Natural-language ERP queries — marketing asks questions in plain English, no SQL or saved searches",
      "MCP server bridging a local Ollama LLM to NetSuite over a typed tool interface",
      "OAuth 2.0 authentication to NetSuite with SuiteScript RESTlet query execution",
      "Six-step loop: UI question -> MCP server -> auth -> RESTlet DB query -> Ollama -> formatted answer",
      "LangGraph multi-step reasoning (v2) for chaining lookups across records",
      "Intelligent chunking and batching to respect NetSuite's script governance limits",
      "On-premises inference — sensitive contact and lead data never leaves the network",
      "System-prompt-level entity definitions to keep ERP concepts unambiguous",
    ],
    challenges: [
      "NetSuite script execution and governance limits choked on large datasets, stalling queries mid-flight",
      "The LLM conflated NetSuite leads with customers, returning the wrong records for ambiguous names",
      "Large result sets exceeded what a single RESTlet call could return within governance limits",
    ],
    results: [
      "Batching at 250 records per call plus query optimization restored throughput inside NetSuite's execution limits",
      "Explicit lead-vs-customer definitions in the system prompt disambiguated the two record types",
      "Pagination through batches enabled queries over large datasets that previously timed out",
    ],
    gradient: "from-blue-500 to-violet-600",
    gridTitle: "MCP NetSuite-Ollama Bridge",
    gridDescription: "Production MCP server letting marketing query NetSuite ERP in plain English via a local Ollama LLM — sensitive data never leaves the building. v2 adds LangGraph reasoning.",
    gridTech: ["MCP", "Ollama", "NetSuite", "LangGraph"],
    gridCategory: "AI Engineering",
    seoName: "MCP NetSuite-Ollama Bridge",
    seoDescription: "Production MCP server connecting a local Ollama LLM to NetSuite ERP, enabling natural-language queries with on-premises inference and LangGraph multi-step reasoning",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.8,
  },
  "linkedin-job-auto-apply-agent": {
    id: "linkedin-job-auto-apply-agent",
    title: "LinkedIn Job Auto-Apply Agent",
    subtitle: "Autonomous Job-Application Workflow",
    description: "A personal AI agent that automates the repetitive parts of applying for jobs on LinkedIn — finding matching roles, tailoring inputs, and driving the application flow end to end.",
    longDescription: `Applying for jobs on LinkedIn is mostly the same handful of steps repeated dozens of times: filter to relevant roles, open each posting, fill the same fields, and submit. This personal project wraps that loop in an AI agent so the tedious mechanics run on their own while the human stays in control of which roles matter.

The agent drives the LinkedIn application flow as an automation pipeline: it walks job listings, evaluates whether a role fits, and orchestrates the steps an applicant would otherwise click through by hand. The design intent is an agent that handles the mechanical repetition rather than a black box that fires off blind applications — the matching and decision logic is where the AI earns its keep.

Built as a personal experiment in agentic automation, it explores how far a single agent can carry a real, multi-step web workflow before a human needs to step back in.`,
    tech: ["AI Agents", "Automation", "Python"],
    category: "AI Agents",
    timeline: "Personal project",
    team: "1 developer (personal project)",
    features: [
      "Automated walk-through of LinkedIn job listings",
      "Role-fit evaluation to filter out irrelevant postings before applying",
      "Orchestration of the multi-step application flow as a single agent pipeline",
      "Human-in-the-loop control over which roles the agent acts on",
      "Agentic decision logic separating matching from the mechanical submission steps",
    ],
    challenges: [
      "Driving a multi-step web application flow reliably without brittle hard-coded paths",
      "Deciding which roles are worth applying to rather than blindly submitting everything",
      "Keeping a human in control of intent while automating the repetitive mechanics",
    ],
    results: [
      "A working agent that automates the repetitive LinkedIn application loop end to end",
      "Demonstrates agentic orchestration of a real, multi-step web workflow",
      "Separates AI-driven role matching from the deterministic submission steps",
    ],
    gradient: "from-violet-500 to-purple-600",
    gridTitle: "LinkedIn Job Auto-Apply Agent",
    gridDescription: "Personal AI agent that automates the repetitive LinkedIn job-application loop — matching roles and driving the flow end to end, human in control of intent.",
    gridTech: ["AI Agents", "Automation", "Python"],
    gridCategory: "AI Agents",
    sitemapPriority: 0.7,
  },
  "self-learning-social-media-generator": {
    id: "self-learning-social-media-generator",
    title: "Self-Learning Social Media Generator",
    subtitle: "Content Generation with Feedback Loops",
    description: "A personal LLM-driven content generator that produces social media posts and improves over time by feeding outcome signals back into its own generation loop.",
    longDescription: `Most content generators are one-shot: prompt in, post out, no memory of what worked. This personal project asks a different question — what if the generator learned from its own results? It pairs an LLM content engine with feedback loops so each round of output informs the next.

The system generates social media content from an LLM, then closes the loop by capturing signals about how that content performed and folding them back into subsequent generation. The design intent is a generator that drifts toward what resonates rather than producing the same generic posts forever — a small, self-improving content pipeline rather than a static template filler.

As a personal experiment, the focus is the feedback architecture itself: how to represent "what worked," how to feed it back without overfitting to noise, and how to keep the LLM's output fresh while steering it with accumulated signal.`,
    tech: ["LLM", "Feedback Loops", "Content Generation", "Python"],
    category: "AI Agents",
    timeline: "Personal project",
    team: "1 developer (personal project)",
    features: [
      "LLM-driven generation of social media content",
      "Feedback loop that captures outcome signals from generated posts",
      "Signal fed back into subsequent generation to steer future output",
      "Self-improving pipeline that drifts toward what resonates over time",
      "Architecture focused on representing and reusing 'what worked'",
    ],
    challenges: [
      "Representing 'what worked' in a form the generator can actually learn from",
      "Folding feedback into generation without overfitting to noisy signals",
      "Keeping LLM output fresh while steering it with accumulated signal",
    ],
    results: [
      "A content generator that improves its output across generation rounds",
      "Demonstrates a closed feedback loop wrapped around an LLM content engine",
      "Explores self-improvement as a content-pipeline design pattern",
    ],
    gradient: "from-emerald-500 to-teal-600",
    gridTitle: "Self-Learning Social Media Generator",
    gridDescription: "Personal LLM content generator with feedback loops — captures what resonates and folds it back into generation, drifting toward better output over time.",
    gridTech: ["LLM", "Feedback Loops", "Python"],
    gridCategory: "AI Agents",
    sitemapPriority: 0.7,
  },
  "n8n-marketing-research-workflows": {
    id: "n8n-marketing-research-workflows",
    title: "n8n Marketing Research Workflows",
    subtitle: "Automated Marketing Research Pipelines",
    description: "Production n8n automation workflows that run marketing research on autopilot — pulling, enriching, and routing data across APIs so the team works from fresh insights instead of manual collection.",
    longDescription: `Marketing research is full of repetitive collection work: pulling data from one service, enriching it with another, and routing the result somewhere useful. This work project moves that grind into n8n so the workflows run on a schedule instead of consuming an analyst's afternoon.

The workflows orchestrate marketing research as connected automation pipelines — chaining API calls, transforming the data between steps, and delivering the output where the team needs it. n8n's visual workflow engine makes the pipelines transparent and maintainable: each step is inspectable, and integrations slot in without bespoke glue code for every new source.

Built as part of real marketing operations, the emphasis is reliability and maintainability — workflows that keep running, handle the inevitable API quirks between services, and stay easy to extend as research needs change.`,
    tech: ["n8n", "Automation", "APIs"],
    category: "Automation",
    timeline: "Work project",
    team: "1 developer (work project)",
    features: [
      "n8n workflows automating marketing research collection and enrichment",
      "API orchestration chaining multiple services into a single pipeline",
      "Data transformation between workflow steps",
      "Scheduled runs that deliver fresh insights without manual collection",
      "Visual, inspectable workflows that stay maintainable as needs change",
    ],
    challenges: [
      "Chaining multiple marketing APIs into a reliable end-to-end pipeline",
      "Handling the data-shape quirks and rate limits that differ across services",
      "Keeping workflows maintainable and extensible as research needs evolve",
    ],
    results: [
      "Marketing research collection moved from manual effort to scheduled automation",
      "Multiple APIs orchestrated into connected, inspectable n8n pipelines",
      "Workflows that stay easy to extend as new data sources are added",
    ],
    gradient: "from-amber-500 to-orange-600",
    gridTitle: "n8n Marketing Research Workflows",
    gridDescription: "Production n8n workflows automating marketing research — chaining APIs, enriching data, and routing fresh insights to the team on a schedule.",
    gridTech: ["n8n", "Automation", "APIs"],
    gridCategory: "Automation",
    sitemapPriority: 0.8,
  },
  "healthcare-voice-agent": {
    id: "healthcare-voice-agent",
    title: "Healthcare Voice Agent (Architecture)",
    subtitle: "Voice-AI Agent Architecture for Healthcare",
    description: "An architecture and design study for a voice-AI agent in a healthcare setting — mapping how local LLM inference, a service API, and workflow automation fit together for a privacy-sensitive domain.",
    longDescription: `Healthcare is exactly the kind of domain where a voice agent is useful and where the usual cloud-LLM shortcuts are hardest to justify — the data is sensitive and the failure modes matter. This project is the architecture and design work for such an agent rather than a shipped product: a blueprint for how the pieces fit.

The design centers on a voice interface backed by local LLM inference via Ollama, a FastAPI service layer to mediate between the voice front end and back-end logic, and n8n to orchestrate the workflows that surround a conversation. Keeping inference local is the deliberate choice for a healthcare context — it keeps sensitive interactions on-premises rather than shipping audio and transcripts to a third party.

As an architecture study, the value is in the decisions: where the boundaries sit, how voice, model, API, and automation layers communicate, and which trade-offs a privacy-sensitive healthcare deployment forces. It documents intent and structure so a future implementation starts from a considered design rather than a blank page.`,
    tech: ["Voice AI", "Ollama", "FastAPI", "n8n"],
    category: "AI Engineering",
    timeline: "Architecture / design",
    team: "1 developer (architecture study)",
    features: [
      "Voice-AI agent architecture targeted at a healthcare setting",
      "Local LLM inference via Ollama to keep sensitive interactions on-premises",
      "FastAPI service layer mediating between the voice front end and back-end logic",
      "n8n workflow orchestration around the conversation flow",
      "Documented layer boundaries and inter-layer communication design",
    ],
    challenges: [
      "Designing for a privacy-sensitive healthcare domain where cloud inference is hard to justify",
      "Defining clean boundaries between the voice, model, API, and automation layers",
      "Reasoning about failure modes that matter more in a healthcare context",
    ],
    results: [
      "A considered architecture for a healthcare voice agent rather than an ad-hoc build",
      "Local-inference design that keeps sensitive interactions on-premises",
      "Documented layer structure and trade-offs to seed a future implementation",
    ],
    gradient: "from-cyan-500 to-blue-600",
    gridTitle: "Healthcare Voice Agent (Architecture)",
    gridDescription: "Architecture study for a privacy-sensitive healthcare voice agent — local Ollama inference, a FastAPI service layer, and n8n orchestration, keeping data on-premises.",
    gridTech: ["Voice AI", "Ollama", "FastAPI"],
    gridCategory: "AI Engineering",
    sitemapPriority: 0.7,
  },
} satisfies Record<string, Project>;

// Ordered superset array (detail-map order). This is the canonical list; every
// projection below derives from it so nothing drifts.
export const projectList: Project[] = Object.values(projects);

// O(1) resolver for any of the 7 ids.
export const getProject = (id: string): Project | undefined => projects[id as keyof typeof projects];

// ---------------------------------------------------------------------------
// Projections — each reproduces ONE consumer's exact current set + order.
// The sources DIVERGE (6 grid / 7 detail / 6 itemList / 7 sitemap); these
// projections preserve that divergence verbatim. Do NOT collapse into one list.
// ---------------------------------------------------------------------------

// Home grid (src/app/page.tsx) — 6 projects, modern-portfolio ABSENT, in order.
export const homeGridProjects: Project[] = [
  "ai-backoffice-construction",
  "property-agency-ems",
  "lakestone-esign",
  "mcp-netsuite-ollama-bridge",
  "n8n-marketing-research-workflows",
  "kashmir-fund",
  "linkedin-job-auto-apply-agent",
  "self-learning-social-media-generator",
  "healthcare-voice-agent",
  "n8n-automation",
  "voice-ai-agent",
  "erp-system",
  "netsuite-integration",
  "cloud-infrastructure",
].map((id) => getProject(id)!);

// JSON-LD ItemList (src/app/layout.tsx) — 6 projects, kashmir-fund ABSENT, in
// the curated order the schema emits (n8n first, modern-portfolio last).
export const itemListProjects: Project[] = [
  "ai-backoffice-construction",
  "property-agency-ems",
  "lakestone-esign",
  "mcp-netsuite-ollama-bridge",
].map((id) => getProject(id)!);

// Sitemap (src/app/sitemap.ts) — 7 /projects/<slug> URLs with priorities, in
// emitted order. (The plan prose said "8"; the verified live sitemap and the
// frozen baseline.json both have exactly 7 — reality wins.)
export const sitemapProjects: { id: string; priority: number }[] = [
  { id: "ai-backoffice-construction", priority: 0.9 },
  { id: "property-agency-ems", priority: 0.9 },
  { id: "lakestone-esign", priority: 0.9 },
  { id: "n8n-automation", priority: 0.5 },
  { id: "voice-ai-agent", priority: 0.5 },
  { id: "erp-system", priority: 0.5 },
  { id: "netsuite-integration", priority: 0.5 },
  { id: "cloud-infrastructure", priority: 0.5 },
  { id: "modern-portfolio", priority: 0.7 },
  { id: "kashmir-fund", priority: 0.7 },
  // Phase 02 (AICON-04): 5 new AI projects appended -> 12 /projects/ URLs.
  { id: "mcp-netsuite-ollama-bridge", priority: 0.8 },
  { id: "linkedin-job-auto-apply-agent", priority: 0.7 },
  { id: "self-learning-social-media-generator", priority: 0.7 },
  { id: "n8n-marketing-research-workflows", priority: 0.8 },
  { id: "healthcare-voice-agent", priority: 0.7 },
];
