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
    template: '%s | Usama Javed - Perth&apos;s Leading Developer'
  },
  description: 'Perth&apos;s #1 Full Stack Developer with 8+ years expertise. Next.js 15, React 19, AI integration specialist. 50+ successful projects. Enterprise solutions, government contractor, mining industry expert. Immediate availability, free consultation. Serving Perth, WA & Australia-wide.',
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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Usama Javed',
    alternateName: 'UJ',
    url: 'https://usamajaved.com',
    image: 'https://usamajaved.com/profile.jpg',
    sameAs: [
      'https://github.com/usamajaved',
      'https://linkedin.com/in/usamajaved',
      'https://twitter.com/usamajaved'
    ],
    jobTitle: 'Full Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Perth',
      addressRegion: 'WA',
      addressCountry: 'AU',
      postalCode: '6000'
    },
    email: 'hellofromusama@gmail.com',
    telephone: '+61-XXX-XXX-XXX',
    knowsAbout: [
      'Web Development',
      'Full Stack Development',
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Python',
      'AI Integration',
      'Machine Learning',
      'N8N Automation',
      'NetSuite',
      'ERP Systems',
      'Cloud Computing',
      'AWS',
      'Docker',
      'Kubernetes'
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'University Name'
    },
    nationality: {
      '@type': 'Country',
      name: 'Australia'
    },
    description: 'Expert Full Stack Developer based in Perth, Western Australia. Specializing in modern web technologies, AI integrations, and enterprise solutions.'
  };

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://usamajaved.com/#business',
    name: 'Usama Javed - Full Stack Development Services',
    description: 'Professional web development and software engineering services in Perth, Western Australia',
    url: 'https://usamajaved.com',
    telephone: '+61-XXX-XXX-XXX',
    email: 'hellofromusama@gmail.com',
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
    openingHours: 'Mo-Fr 09:00-18:00',
    priceRange: '$$',
    areaServed: [
      {
        '@type': 'City',
        name: 'Perth'
      },
      {
        '@type': 'State',
        name: 'Western Australia'
      },
      {
        '@type': 'Country',
        name: 'Australia'
      }
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -31.9505,
        longitude: 115.8605
      },
      geoRadius: '50000'
    }
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://usamajaved.com/#website',
    url: 'https://usamajaved.com',
    name: 'Usama Javed Portfolio',
    description: 'Portfolio website of Usama Javed, Full Stack Developer in Perth, Australia',
    publisher: {
      '@type': 'Person',
      name: 'Usama Javed'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://usamajaved.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-AU'
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
        <meta name="DC.date" content="2025-01-28" />
        <meta name="DC.type" content="Portfolio" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content="https://usamajaved.com" />
        <meta name="DC.language" content="en-AU" />
        <meta name="DC.coverage" content="Perth, Western Australia" />
        <meta name="DC.rights" content="Copyright 2025 Usama Javed" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
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
