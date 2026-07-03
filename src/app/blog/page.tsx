import type { Metadata } from "next";
import { getSpaceMode } from "@/lib/spaceMode";
import { blogPosts } from "./blogData";
import BlogDive from "./BlogDive";
import BlogClassic from "./BlogClassic";

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

export default async function BlogPage() {
  const space = await getSpaceMode();
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {space ? (
        <>
          {/* Crawlable real-DOM copy — bots read what the canvas dive hides.
              Space mode only; the classic body is already crawlable. */}
          <div className="sr-only">
        <h1>Web Development Insights &amp; Expert Guides</h1>
        <p>
          Learn about modern web development, AI integration, and industry best practices
          from Perth&apos;s leading full stack developer with 8+ years of experience.
        </p>

        <h2>Quick Answers for Developers &amp; Business Owners</h2>
        <h3>What&apos;s the best framework for SEO?</h3>
        <p>Next.js leads for SEO due to server-side rendering, automatic code splitting, and built-in optimizations that React requires additional setup to achieve.</p>
        <h3>How much does web development cost in Perth?</h3>
        <p>Perth web development ranges from $5,000-$100,000+ depending on complexity. Simple business sites start at $5,000, while enterprise applications can reach $500,000+.</p>
        <h3>Should I use AI in my business website?</h3>
        <p>AI integration can significantly improve customer engagement through chatbots, personalization, and automation. Best for customer service, lead generation, and workflow optimization.</p>

        <h2>Articles</h2>
        {blogPosts.map((post) => (
          <article key={post.title}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <p>{post.category} · {post.readTime}</p>
          </article>
        ))}
          </div>

          <BlogDive />
        </>
      ) : (
        <BlogClassic />
      )}
    </>
  );
}
