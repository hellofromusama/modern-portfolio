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
    "web development trends 2025",
    "SEO for developers",
    "modern web technologies"
  ],
};

const blogPosts = [
  {
    title: "Complete Guide to Web Development in Perth, Australia (2025)",
    excerpt: "Everything you need to know about hiring web developers in Perth, current market rates, technologies, and how to choose the right developer for your business.",
    readTime: "12 min read",
    category: "Business Guide",
    tags: ["Perth", "Web Development", "Business", "Hiring"],
    publishDate: "2025-01-28",
    featured: true
  },
  {
    title: "Next.js vs React: Which is Better for SEO in 2025?",
    excerpt: "Comprehensive comparison of Next.js and React for SEO performance, including server-side rendering, performance metrics, and real-world case studies.",
    readTime: "8 min read",
    category: "Technical",
    tags: ["Next.js", "React", "SEO", "Performance"],
    publishDate: "2025-01-25"
  },
  {
    title: "How to Integrate AI into Your Business Website",
    excerpt: "Step-by-step guide to adding AI features like chatbots, voice assistants, and automated workflows to boost customer engagement and efficiency.",
    readTime: "10 min read",
    category: "AI & Automation",
    tags: ["AI", "Chatbots", "Automation", "Business"],
    publishDate: "2025-01-22"
  },
  {
    title: "JavaScript Website SEO: Best Practices for 2025",
    excerpt: "Advanced SEO techniques for JavaScript-heavy websites, including server-side rendering, hydration strategies, and Core Web Vitals optimization.",
    readTime: "15 min read",
    category: "SEO",
    tags: ["JavaScript", "SEO", "Performance", "Core Web Vitals"],
    publishDate: "2025-01-20"
  },
  {
    title: "Perth Business Website Trends: What's Working in 2025",
    excerpt: "Latest website design and functionality trends specifically for Perth businesses, including local SEO strategies and customer behavior insights.",
    readTime: "6 min read",
    category: "Local Business",
    tags: ["Perth", "Business", "Trends", "Local SEO"],
    publishDate: "2025-01-18"
  },
  {
    title: "Building Enterprise Web Applications with Next.js",
    excerpt: "Enterprise-grade development patterns, security considerations, and scalability strategies for large-scale Next.js applications.",
    readTime: "18 min read",
    category: "Enterprise",
    tags: ["Next.js", "Enterprise", "Security", "Scalability"],
    publishDate: "2025-01-15"
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
    "url": "https://usamajaved.com.au/blog",
    "author": {
      "@type": "Person",
      "name": "Usama Javed",
      "url": "https://usamajaved.com.au",
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
        "@id": `https://usamajaved.com.au/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      }
    }))
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Web Development Insights & Expert Guides
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Learn about modern web development, AI integration, and industry best practices
              from Perth's leading full stack developer with 8+ years of experience.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="bg-blue-600 px-3 py-1 rounded-full">Next.js Expert</span>
              <span className="bg-purple-600 px-3 py-1 rounded-full">AI Integration</span>
              <span className="bg-green-600 px-3 py-1 rounded-full">Perth Business Focus</span>
              <span className="bg-orange-600 px-3 py-1 rounded-full">Enterprise Solutions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Answers Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Quick Answers for Developers & Business Owners
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-slate-900 mb-2">What's the best framework for SEO?</h3>
              <p className="text-slate-600 text-sm">Next.js leads for SEO due to server-side rendering, automatic code splitting, and built-in optimizations that React requires additional setup to achieve.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-slate-900 mb-2">How much does web development cost in Perth?</h3>
              <p className="text-slate-600 text-sm">Perth web development ranges from $5,000-$100,000+ depending on complexity. Simple business sites start at $5,000, while enterprise applications can reach $500,000+.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-slate-900 mb-2">Should I use AI in my business website?</h3>
              <p className="text-slate-600 text-sm">AI integration can significantly improve customer engagement through chatbots, personalization, and automation. Best for customer service, lead generation, and workflow optimization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {blogPosts.filter(post => post.featured).map((post, index) => (
        <section key={index} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 md:p-12">
              <div className="max-w-4xl">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Featured Guide</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">{post.title}</h2>
                <p className="text-xl opacity-90 mb-6">{post.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                </div>
                <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                  Read Complete Guide
                </button>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
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
              <article key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-slate-500 text-xs">{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">
                      {new Date(post.publishDate).toLocaleDateString()}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
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
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Stay Updated with Latest Web Development Trends
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Get weekly insights on modern web technologies, AI integration tips,
            and Perth tech industry updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}