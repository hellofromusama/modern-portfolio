// Centralized services catalog — the `services` + `processSteps` arrays extracted
// VERBATIM (byte-for-byte text) from src/app/services/page.tsx. Additive
// centralization mirroring the src/content/* pattern so both the server page
// (metadata + Service JSON-LD + sr-only copy) and the client dive experience share
// one source. Pure data module: no "use client", no JSX.

export const services = [
  {
    category: "Web Development & Custom Applications",
    description: "Complete web application development using modern technologies",
    items: [
      {
        name: "Custom Web Applications",
        description: "Tailored web applications built with Next.js, React, and Node.js for optimal performance and scalability",
        features: ["Responsive Design", "Database Integration", "User Authentication", "API Development"],
        timeframe: "4-12 weeks",
        priceRange: "$5,000 - $50,000"
      },
      {
        name: "E-commerce Development",
        description: "Complete online stores with payment processing, inventory management, and customer portals",
        features: ["Payment Gateway Integration", "Inventory Management", "Order Processing", "Customer Accounts"],
        timeframe: "6-16 weeks",
        priceRange: "$8,000 - $75,000"
      },
      {
        name: "Progressive Web Apps (PWA)",
        description: "Fast, reliable web applications that work offline and feel like native mobile apps",
        features: ["Offline Functionality", "Push Notifications", "App-like Experience", "Cross-platform"],
        timeframe: "8-20 weeks",
        priceRange: "$10,000 - $100,000"
      }
    ]
  },
  {
    category: "AI Integration & Automation",
    description: "Cutting-edge AI solutions and business process automation",
    items: [
      {
        name: "AI Chatbot Development",
        description: "Intelligent chatbots using OpenAI GPT models for customer service and lead generation",
        features: ["Natural Language Processing", "24/7 Availability", "Multi-language Support", "CRM Integration"],
        timeframe: "3-8 weeks",
        priceRange: "$3,000 - $25,000"
      },
      {
        name: "Business Process Automation",
        description: "N8N workflow automation connecting your business systems and eliminating manual tasks",
        features: ["Workflow Design", "System Integration", "Data Synchronization", "Automated Reporting"],
        timeframe: "2-12 weeks",
        priceRange: "$2,000 - $50,000"
      },
      {
        name: "Voice AI Solutions",
        description: "Voice-activated applications and phone automation systems for enhanced customer experience",
        features: ["Speech Recognition", "Voice Synthesis", "Phone Integration", "Appointment Booking"],
        timeframe: "4-16 weeks",
        priceRange: "$5,000 - $75,000"
      }
    ]
  },
  {
    category: "Enterprise & Government Solutions",
    description: "Large-scale applications for enterprise and government clients",
    items: [
      {
        name: "Enterprise Resource Planning (ERP)",
        description: "Custom ERP systems for inventory, CRM, financial management, and business intelligence",
        features: ["Multi-module Integration", "Real-time Analytics", "User Management", "Compliance Ready"],
        timeframe: "12-52 weeks",
        priceRange: "$25,000 - $500,000"
      },
      {
        name: "Government Contractor Services",
        description: "Secure, compliant applications for government agencies with security clearance available",
        features: ["Security Compliance", "Accessibility Standards", "Data Sovereignty", "Audit Trails"],
        timeframe: "8-36 weeks",
        priceRange: "$15,000 - $250,000"
      },
      {
        name: "NetSuite Development",
        description: "Custom SuiteScripts, RESTlets, and third-party integrations for NetSuite ERP systems",
        features: ["Custom Scripts", "API Integrations", "Workflow Automation", "Data Migration"],
        timeframe: "2-24 weeks",
        priceRange: "$3,000 - $100,000"
      }
    ]
  }
];

export const processSteps = [
  {
    step: 1,
    title: "Free Consultation",
    description: "Discuss your project requirements, timeline, and budget in a comprehensive 30-minute consultation"
  },
  {
    step: 2,
    title: "Proposal & Planning",
    description: "Receive detailed project proposal with timeline, costs, and technical specifications within 48 hours"
  },
  {
    step: 3,
    title: "Development & Updates",
    description: "Regular progress updates with weekly demos and continuous collaboration throughout development"
  },
  {
    step: 4,
    title: "Testing & Launch",
    description: "Comprehensive testing, deployment, and post-launch support to ensure optimal performance"
  }
];
