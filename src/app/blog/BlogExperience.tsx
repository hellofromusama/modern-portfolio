"use client";

import { useState } from "react";
import Link from "next/link";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop, type ShellPlanet } from "@/components/three/space/shellSpec";
import { blogPosts, categories, postHref } from "./blogData";

/**
 * /blog as a space dive: the EXISTING blog index (quick answers + featured post +
 * post cards + newsletter) floated verbatim as glass panels over the cosmos. Holds the
 * active-category filter state; the posts stop is interactive:true so its filter buttons
 * + card links are clickable. Every post card is a real working link — only
 * /blog/best-developer-perth and /blog/ai-developer-perth are dedicated routes; all
 * other cards link to /contact (postHref in blogData.ts), so NO href 404s. The blogSchema
 * JSON-LD lives in page.tsx (server), not here.
 */

const NARROW = "min(92vw, 640px)";
const WIDE = "min(92vw, 1100px)";

const PLANETS: ShellPlanet[] = [
  { texture: "/space/2k_earth_daymap.jpg", radius: 6.5, tint: 0x5a9bff },
  { texture: "/space/2k_jupiter.jpg", radius: 7.5, tint: 0xe0a86a },
  { texture: "/space/2k_neptune.jpg", radius: 5.0, tint: 0x3a6ff0 },
  { texture: "/space/2k_saturn.jpg", radius: 4.4, tint: 0xd8c79a, ring: true },
  { texture: "/space/2k_venus_surface.jpg", radius: 4.0, tint: 0xe8c98a },
];

const featured = blogPosts.find((p) => p.featured);

const heroPanel = (
  <div className="space-panel space-hero">
    <p className="space-mono space-eyebrow">◦ PERTH, AUSTRALIA — BLOG</p>
    <h1 className="space-h1">Web Development Insights &amp; Expert Guides</h1>
    <p className="space-body">
      Learn about modern web development, AI integration, and industry best practices from Perth&apos;s
      leading full stack developer with 8+ years of experience.
    </p>
    <div className="space-chips">
      <span className="space-chip">Next.js Expert</span>
      <span className="space-chip">AI Integration</span>
      <span className="space-chip">Perth Business Focus</span>
      <span className="space-chip">Enterprise Solutions</span>
    </div>
    <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
  </div>
);

const quickAnswersPanel = (
  <div className="space-wide">
    <div className="space-section-head">
      <p className="space-mono">01 — QUICK ANSWERS</p>
      <h2 className="space-h2">Quick Answers for Developers &amp; Business Owners</h2>
    </div>
    <div className="space-grid space-grid-projects">
      <div className="space-card">
        <h3 className="space-proj-title">What&apos;s the best framework for SEO?</h3>
        <p className="space-body space-proj-desc">Next.js leads for SEO due to server-side rendering, automatic code splitting, and built-in optimizations that React requires additional setup to achieve.</p>
      </div>
      <div className="space-card">
        <h3 className="space-proj-title">How much does web development cost in Perth?</h3>
        <p className="space-body space-proj-desc">Perth web development ranges from $5,000-$100,000+ depending on complexity. Simple business sites start at $5,000, while enterprise applications can reach $500,000+.</p>
      </div>
      <div className="space-card">
        <h3 className="space-proj-title">Should I use AI in my business website?</h3>
        <p className="space-body space-proj-desc">AI integration can significantly improve customer engagement through chatbots, personalization, and automation. Best for customer service, lead generation, and workflow optimization.</p>
      </div>
    </div>
  </div>
);

const featuredPanel = featured ? (
  <div className="space-panel space-wide">
    <span className="space-chip" style={{ color: "#60a5fa" }}>Featured Guide</span>
    <h2 className="space-h2" style={{ marginTop: "0.75rem" }}>{featured.title}</h2>
    <p className="space-body">{featured.excerpt}</p>
    <p className="space-mono" style={{ margin: "0.5rem 0" }}>
      {featured.readTime} · {new Date(featured.publishDate).toLocaleDateString()} · {featured.category}
    </p>
    <Link className="space-cta" href={postHref(featured)}>
      Read Complete Guide →
    </Link>
  </div>
) : null;

