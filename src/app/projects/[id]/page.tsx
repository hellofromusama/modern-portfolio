import Link from "next/link";
import { notFound } from "next/navigation";

const projects = {
  "kashmir-fund": {
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
    gradient: "from-green-500 to-orange-600"
  },
  "n8n-automation": {
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
    gradient: "from-blue-500 to-purple-600"
  },
  "voice-ai-agent": {
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
    gradient: "from-purple-500 to-pink-600"
  },
  "erp-system": {
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
    gradient: "from-green-500 to-blue-600"
  },
  "netsuite-integration": {
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
    gradient: "from-orange-500 to-red-600"
  },
  "modern-portfolio": {
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
    gradient: "from-cyan-500 to-blue-600"
  },
  "cloud-infrastructure": {
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
    gradient: "from-yellow-500 to-orange-600"
  }
};

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects[id as keyof typeof projects];

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              UJ
            </Link>
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/#about" className="hover:text-blue-400 transition-all duration-300">About</Link>
              <Link href="/#projects" className="hover:text-blue-400 transition-all duration-300">Projects</Link>
              <Link href="/ideas" className="hover:text-purple-400 transition-all duration-300">Ideas</Link>
              <Link href="/contact" className="hover:text-blue-400 transition-all duration-300">Contact</Link>
              <a
                href="https://www.linkedin.com/in/hellofromusama/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Hire Me →
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/#projects"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
            >
              ← Back to Projects
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                  {project.category}
                </span>
              </div>

              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {project.title}
              </h1>

              <h2 className="text-2xl text-slate-300 mb-8 font-light">
                {project.subtitle}
              </h2>

              <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Timeline</div>
                  <div className="text-lg font-semibold text-blue-400">{project.timeline}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Team Size</div>
                  <div className="text-lg font-semibold text-purple-400">{project.team}</div>
                </div>
              </div>
            </div>

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`h-96 bg-gradient-to-br ${project.gradient} rounded-2xl relative overflow-hidden block group cursor-pointer transition-transform duration-300 hover:scale-105`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    🔗
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <div className="text-white/90 text-lg font-semibold group-hover:text-white transition-colors">
                    🌐 Visit Live Website
                  </div>
                  <div className="text-white/70 text-sm mt-1 group-hover:text-white/90 transition-colors">
                    Click to open →
                  </div>
                </div>
              </a>
            ) : (
              <div className={`h-96 bg-gradient-to-br ${project.gradient} rounded-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6">
                  <div className="text-white/90 text-lg font-semibold">Live Project</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Technology Stack
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {project.tech.map((tech) => (
              <span key={tech} className="px-6 py-3 bg-slate-900/50 border border-slate-600 rounded-full text-slate-300 hover:border-blue-500/50 hover:text-blue-300 transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Project Overview</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                  {project.longDescription}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 text-purple-400">Key Features</h2>
              <div className="space-y-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0" />
                    <p className="text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Results */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-orange-400">Challenges Solved</h2>
              <div className="space-y-6">
                {project.challenges.map((challenge, index) => (
                  <div key={index} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-slate-300">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 text-green-400">Results Achieved</h2>
              <div className="space-y-6">
                {project.results.map((result, index) => (
                  <div key={index} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700 border-l-4 border-l-green-400">
                    <p className="text-slate-300">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Interested in Similar Solutions?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            I can help you build similar high-performance solutions tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              Discuss Your Project
            </Link>
            <Link
              href="/#projects"
              className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 hover:bg-blue-400/10"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}