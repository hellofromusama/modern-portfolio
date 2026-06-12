import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development Blog | Expert Insights from Perth's Leading Developer",
  description: "Expert web development insights, tutorials, and industry trends from Perth's leading full stack developer. Learn about Next.js, React, AI integration, and modern web technologies.",
  keywords: [
    "web development blog",
    "Next.js tutorials",
    "React best practices",
    "AI integration guide",
    "Perth web developer blog",
    "full stack development tips",
    "JavaScript tutorials",
    "web development trends 2026",
    "SEO for developers",
    "modern web technologies"
  ],
};

const blogPosts = [
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

const categories = [
  { name: "All Posts", count: blogPosts.length },
  { name: "Technical", count: blogPosts.filter(post => post.category === "Technical").length },
  { name: "Business Guide", count: blogPosts.filter(post => post.category === "Business Guide").length },
  { name: "AI & Automation", count: blogPosts.filter(post => post.category === "AI & Automation").length },
  { name: "SEO", count: blogPosts.filter(post => post.category === "SEO").length },
  { name: "Local Business", count: blogPosts.filter(post => post.category === "Local Business").length }
];

export default function BlogPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Usama Javed Web Development Blog",
    "description": "Expert insights on web development, AI integration, and modern technologies from Perth's leading full stack developer",
    "url": "https://www.usamajaved.com.au/blog",
    "author": {
      "@type": "Person",
      "name": "Usama Javed",
      "url": "https://www.usamajaved.com.au",
      "jobTitle": "Full Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Usama Javed Development Services"
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.publishDate,
      "author": {
        "@type": "Person",
        "name": "Usama Javed"
      },
      "publisher": {
        "@type": "Person",
        "name": "Usama Javed"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.usamajaved.com.au/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      }
    }))
  };

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Hero Section */}
      <section className="py-20" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-[family-name:var(--font-space-grotesk)]">
              Web Development Insights & Expert Guides
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8" style={{ color: "var(--text-tertiary)" }}>
              Learn about modern web development, AI integration, and industry best practices
              from Perth's leading full stack developer with 8+ years of experience.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-3 py-1 rounded-full" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>Next.js Expert</span>
              <span className="px-3 py-1 rounded-full" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>AI Integration</span>
              <span className="px-3 py-1 rounded-full" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>Perth Business Focus</span>
              <span className="px-3 py-1 rounded-full" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>Enterprise Solutions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Answers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center tracking-tight font-[family-name:var(--font-space-grotesk)]" style={{ color: "var(--text-primary)" }}>
            Quick Answers for Developers & Business Owners
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>What's the best framework for SEO?</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Next.js leads for SEO due to server-side rendering, automatic code splitting, and built-in optimizations that React requires additional setup to achieve.</p>
            </div>
            <div className="p-6 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>How much does web development cost in Perth?</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Perth web development ranges from $5,000-$100,000+ depending on complexity. Simple business sites start at $5,000, while enterprise applications can reach $500,000+.</p>
            </div>
            <div className="p-6 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Should I use AI in my business website?</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>AI integration can significantly improve customer engagement through chatbots, personalization, and automation. Best for customer service, lead generation, and workflow optimization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {blogPosts.filter(post => post.featured).map((post, index) => (
        <section key={index} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl p-8 md:p-12" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
              <div className="max-w-4xl">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: "color-mix(in srgb, var(--accent-blue) 12%, transparent)", color: "var(--accent-blue)" }}>Featured Guide</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)]">{post.title}</h2>
                <p className="text-xl mb-6" style={{ color: "var(--text-tertiary)" }}>{post.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                </div>
                <button className="mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5" style={{ background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }}>
                  Read Complete Guide
                </button>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Categories Filter */}
      <section className="py-8" style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:[background:var(--bg-card-hover)] hover:[border-color:var(--border-hover)]"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <article
                key={index}
                className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:[background:var(--bg-card-hover)] hover:[border-color:var(--border-hover)]"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: "color-mix(in srgb, var(--accent-blue) 12%, transparent)", color: "var(--accent-blue)" }}>
                      {post.category}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 line-clamp-2 font-[family-name:var(--font-space-grotesk)]" style={{ color: "var(--text-primary)" }}>
                    {post.title}
                  </h3>

                  <p className="mb-4 line-clamp-3" style={{ color: "var(--text-muted)" }}>
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 rounded text-xs" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {new Date(post.publishDate).toLocaleDateString()}
                    </span>
                    <button className="font-medium text-sm transition-colors" style={{ color: "var(--accent-blue)" }}>
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)]" style={{ color: "var(--text-primary)" }}>
            Stay Updated with Latest Web Development Trends
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            Get weekly insights on modern web technologies, AI integration tips,
            and Perth tech industry updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
            />
            <button className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5" style={{ background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}