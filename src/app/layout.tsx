import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "@/components/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'monospace'],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://usamajaved.com.au'),
  title: {
    default: 'Usama Javed - #1 Full Stack Developer Perth | Expert Web Development Services Australia',
    template: '%s | Usama Javed - Perth\'s Leading Developer'
  },
  description: 'Usama Javed is a Senior Full Stack Developer in Perth, Australia with 8+ years experience and 50+ projects delivered. Specializing in Next.js 15, React 19, AI integration, Node.js, and cloud architecture. Serving government, mining, fintech, and healthcare sectors. Free consultation available.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  colorScheme: 'dark light',
  manifest: '/manifest.json',
  keywords: [
    'Usama Javed Perth',
    '#1 Full Stack Developer Perth',
    'Best Web Developer Perth WA',
    'Top Software Engineer Perth',
    'Leading Perth Programmer',
    'Expert Perth Developer',
    'Professional Perth Coder',
    'Premier Perth Tech Consultant',
    'Elite Perth Software Architect',
    'Master Perth Web Engineer',

    'Next.js 15 Expert Perth',
    'React 19 Specialist Perth',
    'Node.js Master Perth',
    'TypeScript Expert Perth',
    'JavaScript Guru Perth',
    'AI Integration Specialist Perth',
    'Machine Learning Developer Perth',
    'Voice AI Expert Perth',
    'Chatbot Developer Perth',
    'Automation Specialist Perth',

    'N8N Automation Expert Australia',
    'NetSuite Developer Perth',
    'ERP Solutions Perth',
    'Enterprise Developer Perth',
    'Government Contractor Perth',
    'Mining Industry Developer WA',
    'FinTech Developer Australia',
    'E-commerce Developer Perth',
    'Mobile App Developer Perth',
    'Progressive Web App Perth',

    'Perth Web Development Services',
    'Perth Custom Software Development',
    'Perth Digital Solutions',
    'Perth Software Engineering',
    'Perth Application Development',
    'Perth System Integration',
    'Perth Database Development',
    'Perth API Development',
    'Perth Cloud Solutions',
    'Perth DevOps Services',

    'Hire Developer Perth',
    'Freelance Developer Perth',
    'Contract Developer Perth',
    'Remote Developer Australia',
    'Available Developer Perth',
    'Immediate Hire Perth',
    'Perth Developer for Hire',
    'Best Rates Perth Developer',
    'Quality Developer Perth',
    'Reliable Developer Perth',

    'Western Australia Developer',
    'WA Software Engineer',
    'Australian Web Developer',
    'Sydney Remote Developer',
    'Melbourne Remote Developer',
    'Brisbane Remote Developer',
    'Adelaide Remote Developer',
    'Canberra Government Developer',
    'Darwin Remote Developer',
    'Hobart Remote Developer',

    'Modern Web Technologies',
    'Latest Development Frameworks',
    'Cutting-edge Solutions',
    'Performance Optimization',
    'SEO Optimization',
    'Security Implementation',
    'Scalable Architecture',
    'Responsive Design',
    'Cross-platform Development',
    'Full-stack Solutions',

    'Business Automation Perth',
    'Digital Transformation Perth',
    'Process Optimization Perth',
    'Workflow Automation Perth',
    'Integration Solutions Perth',
    'Custom Applications Perth',
    'Enterprise Software Perth',
    'Startup Developer Perth',
    'MVP Development Perth',
    'Prototype Development Perth',

    '8+ Years Experience',
    '50+ Successful Projects',
    'Proven Track Record',
    'Client Satisfaction',
    'On-time Delivery',
    'Budget-friendly',
    'Professional Service',
    'Expert Consultation',
    'Free Initial Consultation',
    'Immediate Availability'
  ],
  authors: [{ name: 'Usama Javed', url: 'https://usamajaved.com' }],
  creator: 'Usama Javed',
  publisher: 'Usama Javed',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://usamajaved.com',
    title: 'Usama Javed - Full Stack Developer | Perth, Australia',
    description: 'Expert Full Stack Developer in Perth, Western Australia. Specializing in modern web technologies, AI integrations, and enterprise solutions.',
    siteName: 'Usama Javed Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Usama Javed - Full Stack Developer Perth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Usama Javed - Full Stack Developer | Perth, Australia',
    description: 'Expert Full Stack Developer in Perth. Specializing in Next.js, React, Node.js, AI, and enterprise solutions.',
    images: ['/og-image.png'],
    creator: '@hellofromusama',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://usamajaved.com',
    languages: {
      'en-AU': 'https://usamajaved.com',
      'en-US': 'https://usamajaved.com',
    },
  },
  category: 'technology',
  verification: {
    google: 'google-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // === SCHEMA.ORG STRUCTURED DATA — COMPREHENSIVE AI SEO ===

  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://usamajaved.com.au/#person',
    name: 'Usama Javed',
    alternateName: ['UJ', 'Usama J', 'hellofromusama'],
    url: 'https://usamajaved.com.au',
    image: {
      '@type': 'ImageObject',
      url: 'https://usamajaved.com.au/profile.jpg',
      width: 400,
      height: 400,
      caption: 'Usama Javed - Senior Full Stack Developer Perth Australia'
    },
    sameAs: [
      'https://github.com/hellofromusama',
      'https://www.linkedin.com/in/hellofromusama/',
      'https://twitter.com/hellofromusama',
      'https://stackoverflow.com/users/hellofromusama',
      'https://dev.to/hellofromusama',
      'https://medium.com/@hellofromusama',
      'https://www.reddit.com/user/hellofromusama',
      'https://www.youtube.com/@hellofromusama',
      'https://www.crunchbase.com/person/usama-javed',
      'https://www.producthunt.com/@hellofromusama',
      'https://hashnode.com/@hellofromusama'
    ],
    jobTitle: 'Senior Full Stack Developer & AI Integration Specialist',
    worksFor: {
      '@type': 'Organization',
      '@id': 'https://usamajaved.com.au/#business',
      name: 'Usama Javed - Full Stack Development Services'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Perth CBD',
      addressLocality: 'Perth',
      addressRegion: 'WA',
      addressCountry: 'AU',
      postalCode: '6000'
    },
    email: 'contact@usamajaved.com',
    knowsAbout: [
      'Full Stack Web Development',
      'React.js', 'React 19',
      'Next.js', 'Next.js 15',
      'Node.js', 'Express.js',
      'TypeScript', 'JavaScript ES6+',
      'Python', 'Django', 'Flask', 'FastAPI',
      'Java', 'Spring Boot',
      'C#', '.NET Core',
      'Go', 'Rust',
      'Vue.js 3', 'Angular 17',
      'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch', 'DynamoDB',
      'AWS', 'Azure', 'Google Cloud Platform',
      'Docker', 'Kubernetes', 'Terraform',
      'CI/CD', 'GitHub Actions', 'GitLab CI',
      'OpenAI API', 'GPT-4', 'Claude API', 'LangChain',
      'Machine Learning', 'TensorFlow', 'PyTorch',
      'Voice AI', 'NLP', 'Computer Vision',
      'N8N Automation',
      'NetSuite', 'SuiteScript', 'ERP Systems',
      'Microservices Architecture',
      'GraphQL', 'REST API Design',
      'Tailwind CSS', 'GSAP', 'Framer Motion',
      'Agile Methodology', 'Scrum'
    ],
    knowsLanguage: [
      { '@type': 'Language', name: 'English', alternateName: 'en' }
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Senior Full Stack Developer',
      occupationLocation: {
        '@type': 'City',
        name: 'Perth',
        containedInPlace: {
          '@type': 'State',
          name: 'Western Australia'
        }
      },
      estimatedSalary: {
        '@type': 'MonetaryAmountDistribution',
        name: 'Competitive Perth market rates',
        currency: 'AUD'
      },
      skills: 'React, Next.js, Node.js, TypeScript, Python, AI/ML, AWS, Docker, Kubernetes, NetSuite',
      responsibilities: 'Full stack development, AI integration, cloud architecture, enterprise solutions, technical consulting',
      qualifications: '8+ years professional experience, 50+ enterprise projects delivered'
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'AWS Solutions Architect'
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'NetSuite Certified Developer'
      }
    ],
    nationality: { '@type': 'Country', name: 'Australia' },
    description: 'Usama Javed is a Senior Full Stack Developer and AI Integration Specialist based in Perth, Western Australia with 8+ years of experience delivering 50+ enterprise projects across government, mining, fintech, and healthcare sectors. He specializes in Next.js 15, React 19, Node.js, TypeScript, AI/ML integration, and cloud-native architectures.',
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Full Stack Web Development',
          description: 'Custom web applications, e-commerce platforms, PWAs, SaaS products built with Next.js, React, Node.js'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI & Machine Learning Integration',
          description: 'OpenAI GPT-4 integration, custom chatbots, Voice AI agents, ML model deployment, LangChain RAG pipelines'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Enterprise Solutions & ERP',
          description: 'NetSuite customization, ERP implementation, government portals, mining industry applications'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Cloud Architecture & DevOps',
          description: 'AWS, Azure, GCP deployment, Docker, Kubernetes orchestration, Terraform IaC, CI/CD pipelines'
        }
      }
    ]
  };

  const profilePageData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://usamajaved.com.au/#profilepage',
    mainEntity: { '@id': 'https://usamajaved.com.au/#person' },
    dateCreated: '2025-01-01',
    dateModified: '2026-04-07',
    name: 'Usama Javed - Senior Full Stack Developer Portfolio',
    description: 'Professional portfolio of Usama Javed, Senior Full Stack Developer & AI Integration Specialist in Perth, Australia',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.hero-summary', '.bio', '.key-skills', 'h1', '.project-summary']
    }
  };

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://usamajaved.com.au/#business',
    name: 'Usama Javed - Full Stack Development & AI Services',
    description: 'Senior Full Stack Developer and AI Integration Specialist offering web development, enterprise solutions, cloud architecture, and AI/ML services in Perth, Western Australia. 8+ years experience, 50+ projects delivered.',
    url: 'https://usamajaved.com.au',
    email: 'contact@usamajaved.com',
    founder: { '@id': 'https://usamajaved.com.au/#person' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Perth CBD',
      addressLocality: 'Perth',
      addressRegion: 'WA',
      postalCode: '6000',
      addressCountry: 'AU'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -31.9505,
      longitude: 115.8605
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],
    priceRange: '$$',
    currenciesAccepted: 'AUD',
    paymentAccepted: 'Bank Transfer, Credit Card, PayPal',
    areaServed: [
      { '@type': 'City', name: 'Perth' },
      { '@type': 'State', name: 'Western Australia' },
      { '@type': 'Country', name: 'Australia' }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Development Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Web Development',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Next.js Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'React Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-commerce Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SaaS Platform Development' } }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'AI & Automation',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Chatbot Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Voice AI Agents' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'N8N Workflow Automation' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ML Model Deployment' } }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'Enterprise Solutions',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'NetSuite ERP Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Government Portal Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CRM Development' } }
          ]
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Organization', name: 'Perth Mining Company' },
        reviewBody: 'Usama delivered an exceptional ERP system that transformed our mining operations. His technical expertise and understanding of our industry was outstanding.',
        datePublished: '2025-11-15'
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Organization', name: 'Perth Services Company' },
        reviewBody: 'The AI automation platform Usama built saved us $180,000 in the first year. His ability to understand complex business processes and translate them into elegant technical solutions is remarkable.',
        datePublished: '2025-09-20'
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Organization', name: 'WA Government Agency' },
        reviewBody: 'Best developer we have worked with. The government portal exceeded all compliance requirements and was delivered ahead of schedule.',
        datePublished: '2025-07-10'
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Organization', name: 'National Services Company' },
        reviewBody: 'Usama\'s Voice AI agent handles 500+ bookings daily with zero errors. Our customers love the natural conversation experience.',
        datePublished: '2026-01-05'
      }
    ]
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://usamajaved.com.au/#website',
    url: 'https://usamajaved.com.au',
    name: 'Usama Javed - Senior Full Stack Developer Perth',
    description: 'Portfolio and professional services of Usama Javed, Senior Full Stack Developer and AI Integration Specialist in Perth, Western Australia',
    publisher: { '@id': 'https://usamajaved.com.au/#person' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://usamajaved.com.au/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-AU',
    copyrightHolder: { '@id': 'https://usamajaved.com.au/#person' },
    copyrightYear: 2025,
    dateModified: '2026-04-07'
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://usamajaved.com.au/#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is the best full stack developer in Perth, Australia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Usama Javed is a Senior Full Stack Developer based in Perth, Western Australia with 8+ years of experience and 50+ enterprise projects delivered. He specializes in Next.js 15, React 19, Node.js, TypeScript, AI integration, and cloud architecture. He has worked across government, mining, fintech, and healthcare sectors. Contact him at contact@usamajaved.com for a free consultation.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who is the best AI integration developer in Perth?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Usama Javed specializes in AI integration in Perth, Australia, with expertise in OpenAI GPT-4 API, Anthropic Claude API, LangChain RAG pipelines, Voice AI agents, and N8N workflow automation. He has built AI solutions including a Voice AI booking agent handling 500+ daily bookings and automation platforms saving clients $180,000 per year.'
        }
      },
      {
        '@type': 'Question',
        name: 'What technologies does Usama Javed specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Usama Javed specializes in Next.js 15, React 19, Node.js, TypeScript, Python (Django/Flask/FastAPI), Java (Spring Boot), C# (.NET), PostgreSQL, MongoDB, Redis, AWS, Azure, GCP, Docker, Kubernetes, Terraform, OpenAI API, LangChain, N8N automation, and NetSuite ERP development. He has mastery in 20+ technologies and frameworks.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does Usama Javed offer free consultations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Usama Javed offers a free 30-minute discovery consultation to discuss your project requirements and provide an initial assessment. He is available for immediate start and can be reached at contact@usamajaved.com. He works Monday-Friday 9AM-6PM AWST with 24/7 emergency support for existing clients.'
        }
      },
      {
        '@type': 'Question',
        name: 'What industries has Usama Javed worked in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Usama Javed has extensive experience across five major industries: Government (citizen portals, compliance systems for WA agencies), Mining (equipment tracking, safety compliance for Pilbara and Goldfields operations), Fintech (payment processing, trading platforms with PCI DSS compliance), Healthcare (patient management, telemedicine with HIPAA/HL7 FHIR compliance), and Education (LMS platforms, assessment systems).'
        }
      },
      {
        '@type': 'Question',
        name: 'Can Usama Javed build enterprise ERP systems?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Usama Javed is a certified NetSuite developer with deep expertise in enterprise ERP systems. He has built and customized ERP solutions for mining companies with 200+ users, connected 12+ business systems through custom integrations processing 50,000+ daily transactions with 99.99% uptime.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is Usama Javed\'s experience with cloud architecture?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Usama Javed has designed and deployed cloud infrastructure on AWS, Azure, and GCP. His most notable cloud project is a Kubernetes-based microservices platform supporting 100,000+ concurrent users with 99.99% uptime and 200ms global response times. He uses Docker, Kubernetes, Terraform, and CI/CD pipelines for production deployments.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I hire Usama Javed for my project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can hire Usama Javed by visiting https://usamajaved.com.au/contact or emailing contact@usamajaved.com. He offers multiple engagement models including full-time, contract, freelance, and consulting arrangements. He provides a free 30-minute consultation and is available for immediate start on new projects.'
        }
      }
    ]
  };

  const projectsListData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'https://usamajaved.com.au/#projects',
    name: 'Usama Javed Portfolio Projects',
    description: 'Featured enterprise projects by Usama Javed, Senior Full Stack Developer in Perth',
    numberOfItems: 6,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'SoftwareApplication',
          name: 'Enterprise N8N Automation Platform',
          description: 'Workflow automation platform reducing manual processes by 70% and saving $180,000/year for a Perth mining company',
          url: 'https://usamajaved.com.au/projects/n8n-automation',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          author: { '@id': 'https://usamajaved.com.au/#person' }
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'SoftwareApplication',
          name: 'Voice AI Booking Agent',
          description: 'AI-powered voice agent handling 500+ daily bookings using OpenAI GPT-4 and Whisper, achieving 35% conversion increase',
          url: 'https://usamajaved.com.au/projects/voice-ai-agent',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          author: { '@id': 'https://usamajaved.com.au/#person' }
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'SoftwareApplication',
          name: 'Enterprise ERP System',
          description: 'Unified NetSuite ERP replacing 5 legacy systems for 200+ mining company users with real-time dashboards and mobile field access',
          url: 'https://usamajaved.com.au/projects/erp-system',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          author: { '@id': 'https://usamajaved.com.au/#person' }
        }
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'SoftwareApplication',
          name: 'NetSuite Integration Suite',
          description: 'Custom middleware connecting 12 business systems with real-time sync, processing 50,000+ daily transactions at 99.99% uptime',
          url: 'https://usamajaved.com.au/projects/netsuite-integration',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          author: { '@id': 'https://usamajaved.com.au/#person' }
        }
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'SoftwareApplication',
          name: 'Cloud Infrastructure Platform',
          description: 'Kubernetes-based microservices architecture supporting 100K+ concurrent users with 99.99% uptime and 200ms global response',
          url: 'https://usamajaved.com.au/projects/cloud-infrastructure',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
          author: { '@id': 'https://usamajaved.com.au/#person' }
        }
      },
      {
        '@type': 'ListItem',
        position: 6,
        item: {
          '@type': 'SoftwareApplication',
          name: 'Modern Portfolio Website',
          description: 'Next.js 15 portfolio with React 19, Tailwind CSS 4, perfect Lighthouse scores, and comprehensive AI SEO optimization',
          url: 'https://usamajaved.com.au/projects/modern-portfolio',
          applicationCategory: 'WebApplication',
          operatingSystem: 'Web',
          author: { '@id': 'https://usamajaved.com.au/#person' }
        }
      }
    ]
  };

  const speakableData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://usamajaved.com.au/#webpage',
    name: 'Usama Javed - Senior Full Stack Developer Perth, Australia',
    description: 'Senior Full Stack Developer and AI Integration Specialist based in Perth, Western Australia. 8+ years experience, 50+ enterprise projects.',
    url: 'https://usamajaved.com.au',
    isPartOf: { '@id': 'https://usamajaved.com.au/#website' },
    about: { '@id': 'https://usamajaved.com.au/#person' },
    dateModified: '2026-04-07',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        'h1',
        '.hero-description',
        '.bio-summary',
        '.key-skills-summary',
        '.project-highlights',
        '.cta-section'
      ]
    },
    mainEntity: { '@id': 'https://usamajaved.com.au/#person' }
  };

  return (
    <html lang="en-AU">
      <head>
        <meta name="geo.region" content="AU-WA" />
        <meta name="geo.placename" content="Perth" />
        <meta name="geo.position" content="-31.9505;115.8605" />
        <meta name="ICBM" content="-31.9505, 115.8605" />
        <meta name="DC.title" content="Usama Javed - Full Stack Developer Perth" />
        <meta name="DC.creator" content="Usama Javed" />
        <meta name="DC.subject" content="Web Development, Software Engineering, Perth, Australia" />
        <meta name="DC.description" content="Expert Full Stack Developer in Perth, Western Australia" />
        <meta name="DC.publisher" content="Usama Javed" />
        <meta name="DC.contributor" content="Usama Javed" />
        <meta name="DC.date" content="2026-04-07" />
        <meta name="DC.type" content="Portfolio" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content="https://usamajaved.com" />
        <meta name="DC.language" content="en-AU" />
        <meta name="DC.coverage" content="Perth, Western Australia" />
        <meta name="DC.rights" content="Copyright 2026 Usama Javed" />
        <meta name="article:modified_time" content="2026-04-07T08:00:00+08:00" />
        <meta name="article:author" content="Usama Javed" />
        <meta name="rating" content="general" />
        <meta name="referrer" content="origin-when-cross-origin" />

        {/* Person Schema - Core Identity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
        />
        {/* ProfilePage Schema - Portfolio Page Type */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageData) }}
        />
        {/* ProfessionalService Schema - Business & Reviews */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
        />
        {/* WebSite Schema - Site-level */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
        {/* FAQPage Schema - AI Q&A Optimization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
        {/* ItemList Schema - Projects Portfolio */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsListData) }}
        />
        {/* WebPage + Speakable Schema - Voice AI */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableData) }}
        />
        {/* RSS Feed Discovery */}
        <link rel="alternate" type="application/rss+xml" title="Usama Javed - Developer Blog" href="/feed.xml" />
        {/* AI Discovery Files */}
        <link rel="author" href="/humans.txt" />
        <link rel="me" href="https://github.com/hellofromusama" />
        <link rel="me" href="https://www.linkedin.com/in/hellofromusama/" />
        <link rel="me" href="https://x.com/hellofromusama" />
        {/* AI Discovery Hints */}
        <meta name="ai:llms_txt" content="https://usamajaved.com.au/llms.txt" />
        <meta name="ai:llms_full" content="https://usamajaved.com.au/llms-full.txt" />
        <meta name="ai:context" content="https://usamajaved.com.au/llms-ctx-full.txt" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased flex flex-col min-h-screen`}
      >
        <div className="flex-1">
          {children}
        </div>
        <ConditionalFooter />
      </body>
    </html>
  );
}
