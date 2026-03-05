import type { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Web Development & SEO Services I Provide | Perth Full Stack Developer",
  description: "Professional web development services in Perth: custom web applications, AI integration, e-commerce platforms, mobile apps, and enterprise solutions. Serving Perth metro and all of Australia.",
  keywords: [
    "web development services Perth",
    "custom web applications Perth",
    "AI integration services",
    "e-commerce development Perth",
    "mobile app development Perth",
    "enterprise web solutions",
    "API development Perth",
    "full stack developer services",
    "web app developer Perth",
    "hire developer Perth",
    "custom web solutions Perth",
    "business automation Perth",
    "Perth web development company",
    "software development services Perth"
  ],
  openGraph: {
    title: "Professional Web Development Services | Perth, Australia",
    description: "Expert web development services in Perth: custom applications, AI integration, e-commerce platforms. Serving businesses across Australia with modern solutions.",
  },
};

const services = [
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

const processSteps = [
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

export default function ServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Web Development Services Perth",
    "description": "Professional web development and software engineering services in Perth, Western Australia",
    "provider": {
      "@type": "Person",
      "name": "Usama Javed",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Perth",
        "addressRegion": "WA",
        "addressCountry": "AU"
      }
    },
    "areaServed": {
      "@type": "State",
      "name": "Western Australia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Development Services",
      "itemListElement": services.flatMap(category =>
        category.items.map(service => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.name,
            "description": service.description
          }
        }))
      )
    }
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Web Development & SEO Services I Provide
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Expert full stack development services in Perth, Western Australia.
              Custom web applications, AI integration, and enterprise solutions for businesses across Australia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Free Consultation
              </a>
              <a
                href="#services"
                className="border border-white hover:bg-white hover:text-slate-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View All Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Complete Web Development Solutions for Perth Businesses
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              From simple websites to complex enterprise applications, I provide end-to-end web development
              services using the latest technologies and industry best practices.
            </p>
          </div>

          {services.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{category.category}</h3>
              <p className="text-slate-600 mb-8">{category.description}</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
                    <h4 className="text-xl font-semibold text-slate-900 mb-3">{service.name}</h4>
                    <p className="text-slate-600 mb-4">{service.description}</p>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-slate-900 mb-2">Key Features:</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium text-slate-900">Timeline: </span>
                          <span className="text-slate-600">{service.timeframe}</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">From: </span>
                          <span className="text-green-600 font-semibold">{service.priceRange}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              How I Work With Perth Clients
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              A proven development process that ensures your project is delivered on time,
              within budget, and exceeds your expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Web Development Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get a free consultation and detailed proposal for your Perth business.
            No obligation, just expert advice and transparent pricing.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors"
          >
            Start Your Project Today
          </a>
        </div>
      </section>
    </div>
  );
}