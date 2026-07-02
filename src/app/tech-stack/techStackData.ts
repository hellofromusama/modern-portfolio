// Single source of truth for /tech-stack: the techStack categories + features,
// extracted VERBATIM from the original page component. Imported by BOTH page.tsx
// (sr-only crawlable copy) and TechStackExperience.tsx (the space-dive stops).
// This page has NO metadata and NO JSON-LD today — none are added. Pure module.

export interface TechItem {
  name: string;
  description: string;
  color: string;
}

export interface TechCategory {
  category: string;
  icon: string;
  technologies: TechItem[];
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export const techStack: TechCategory[] = [
  {
    category: "Frontend",
    icon: "🎨",
    technologies: [
      { name: "Next.js 15", description: "React framework with App Router and Turbopack", color: "text-blue-400" },
      { name: "React 19", description: "Latest React with concurrent features", color: "text-cyan-400" },
      { name: "TypeScript", description: "Type-safe JavaScript for better development", color: "text-blue-500" },
      { name: "Tailwind CSS v4", description: "Utility-first CSS framework for rapid styling", color: "text-teal-400" },
    ]
  },
  {
    category: "Deployment & Hosting",
    icon: "🚀",
    technologies: [
      { name: "Vercel", description: "Edge network deployment with automatic HTTPS", color: "text-white" },
      { name: "GitHub", description: "Version control with automated CI/CD pipelines", color: "text-purple-400" },
      { name: "Custom Domain", description: "Professional domain with DNS optimization", color: "text-green-400" },
      { name: "SSL Certificate", description: "Automatic HTTPS encryption and security", color: "text-yellow-400" },
    ]
  },
  {
    category: "Performance & Optimization",
    icon: "⚡",
    technologies: [
      { name: "Turbopack", description: "Rust-powered bundler for lightning-fast builds", color: "text-orange-400" },
      { name: "Static Generation", description: "Pre-rendered pages for optimal performance", color: "text-indigo-400" },
      { name: "Image Optimization", description: "Next.js automatic image optimization", color: "text-pink-400" },
      { name: "Code Splitting", description: "Automatic bundle splitting for faster loads", color: "text-red-400" },
    ]
  },
  {
    category: "Developer Experience",
    icon: "🛠️",
    technologies: [
      { name: "ESLint", description: "Code quality and consistency enforcement", color: "text-purple-400" },
      { name: "Hot Reload", description: "Instant updates during development", color: "text-green-400" },
      { name: "TypeScript Config", description: "Strict typing for better code quality", color: "text-blue-400" },
      { name: "Modern Fonts", description: "Geist font family for optimal readability", color: "text-slate-400" },
    ]
  }
];

export const features: Feature[] = [
  {
    title: "Responsive Design",
    description: "Mobile-first approach ensuring perfect display on all devices",
    icon: "📱"
  },
  {
    title: "Interactive Animations",
    description: "Smooth CSS transitions and hover effects for enhanced UX",
    icon: "✨"
  },
  {
    title: "SEO Optimized",
    description: "Meta tags, structured data, and semantic HTML for search engines",
    icon: "🔍"
  },
  {
    title: "Accessibility",
    description: "WCAG compliant design with proper ARIA labels and keyboard navigation",
    icon: "♿"
  },
  {
    title: "Performance Scored",
    description: "Lighthouse score of 90+ across all metrics",
    icon: "📊"
  },
  {
    title: "Modern Architecture",
    description: "Component-based architecture with reusable UI elements",
    icon: "🏗️"
  }
];
