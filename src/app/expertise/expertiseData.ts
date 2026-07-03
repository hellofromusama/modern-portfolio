// Single source of truth for /expertise: the technicalExpertise catalog +
// certifications, extracted VERBATIM from the original page. Imported by BOTH
// page.tsx (metadata JSON-LD + sr-only crawlable copy) and ExpertiseExperience.tsx
// (the space-dive stops) so the schema output stays byte-identical. Pure module.

export interface Technology {
  name: string;
  level: string;
  experience: string;
  specializations: string[];
  projects?: string;
  achievements?: string[];
  certifications?: string;
}

export interface Sector {
  name: string;
  level: string;
  experience: string;
  applications: string[];
  achievements?: string[];
}

export interface ExpertiseCategory {
  category: string;
  description: string;
  technologies?: Technology[];
  sectors?: Sector[];
}

export const technicalExpertise: Record<string, ExpertiseCategory> = {
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

export const certifications = [
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