const newsletterPanel = (
  <div className="space-panel">
    <p className="space-mono space-card-label">04 — STAY UPDATED</p>
    <h2 className="space-h2">Stay Updated with Latest Web Development Trends</h2>
    <p className="space-body">
      Get weekly insights on modern web technologies, AI integration tips, and Perth tech industry
      updates delivered to your inbox.
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "0.75rem" }}>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full sm:flex-1 px-4 py-3 rounded-lg focus:outline-none"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", minWidth: "220px" }}
      />
      <button className="space-cta" type="button" style={{ margin: 0 }}>
        Subscribe
      </button>
    </div>
  </div>
);

export default function BlogExperience() {
  const [activeCategory, setActiveCategory] = useState<string>("All Posts");

  const visiblePosts =
    activeCategory === "All Posts"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  const postsPanel = (
    <div className="space-wide">
      <div className="space-section-head">
        <p className="space-mono">03 — ALL ARTICLES</p>
        <h2 className="space-h2">Browse by Category</h2>
      </div>

      {/* Client-side category filter — settles because this stop is interactive. */}
      <div className="space-chips" style={{ marginBottom: "1.25rem" }}>
        {categories.map((category) => {
          const active = category.name === activeCategory;
          return (
            <button
              key={category.name}
              type="button"
              onClick={() => setActiveCategory(category.name)}
              className="space-chip"
              style={{
                cursor: "pointer",
                background: active ? "linear-gradient(90deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.04)",
                color: active ? "#05060a" : "#ece9e4",
                fontWeight: active ? 600 : 400,
              }}
            >
              {category.name} ({category.count})
            </button>
          );
        })}
      </div>

      <div className="space-grid space-grid-projects">
        {visiblePosts.map((post) => (
          <Link key={post.title} href={postHref(post)} className="space-card" style={{ textDecoration: "none", display: "block" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="space-chip" style={{ color: "#60a5fa", fontSize: "0.7rem" }}>{post.category}</span>
              <span className="space-mono" style={{ letterSpacing: "0.1em" }}>{post.readTime}</span>
            </div>
            <h3 className="space-proj-title">{post.title}</h3>
            <p className="space-body space-proj-desc">{post.excerpt}</p>
            <div className="space-chips" style={{ marginTop: "0.6rem" }}>
              {post.tags.map((tag) => (
                <span key={tag} className="space-chip" style={{ fontSize: "0.68rem" }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
              <span className="space-mono" style={{ letterSpacing: "0.1em" }}>{new Date(post.publishDate).toLocaleDateString()}</span>
              <span style={{ color: "#60a5fa", fontWeight: 600, fontSize: "0.85rem" }}>Read More →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const stops: SpaceStop[] = [];
  const panels: { id: string; label: string; width: string; content: SpaceStop["content"]; interactive?: boolean }[] = [
    { id: "hero", label: "", width: NARROW, content: heroPanel },
    { id: "quick-answers", label: "Answers", width: WIDE, content: quickAnswersPanel },
    { id: "featured", label: "Featured", width: WIDE, content: featuredPanel },
    { id: "posts", label: "Articles", width: WIDE, content: postsPanel, interactive: true },
    { id: "newsletter", label: "Subscribe", width: NARROW, content: newsletterPanel },
  ];
  const total = panels.length;
  panels.forEach((p, i) => {
    const anchor = total > 1 ? i / (total - 1) : 0;
    stops.push({
      id: p.id,
      label: p.label,
      anchor,
      position: anchorToPosition(anchor, 0, 1),
      planet: i < PLANETS.length ? PLANETS[i] : null,
      contentWidth: p.width,
      content: p.content,
      interactive: p.interactive,
    });
  });

  return <SpacePageShell stops={stops} scrollVh={Math.max(420, stops.length * 110)} />;
}
