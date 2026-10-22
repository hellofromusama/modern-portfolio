import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "@/components/ConditionalFooter";
import SpaceModeLauncher from "@/components/SpaceModeLauncher";
import { buildItemListSchema } from "@/content/seo";

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
  metadataBase: new URL('https://www.usamajaved.com.au'),
  title: {
    default: 'Usama Javed - Forward Deployed Engineer & AI Engineer | Perth, Australia',
    template: '%s | Usama Javed - AI Engineer Perth'
  },
  description: 'Usama Javed is a Forward Deployed Engineer and Lead AI Engineer at Lakestone AI in Perth, Western Australia. AI-native back-office software: Gemini extraction with LLM-as-judge, agents with human escalation, Supabase RLS, NetSuite and SimPro integrations. TypeScript, Bun, Hono, React. 8+ years full-stack.',
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
    'Usama Javed',
    'AI Engineer Perth',
    'Forward Deployed Engineer Perth',
    'Forward Deployed Engineer Australia',
    'LLM Engineer Perth',
    'AI Agents Developer Perth',
    'Full Stack Developer Perth',
    'TypeScript Developer Perth',
    'React Developer Perth',
    'Bun Hono Supabase Developer',
    'Gemini Claude Developer Australia',
    'LLM-as-judge',
    'Langfuse promptfoo',
    'NetSuite SuiteScript Developer Perth',
    'SimPro Integration Developer',
    'Microsoft Graph Developer Perth',
    'n8n Automation Perth',
    'MCP Server Developer',
    'Lakestone AI',
  ],
  authors: [{ name: 'Usama Javed', url: 'https://www.usamajaved.com.au' }],
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
    url: 'https://www.usamajaved.com.au',
    title: 'Usama Javed - Forward Deployed Engineer & AI Engineer | Perth',
    description: 'AI-native back-office software for businesses: extraction pipelines with judge models, agents with human escalation, NetSuite and SimPro integrations. Lead AI Engineer at Lakestone AI, Perth.',
    siteName: 'Usama Javed Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Usama Javed - AI Engineer Perth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Usama Javed - AI Engineer | Perth',
    description: 'Forward Deployed Engineer and Lead AI Engineer at Lakestone AI. TypeScript, Gemini, Claude, Supabase, NetSuite, SimPro.',
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
    canonical: 'https://www.usamajaved.com.au',
    languages: {
      'en-AU': 'https://www.usamajaved.com.au',
      'en-US': 'https://www.usamajaved.com.au',
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
  // === SCHEMA.ORG STRUCTURED DATA ===
  // Every claim here also appears on the visible page and in the resume.

  const DESCRIPTION =
    'Usama Javed is a Forward Deployed Engineer and Lead AI Engineer at Lakestone AI in Perth, Western Australia. ' +
    'He builds AI-native back-office software for businesses: extraction pipelines with judge models, agents that act within ' +
    'limits a person sets, assistants that answer from company data under row-level security, and the NetSuite and SimPro ' +
    'integrations underneath. Eight years of full-stack work across TypeScript, Node.js, React, .NET and Python.';

  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.usamajaved.com.au/#person',
    name: 'Usama Javed',
    alternateName: ['UJ', 'hellofromusama'],
    url: 'https://www.usamajaved.com.au',
    image: {
      '@type': 'ImageObject',
      url: 'https://www.usamajaved.com.au/profile.jpg',
      width: 400,
      height: 400,
      caption: 'Usama Javed, AI Engineer, Perth'
    },
    sameAs: [
      'https://github.com/hellofromusama',
      'https://www.linkedin.com/in/hellofromusama/',
      'https://x.com/hellofromusama'
    ],
    jobTitle: 'Forward Deployed Engineer & Lead AI Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Lakestone AI',
      url: 'https://lakestone.ai'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Perth',
      addressRegion: 'WA',
      addressCountry: 'AU'
    },
    email: 'hellofromusama@gmail.com',
    knowsAbout: [
      'AI Engineering', 'LLM pipelines', 'LLM-as-judge', 'AI agents', 'Agentic workflows',
      'Gemini', 'Claude', 'DeepSeek', 'Vercel AI SDK', 'LangChain', 'LangGraph', 'Model Context Protocol (MCP)', 'Ollama',
      'Langfuse', 'promptfoo', 'Retrieval-Augmented Generation (RAG)', 'pgvector', 'Postgres full-text search',
      'TypeScript', 'Bun', 'Hono', 'Node.js', 'React', 'Next.js', 'TanStack', 'Tailwind CSS',
      'Supabase', 'PostgreSQL', 'Row Level Security', 'pgTAP', 'Trigger.dev', 'Vercel Workflow',
      'Python', 'FastAPI', 'Django', 'Java', 'C#', '.NET',
      'NetSuite', 'SuiteScript 2.1', 'SimPro API', 'Microsoft Graph', 'SharePoint', 'Entra ID', 'n8n',
      'AWS Lambda', 'AWS ECS', 'Terraform', 'Docker', 'Vercel', 'GitHub Actions', 'GitLab CI',
      'PDF internals', 'PDF/A', 'CAdES', 'CMS/DER', 'X.509', 'HMAC webhooks', 'OTP authentication',
      'Claude Code', 'Agent skills', 'Forward deployed engineering', 'Payment gateway integration'
    ],
    knowsLanguage: [{ '@type': 'Language', name: 'English', alternateName: 'en' }],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Forward Deployed Engineer / AI Engineer',
      occupationLocation: {
        '@type': 'City',
        name: 'Perth',
        containedInPlace: { '@type': 'State', name: 'Western Australia' }
      },
      skills: 'TypeScript, Bun, Hono, React, Supabase, Gemini, Claude, Langfuse, promptfoo, NetSuite, SimPro, Microsoft Graph',
      responsibilities: 'Owning AI products end to end for business clients: extraction pipelines, judge models, agents, integrations, delivery'
    },
    nationality: { '@type': 'Country', name: 'Australia' },
    description: DESCRIPTION
  };

  const profilePageData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://www.usamajaved.com.au/#profilepage',
    mainEntity: { '@id': 'https://www.usamajaved.com.au/#person' },
    dateCreated: '2025-01-01',
    dateModified: '2026-10-22',
    name: 'Usama Javed - AI Engineer Portfolio',
    description: 'Portfolio of Usama Javed, Forward Deployed Engineer and Lead AI Engineer in Perth, Australia',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.hero-description', '.bio-summary', '.key-skills-summary']
    }
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.usamajaved.com.au/#website',
    url: 'https://www.usamajaved.com.au',
    name: 'Usama Javed - AI Engineer Perth',
    description: 'Portfolio of Usama Javed, Forward Deployed Engineer and Lead AI Engineer in Perth, Western Australia',
    publisher: { '@id': 'https://www.usamajaved.com.au/#person' },
    inLanguage: 'en-AU',
    copyrightHolder: { '@id': 'https://www.usamajaved.com.au/#person' },
    copyrightYear: 2025,
    dateModified: '2026-10-22'
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://www.usamajaved.com.au/#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does Usama Javed do?',
        acceptedAnswer: { '@type': 'Answer', text: DESCRIPTION }
      },
      {
        '@type': 'Question',
        name: 'What has Usama Javed built that is in production?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Three Lakestone AI products in production in Perth: an invoice, supplier and fleet platform for a construction company integrated with SimPro (Gemini extraction, LLM-as-judge, agents with human escalation); a mail, property and agreement platform for a commercial property agency (Microsoft Graph sync, Gemini classification with human approval, Cirrus8 mirror); and a headless e-signature service with a 40-tool PDF toolkit. Earlier: an MCP NetSuite-Ollama bridge in production at Ear Science Institute Australia, and payment gateway services at GlobalCharge in the UK.'
        }
      },
      {
        '@type': 'Question',
        name: 'What technologies does Usama Javed work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TypeScript end to end: Bun, Hono, React 19, TanStack, Tailwind, Supabase Postgres with row-level security, Trigger.dev, Vercel. AI: Gemini, Claude, DeepSeek, Vercel AI SDK, LangChain/LangGraph, MCP, Ollama, Langfuse, promptfoo, RAG with pgvector and Postgres FTS, LLM-as-judge. Integrations: NetSuite SuiteScript 2.1, SimPro API, Microsoft Graph, Entra ID, n8n. Earlier: Node.js, .NET/C#, Java, Python, AWS Lambda/ECS, Terraform, GitLab CI.'
        }
      },
      {
        '@type': 'Question',
        name: 'Where is Usama Javed based and is he available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Perth, Western Australia (AWST). Currently Forward Deployed Engineer and Lead AI Engineer at Lakestone AI. Open to forward deployed, AI engineering and senior full-stack roles, remote or hybrid, and to well-defined freelance automation and integration work. Contact: hellofromusama@gmail.com or the contact form at usamajaved.com.au/contact. Resume: usamajaved.com.au/Usama-Javed-Resume.pdf.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does Usama Javed keep AI features safe in production?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No extractor or classifier output reaches a client system without a judge pass (JEV for classification, CDM for arbitrating between candidate extractions), and anything below threshold goes to a person. The chat assistant runs SQL as a dedicated read-only Postgres role, with exploit tests in CI against a replayed database. AI checks fail open for the user and never silently.'
        }
      }
    ]
  };

  const projectsListData = buildItemListSchema();

  const speakableData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.usamajaved.com.au/#webpage',
    name: 'Usama Javed - Forward Deployed Engineer & AI Engineer, Perth',
    description: DESCRIPTION,
    url: 'https://www.usamajaved.com.au',
    isPartOf: { '@id': 'https://www.usamajaved.com.au/#website' },
    about: { '@id': 'https://www.usamajaved.com.au/#person' },
    dateModified: '2026-10-22',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.hero-description', '.bio-summary', '.key-skills-summary', '.project-highlights', '.cta-section']
    },
    mainEntity: { '@id': 'https://www.usamajaved.com.au/#person' }
  };

  return (
    <html lang="en-AU">
      <head>
        <meta name="geo.region" content="AU-WA" />
        <meta name="geo.placename" content="Perth" />
        <meta name="geo.position" content="-31.9505;115.8605" />
        <meta name="ICBM" content="-31.9505, 115.8605" />
        <meta name="DC.title" content="Usama Javed - AI Engineer Perth" />
        <meta name="DC.creator" content="Usama Javed" />
        <meta name="DC.subject" content="AI Engineering, Software Engineering, Perth, Australia" />
        <meta name="DC.description" content="Forward Deployed Engineer and Lead AI Engineer in Perth, Western Australia" />
        <meta name="DC.publisher" content="Usama Javed" />
        <meta name="DC.contributor" content="Usama Javed" />
        <meta name="DC.date" content="2026-10-22" />
        <meta name="DC.type" content="Portfolio" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content="https://www.usamajaved.com.au" />
        <meta name="DC.language" content="en-AU" />
        <meta name="DC.coverage" content="Perth, Western Australia" />
        <meta name="DC.rights" content="Copyright 2026 Usama Javed" />
        <meta name="article:modified_time" content="2026-10-22T16:00:00+08:00" />
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
        <meta name="ai:llms_txt" content="https://www.usamajaved.com.au/llms.txt" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased flex flex-col min-h-screen`}
      >
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </div>
        <ConditionalFooter />
        <SpaceModeLauncher />
      </body>
    </html>
  );
}
