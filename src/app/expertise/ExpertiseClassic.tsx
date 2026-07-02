interface Technology {
  name: string;
  level: string;
  experience: string;
  specializations: string[];
  projects?: string;
  achievements?: string[];
  certifications?: string;
}

interface Sector {
  name: string;
  level: string;
  experience: string;
  applications: string[];
  achievements?: string[];
}

interface ExpertiseCategory {
  category: string;
  description: string;
  technologies?: Technology[];
  sectors?: Sector[];
}

const technicalExpertise: Record<string, ExpertiseCategory> = {
  "frontend_mastery": {
    "category": "Frontend Development Excellence",
    "description": "Cutting-edge frontend technologies with performance and accessibility focus",
    "technologies": [
      {
        "name": "Next.js 15",
        "level": "Expert/Master",
        "experience": "4+ years",
        "specializations": [
          "Server-side Rendering (SSR)",
          "Static Site Generation (SSG)",
          "App Router & Pages Router",
          "Incremental Static Regeneration",
          "API Routes & Middleware",
          "Performance Optimization",
          "SEO Optimization",
          "Core Web Vitals",
          "Image Optimization",
          "Font Optimization",
          "Bundle Analysis"
        ],
        "projects": "25+ Next.js applications",
        "achievements": [
          "Lighthouse scores 95+",
          "Core Web Vitals optimization",
          "Enterprise-grade applications",
          "E-commerce platforms",
          "Multi-tenant systems"
        ]
      },
      {
        "name": "React 19",
        "level": "Expert/Master",
        "experience": "6+ years",
        "specializations": [
          "React Server Components",
          "Concurrent Features",
          "Suspense & Error Boundaries",
          "Custom Hooks Development",
          "Context API & State Management",
          "Performance Optimization",
          "Component Composition",
          "Testing with Jest & React Testing Library",
          "Storybook Development",
          "Micro-frontends",
          "Progressive Web Apps"
        ],
        "projects": "50+ React applications",
        "achievements": [
          "Complex state management",
          "High-performance UIs",
          "Reusable component libraries",
          "Multi-platform applications"
        ]
      },
      {
        "name": "TypeScript",
        "level": "Expert",
        "experience": "5+ years",
        "specializations": [
          "Advanced Type Systems",
          "Generic Programming",
          "Utility Types",
          "Declaration Files",
          "Module Systems",
          "Compiler Configuration",
          "Type Guards & Assertions",
          "Mapped Types",
          "Conditional Types",
          "Template Literal Types"
        ]
      }
    ]
  },

  "backend_mastery": {
    "category": "Backend Development & Architecture",
    "description": "Scalable backend solutions with modern architecture patterns",
    "technologies": [
      {
        "name": "Node.js",
        "level": "Expert",
        "experience": "6+ years",
        "specializations": [
          "Express.js & Fastify",
          "RESTful API Development",
          "GraphQL APIs",
          "WebSocket Implementation",
          "Microservices Architecture",
          "Event-driven Architecture",
          "Stream Processing",
          "Performance Optimization",
          "Memory Management",
          "Clustering & Load Balancing",
          "Security Best Practices"
        ],
        "projects": "40+ backend systems",
        "achievements": [
          "High-throughput APIs",
          "Real-time applications",
          "Distributed systems",
          "Enterprise integrations"
        ]
      },
      {
        "name": "Database Technologies",
        "level": "Expert",
        "experience": "7+ years",
        "specializations": [
          "PostgreSQL (Advanced)",
          "MongoDB (NoSQL)",
          "Redis (Caching)",
          "Elasticsearch",
          "Database Design",
          "Query Optimization",
          "Indexing Strategies",
          "Data Modeling",
          "Migrations & Seeding",
          "Backup & Recovery",
          "Replication & Sharding"
        ]
      }
    ]
  },

  "ai_integration": {
    "category": "AI & Machine Learning Integration",
    "description": "Advanced AI solutions and intelligent automation systems",
    "technologies": [
      {
        "name": "OpenAI Integration",
        "level": "Expert",
        "experience": "3+ years",
        "specializations": [
          "GPT-4 & GPT-3.5 Integration",
          "Chat Completions API",
          "Embeddings & Vector Search",
          "Fine-tuning Models",
          "Function Calling",
          "Streaming Responses",
          "Token Optimization",
          "Context Management",
          "Prompt Engineering",
          "AI Safety & Moderation",
          "Cost Optimization"
        ],
        "projects": "15+ AI-powered applications",
        "achievements": [
          "Intelligent chatbots",
          "Content generation systems",
          "Document processing",
          "Automated workflows"
        ]
      },
      {
        "name": "Voice AI & Speech",
        "level": "Advanced",
        "experience": "2+ years",
        "specializations": [
          "Speech-to-Text Integration",
          "Text-to-Speech Systems",
          "Voice Assistant Development",
          "Phone Automation",
          "Real-time Audio Processing",
          "Voice Recognition",
          "Natural Language Understanding",
          "Conversation Management",
          "Multi-language Support",
          "Voice UI Design"
        ]
      },
      {
        "name": "Business Automation",
        "level": "Expert",
        "experience": "4+ years",
        "specializations": [
          "N8N Workflow Automation",
          "Zapier Integration",
          "Custom Workflow Engines",
          "Process Automation",
          "Data Synchronization",
          "Event-driven Automation",
          "API Orchestration",
          "Monitoring & Alerting",
          "Error Handling",
          "Scalable Automation"
        ]
      }
    ]
  },

  "enterprise_solutions": {
    "category": "Enterprise & Government Solutions",
    "description": "Large-scale systems with security and compliance focus",
    "technologies": [
      {
        "name": "NetSuite Development",
        "level": "Expert",
        "experience": "4+ years",
        "specializations": [
          "SuiteScript 2.1",
          "RESTlets & SuiteTalk",
          "Custom Records & Fields",
          "Workflow Automation",
          "SuiteApp Development",
          "Third-party Integrations",
          "Data Migration",
          "Custom Forms & Reports",
          "Saved Searches",
          "Performance Optimization"
        ],
        "projects": "20+ NetSuite implementations",
        "certifications": "SuiteScript Developer"
      },
      {
        "name": "ERP Systems",
        "level": "Expert",
        "experience": "5+ years",
        "specializations": [
          "Enterprise Resource Planning",
          "Inventory Management",
          "Financial Management",
          "CRM Integration",
          "Supply Chain Management",
          "Reporting & Analytics",
          "Multi-company Support",
          "Role-based Access",
          "Audit Trails",
          "Compliance Management"
        ]
      },
      {
        "name": "Government & Compliance",
        "level": "Advanced",
        "experience": "3+ years",
        "specializations": [
          "Security Clearance Available",
          "WCAG Accessibility",
          "Data Sovereignty",
          "Privacy Act Compliance",
          "Audit Requirements",
          "Secure Development",
          "Penetration Testing",
          "Vulnerability Assessment",
          "Risk Management",
          "Documentation Standards"
        ]
      }
    ]
  },

  "cloud_devops": {
    "category": "Cloud Architecture & DevOps",
    "description": "Modern cloud infrastructure and deployment strategies",
    "technologies": [
      {
        "name": "AWS Cloud Services",
        "level": "Advanced",
        "experience": "4+ years",
        "specializations": [
          "EC2 & Auto Scaling",
          "Lambda Functions",
          "API Gateway",
          "RDS & DynamoDB",
          "S3 & CloudFront",
          "VPC & Security Groups",
          "IAM & Security",
          "CloudWatch Monitoring",
          "CloudFormation",
          "Elastic Beanstalk",
          "Container Services (ECS/EKS)"
        ],
        "certifications": "AWS Cloud Practitioner"
      },
      {
        "name": "Docker & Kubernetes",
        "level": "Advanced",
        "experience": "3+ years",
        "specializations": [
          "Container Development",
          "Docker Compose",
          "Kubernetes Orchestration",
          "Helm Charts",
          "Service Mesh",
          "Monitoring & Logging",
          "Security Scanning",
          "Registry Management",
          "CI/CD Integration",
          "Production Deployment"
        ]
      },
      {
        "name": "CI/CD & DevOps",
        "level": "Advanced",
        "experience": "5+ years",
        "specializations": [
          "GitHub Actions",
          "GitLab CI/CD",
          "Jenkins Pipelines",
          "Automated Testing",
          "Code Quality Gates",
          "Security Scanning",
          "Infrastructure as Code",
          "Monitoring & Alerting",
          "Deployment Strategies",
          "Performance Monitoring"
        ]
      }
    ]
  },

  "industry_expertise": {
    "category": "Industry-Specific Knowledge",
    "description": "Deep understanding of various industry requirements and challenges",
    "sectors": [
      {
        "name": "Mining & Resources (WA)",
        "level": "Expert",
        "experience": "5+ years",
        "applications": [
          "Mine Site Management Systems",
          "Safety Compliance Software",
          "Equipment Tracking",
          "Environmental Monitoring",
          "Worker Management",
          "Reporting & Analytics",
          "Real-time Dashboards",
          "Mobile Applications",
          "Integration with Industrial Systems",
          "Regulatory Compliance"
        ],
        "achievements": [
          "Reduced operational costs by 40%",
          "Improved safety compliance",
          "Real-time monitoring systems",
          "Mobile workforce solutions"
        ]
      },
      {
        "name": "Financial Technology",
        "level": "Advanced",
        "experience": "4+ years",
        "applications": [
          "Payment Processing Systems",
          "Banking Applications",
          "Investment Platforms",
          "Risk Management",
          "Compliance Reporting",
          "Real-time Trading",
          "Fraud Detection",
          "API Banking",
          "Cryptocurrency Integration",
          "Regulatory Compliance"
        ]
      },
      {
        "name": "E-commerce & Retail",
        "level": "Expert",
        "experience": "6+ years",
        "applications": [
          "Custom E-commerce Platforms",
          "Inventory Management",
          "Order Processing",
          "Payment Integration",
          "Customer Management",
          "Analytics & Reporting",
          "Mobile Commerce",
          "Multi-vendor Platforms",
          "Subscription Systems",
          "Recommendation Engines"
        ]
      }
    ]
  }
};

