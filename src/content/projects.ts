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
    title: "N8N Automation Platform",
    subtitle: "Enterprise Workflow Automation",
    description: "A comprehensive automation platform built with N8N that connects over 200+ services and applications, enabling businesses to streamline their workflows and eliminate manual processes.",
    longDescription: `This enterprise-grade automation platform revolutionizes how businesses handle repetitive tasks and data integration. Built on N8N's powerful workflow engine, the system provides a visual interface for creating complex automation workflows that span multiple applications and services.

    The platform features advanced error handling, retry mechanisms, and comprehensive logging to ensure reliability in mission-critical business processes. Custom nodes were developed to handle specific business logic and integrate with proprietary systems.

    Key achievements include reducing manual data entry by 90%, improving process efficiency by 300%, and enabling 24/7 automated operations across multiple departments.`,
    tech: ["N8N", "Node.js", "PostgreSQL", "Docker", "Redis", "REST APIs", "Webhooks", "OAuth 2.0"],
    category: "Automation",
    timeline: "6 months",
    team: "3 developers",
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
      "90% reduction in manual data entry across departments",
      "300% improvement in process efficiency",
      "24/7 automated operations with 99.9% uptime",
      "Saved 40+ hours per week of manual work"
    ],
    gradient: "from-blue-500 to-purple-600",
    gridTitle: "N8N Automation Platform",
    gridDescription: "A mining company was losing 120 hrs/week to manual data entry across 8 systems. Built automation that cut that by 70% and saved $180K/year.",
    gridTech: ["N8N", "Node.js", "PostgreSQL", "Docker"],
    gridCategory: "Automation",
    seoName: "Enterprise N8N Automation Platform",
    seoDescription: "Workflow automation platform reducing manual processes by 70% and saving $180,000/year for a Perth mining company",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.8,
  },
  "voice-ai-agent": {
    id: "voice-ai-agent",
    title: "Voice AI Booking Agent",
    subtitle: "Intelligent Appointment Scheduling",
    description: "An AI-powered voice assistant that handles appointment scheduling, customer inquiries, and booking management through natural language conversations.",
    longDescription: `This sophisticated voice AI agent transforms customer service and appointment booking through natural language processing and machine learning. The system understands complex scheduling requests, manages calendar conflicts, and provides intelligent responses to customer inquiries.

    Built with OpenAI's latest models, the agent can handle multi-turn conversations, understand context, and make intelligent decisions about scheduling conflicts and customer preferences. The system integrates with popular calendar applications and CRM systems.

    The voice interface uses advanced speech-to-text and text-to-speech technologies to provide a seamless conversational experience that rivals human interaction quality.`,
    tech: ["OpenAI GPT-4", "Speech-to-Text", "Text-to-Speech", "Node.js", "WebRTC", "Socket.io", "MongoDB", "Express.js"],
    category: "AI/ML",
    timeline: "4 months",
    team: "2 developers + 1 AI specialist",
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
      "95% accuracy in appointment scheduling",
      "60% reduction in call handling time",
      "85% customer satisfaction rate",
      "24/7 availability with no human intervention"
    ],
    gradient: "from-purple-500 to-pink-600",
    gridTitle: "Voice AI Booking Agent",
    gridDescription: "Client was losing 40% of phone bookings to hold times. Built a voice AI using GPT-4 that now handles 500+ bookings/day with zero hold time.",
    gridTech: ["OpenAI", "Whisper", "Node.js", "Twilio"],
    gridCategory: "AI/ML",
    seoName: "Voice AI Booking Agent",
    seoDescription: "AI-powered voice agent handling 500+ daily bookings using OpenAI GPT-4 and Whisper, achieving 35% conversion increase",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.8,
  },
  "erp-system": {
    id: "erp-system",
    title: "Enterprise Resource Planning System",
    subtitle: "Complete Business Management Solution",
    description: "A full-scale ERP solution designed for mid to large enterprises, featuring inventory management, CRM, financial tracking, and comprehensive reporting modules.",
    longDescription: `This comprehensive ERP system provides end-to-end business management capabilities for enterprises looking to streamline their operations. The platform integrates all business processes into a single, cohesive system that provides real-time visibility and control.

    The system features modular architecture allowing businesses to implement components as needed. Each module is designed with scalability in mind, supporting thousands of concurrent users and handling large volumes of transactional data.

    Advanced reporting and analytics provide actionable insights into business performance, helping organizations make data-driven decisions and optimize their operations.`,
    tech: ["React", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "GraphQL", "JWT"],
    category: "Enterprise",
    timeline: "12 months",
    team: "8 developers + 2 designers",
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
      "40% improvement in operational efficiency",
      "Real-time visibility across all business processes",
      "Reduced data entry errors by 75%",
      "Streamlined reporting saving 20+ hours per week"
    ],
    gradient: "from-green-500 to-blue-600",
    gridTitle: "Enterprise ERP System",
    gridDescription: "Mining company running 5 legacy apps that didn't talk to each other. Unified everything into NetSuite for 200+ users with mobile field access.",
    gridTech: ["NetSuite", "SuiteScript", "React", "PostgreSQL"],
    gridCategory: "Enterprise",
    seoName: "Enterprise ERP System",
    seoDescription: "Unified NetSuite ERP replacing 5 legacy systems for 200+ mining company users with real-time dashboards and mobile field access",
    applicationCategory: "BusinessApplication",
    sitemapPriority: 0.8,
  },
  "netsuite-integration": {
    id: "netsuite-integration",
    title: "NetSuite Integration Suite",
    subtitle: "Custom SuiteScripts & RESTlets",
    description: "A comprehensive collection of custom SuiteScripts and RESTlets enabling seamless integration between NetSuite and third-party applications.",
    longDescription: `This integration suite bridges the gap between NetSuite and external systems through custom-built SuiteScripts and RESTlets. The solution enables bidirectional data synchronization, automated business processes, and real-time integrations.

    Each script is designed with performance and reliability in mind, handling large data volumes while maintaining NetSuite's governance limits. The suite includes comprehensive error handling, logging, and monitoring capabilities.

    The RESTlets provide secure API endpoints for external applications to interact with NetSuite data, enabling seamless integration with e-commerce platforms, third-party logistics, and business intelligence tools.`,
    tech: ["SuiteScript 2.0", "RESTlets", "JavaScript", "OAuth 2.0", "JSON", "XML", "Web Services", "NetSuite APIs"],
    category: "Integration",
    timeline: "8 months",
    team: "2 NetSuite developers",
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
      "Automated 80% of manual NetSuite processes",
      "Reduced data synchronization time from hours to minutes",
      "Eliminated data entry errors through automation",
      "Enabled real-time integration with 5+ external systems"
    ],
    gradient: "from-orange-500 to-red-600",
    gridTitle: "NetSuite Integration Suite",
    gridDescription: "Retailer needed 12 systems talking to NetSuite in real-time. Built middleware processing 50K+ transactions/day at 99.99% uptime for 18 months.",
    gridTech: ["SuiteScript", "REST APIs", "Redis", "Docker"],
    gridCategory: "Integration",
    seoName: "NetSuite Integration Suite",
    seoDescription: "Custom middleware connecting 12 business systems with real-time sync, processing 50,000+ daily transactions at 99.99% uptime",
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
    seoDescription: "Next.js 15 portfolio with React 19, Tailwind CSS 4, perfect Lighthouse scores, and comprehensive AI SEO optimization",
    applicationCategory: "WebApplication",
    sitemapPriority: 0.7,
  },
  "cloud-infrastructure": {
    id: "cloud-infrastructure",
    title: "Cloud Infrastructure Platform",
    subtitle: "Scalable Microservices Architecture",
    description: "A robust cloud infrastructure platform featuring microservices architecture, automated CI/CD pipelines, and comprehensive monitoring solutions.",
    longDescription: `This cloud infrastructure platform provides a scalable foundation for modern applications using microservices architecture and DevOps best practices. The platform includes automated provisioning, deployment, monitoring, and scaling capabilities.

    Built on AWS with Infrastructure as Code principles, the platform ensures consistent, repeatable deployments across multiple environments. Container orchestration with Kubernetes provides efficient resource utilization and fault tolerance.

    The comprehensive monitoring and logging system provides real-time insights into application performance and system health, enabling proactive issue resolution and optimization.`,
    tech: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Prometheus", "Grafana", "ELK Stack"],
    category: "DevOps",
    timeline: "10 months",
    team: "4 DevOps engineers + 2 developers",
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
      "99.9% system uptime with automated failover",
      "50% reduction in deployment time",
      "Automated scaling handling 10x traffic spikes",
      "Comprehensive observability across all services"
    ],
    gradient: "from-yellow-500 to-orange-600",
    gridTitle: "Cloud Infrastructure Platform",
    gridDescription: "SaaS startup needed to go from 1K to 100K+ concurrent users. Designed the Kubernetes architecture that got them there at 200ms response times.",
    gridTech: ["AWS EKS", "Docker", "Kubernetes", "Terraform"],
    gridCategory: "DevOps",
    seoName: "Cloud Infrastructure Platform",
    seoDescription: "Kubernetes-based microservices architecture supporting 100K+ concurrent users with 99.99% uptime and 200ms global response",
    applicationCategory: "DeveloperApplication",
    sitemapPriority: 0.8,
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
  "kashmir-fund",
  "n8n-automation",
  "voice-ai-agent",
  "erp-system",
  "netsuite-integration",
  "cloud-infrastructure",
].map((id) => getProject(id)!);

// JSON-LD ItemList (src/app/layout.tsx) — 6 projects, kashmir-fund ABSENT, in
// the curated order the schema emits (n8n first, modern-portfolio last).
export const itemListProjects: Project[] = [
  "n8n-automation",
  "voice-ai-agent",
  "erp-system",
  "netsuite-integration",
  "cloud-infrastructure",
  "modern-portfolio",
].map((id) => getProject(id)!);

// Sitemap (src/app/sitemap.ts) — 7 /projects/<slug> URLs with priorities, in
// emitted order. (The plan prose said "8"; the verified live sitemap and the
// frozen baseline.json both have exactly 7 — reality wins.)
export const sitemapProjects: { id: string; priority: number }[] = [
  { id: "n8n-automation", priority: 0.8 },
  { id: "voice-ai-agent", priority: 0.8 },
  { id: "erp-system", priority: 0.8 },
  { id: "netsuite-integration", priority: 0.8 },
  { id: "cloud-infrastructure", priority: 0.8 },
  { id: "modern-portfolio", priority: 0.7 },
  { id: "kashmir-fund", priority: 0.7 },
];
