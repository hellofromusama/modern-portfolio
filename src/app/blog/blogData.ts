// Single source of truth for /blog: the blogPosts + categories, extracted VERBATIM
// from the original page. Imported by BOTH page.tsx (blogSchema JSON-LD + sr-only
// crawlable copy) and BlogExperience.tsx (the space-dive stops + category filter) so
// the schema output stays byte-identical. Pure module.

export interface BlogPost {
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  tags: string[];
  publishDate: string;
  featured?: boolean;
}

export interface BlogCategory {
  name: string;
  count: number;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Complete Guide to Hiring a Web Developer in Perth, Australia (2026)",
    excerpt: "Everything you need to know about hiring web developers in Perth — current market rates ($75-$150/hr), top technologies (Next.js 15, React 19, AI), and how to choose the right developer for your business.",
    readTime: "12 min read",
    category: "Business Guide",
    tags: ["Perth", "Web Development", "Business", "Hiring", "Australia"],
    publishDate: "2026-04-05",
    featured: true
  },
  {
    title: "Next.js 15 vs React 19: Which is Better for SEO in 2026?",
    excerpt: "Comprehensive comparison of Next.js 15 App Router and React 19 for SEO performance. Server Components, streaming SSR, and real-world Lighthouse benchmarks from enterprise projects.",
    readTime: "8 min read",
    category: "Technical",
    tags: ["Next.js", "React", "SEO", "Performance", "Server Components"],
    publishDate: "2026-03-28"
  },
  {
    title: "How to Integrate AI into Your Business Website in 2026",
    excerpt: "Step-by-step guide to adding OpenAI GPT-4, Voice AI agents, and N8N automation workflows. Real case study: 500+ daily bookings handled autonomously with 35% conversion increase.",
    readTime: "10 min read",
    category: "AI & Automation",
    tags: ["AI", "OpenAI", "Voice AI", "N8N", "Automation", "Perth"],
    publishDate: "2026-03-20"
  },
  {
    title: "AI SEO: How to Make Your Website Appear in ChatGPT, Perplexity & Google AI Overviews",
    excerpt: "Complete guide to Answer Engine Optimization (AEO). llms.txt, Schema.org markup, citation blocks, and the techniques that get your site cited by AI search engines in 2026.",
    readTime: "15 min read",
    category: "SEO",
    tags: ["AI SEO", "AEO", "llms.txt", "Schema.org", "ChatGPT", "Perplexity"],
    publishDate: "2026-03-12"
  },
  {
    title: "Perth Business Website Trends: What's Working in 2026",
    excerpt: "Latest website trends for Perth businesses — AI chatbots, voice search optimization, and why 69% of searches are now zero-click. Local SEO strategies that actually work.",
    readTime: "6 min read",
    category: "Local Business",
    tags: ["Perth", "Business", "Trends", "Local SEO", "AI", "Australia"],
    publishDate: "2026-03-05"
  },
  {
    title: "Building Enterprise Applications with Next.js 15 and Cloud Architecture",
    excerpt: "Enterprise-grade patterns for Next.js 15 — security, Kubernetes scaling to 100K+ users, and real architecture from a $180K/year automation platform. Full case study included.",
    readTime: "18 min read",
    category: "Enterprise",
    tags: ["Next.js", "Enterprise", "Kubernetes", "AWS", "Cloud", "Architecture"],
    publishDate: "2026-02-25"
  }
];

export const categories: BlogCategory[] = [
  { name: "All Posts", count: blogPosts.length },
  { name: "Technical", count: blogPosts.filter(post => post.category === "Technical").length },
  { name: "Business Guide", count: blogPosts.filter(post => post.category === "Business Guide").length },
  { name: "AI & Automation", count: blogPosts.filter(post => post.category === "AI & Automation").length },
  { name: "SEO", count: blogPosts.filter(post => post.category === "SEO").length },
  { name: "Local Business", count: blogPosts.filter(post => post.category === "Local Business").length }
];

// WORKING-LINKS RULE: only /blog/best-developer-perth and /blog/ai-developer-perth
// are real article routes. The featured hiring guide maps to best-developer-perth, the
// AI integration post maps to ai-developer-perth; every other card links to /contact
// (a working CTA) so NO href 404s.
export function postHref(post: BlogPost): string {
  if (post.title.startsWith("Complete Guide to Hiring")) return "/blog/best-developer-perth";
  if (post.title.startsWith("How to Integrate AI")) return "/blog/ai-developer-perth";
  return "/contact";
}