const certifications = [
  {
    "name": "Next.js Expert Certification",
    "issuer": "Vercel",
    "year": "2024",
    "status": "Active"
  },
  {
    "name": "React Advanced Developer",
    "issuer": "Meta",
    "year": "2023",
    "status": "Active"
  },
  {
    "name": "AWS Cloud Practitioner",
    "issuer": "Amazon Web Services",
    "year": "2023",
    "status": "Active"
  },
  {
    "name": "SuiteScript Developer",
    "issuer": "NetSuite/Oracle",
    "year": "2022",
    "status": "Active"
  },
  {
    "name": "Google Cloud Associate",
    "issuer": "Google Cloud",
    "year": "2023",
    "status": "Active"
  }
];

export default function ExpertiseClassic() {
  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
              Technical Expertise & Specializations
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
              Master-level expertise in modern web technologies, AI integration, and enterprise solutions.
              8+ years of proven experience delivering complex projects across various industries.
            </p>
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 font-[family-name:var(--font-space-grotesk)]">50+</div>
                <div style={{ color: 'var(--text-secondary)' }}>Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 font-[family-name:var(--font-space-grotesk)]">8+</div>
                <div style={{ color: 'var(--text-secondary)' }}>Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400 font-[family-name:var(--font-space-grotesk)]">20+</div>
                <div style={{ color: 'var(--text-secondary)' }}>Technologies Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 font-[family-name:var(--font-space-grotesk)]">5</div>
                <div style={{ color: 'var(--text-secondary)' }}>Professional Certifications</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(technicalExpertise).map(([key, category]) => (
            <div key={key} className="mb-20">
              <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">{category.category}</h2>
              <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>{category.description}</p>

              <div className="grid lg:grid-cols-2 gap-8">
                {category.technologies?.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="rounded-xl p-8 transition-all duration-500 hover:-translate-y-1"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold font-[family-name:var(--font-space-grotesk)]">{tech.name}</h3>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {tech.level}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <span className="font-medium">Experience: </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{tech.experience}</span>
                      </div>
                      {tech.projects && (
                        <div>
                          <span className="font-medium">Projects: </span>
                          <span style={{ color: 'var(--text-secondary)' }}>{tech.projects}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Core Specializations</h4>
                      <div className="grid md:grid-cols-2 gap-1 text-sm">
                        {tech.specializations.map((spec, specIndex) => (
                          <div key={specIndex} className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {spec}
                          </div>
                        ))}
                      </div>
                    </div>

                    {tech.achievements && (
                      <div>
                        <h4 className="font-semibold mb-3">Key Achievements</h4>
                        <div className="space-y-1 text-sm">
                          {tech.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-center text-emerald-400">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )) ||
                category.sectors?.map((sector, sectorIndex) => (
                  <div
                    key={sectorIndex}
                    className="rounded-xl p-8 transition-all duration-500 hover:-translate-y-1"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold font-[family-name:var(--font-space-grotesk)]">{sector.name}</h3>
                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {sector.level}
                      </span>
                    </div>

                    <div className="mb-4 text-sm">
                      <span className="font-medium">Experience: </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{sector.experience}</span>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Applications Developed</h4>
                      <div className="grid md:grid-cols-2 gap-1 text-sm">
                        {sector.applications.map((app, appIndex) => (
                          <div key={appIndex} className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                            {app}
                          </div>
                        ))}
                      </div>
                    </div>

                    {sector.achievements && (
                      <div>
                        <h4 className="font-semibold mb-3">Success Stories</h4>
                        <div className="space-y-1 text-sm">
                          {sector.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-center text-blue-400">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center font-[family-name:var(--font-space-grotesk)]">
            Professional Certifications
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="rounded-xl p-6 text-center transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <h3 className="font-semibold mb-2">{cert.name}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{cert.issuer}</p>
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>{cert.year}</span>
                  <span className="bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded">{cert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
            Ready to Leverage This Expertise for Your Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get a free technical consultation to discuss how my expertise can solve your specific challenges.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors"
          >
            Schedule Expert Consultation
          </a>
        </div>
      </section>
    </div>
  );
}