// Centralized content types for the portfolio.
//
// `Project` is the SUPERSET shape: it carries every field any consumer needs —
// the rich detail-page fields, the home-grid's OWN title/description/tech/
// category (which DIFFER from the detail copy), the curated JSON-LD seo copy,
// and the sitemap priority. Projections in projects.ts reproduce each
// consumer's exact current subset/order from this single source.
//
// Pure data module: no "use client", no JSX, no React import. Server- and
// client-importable.

export type ApplicationCategory =
  | "BusinessApplication"
  | "DeveloperApplication"
  | "WebApplication";

export interface Project {
  // Identity
  id: string;

  // Detail-page fields (src/app/projects/[id]/page.tsx) — verbatim
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tech: string[];
  category: string;
  timeline: string;
  team: string;
  features: string[];
  challenges: string[];
  results: string[];
  gradient: string;
  liveUrl?: string;

  // Home-grid fields (src/app/page.tsx) — DISTINCT from the detail copy above.
  // modern-portfolio is NOT in the home grid, so its grid* fields stay unset.
  gridTitle?: string;
  gridDescription?: string;
  gridTech?: string[];
  gridCategory?: string;

  // JSON-LD ItemList curated SEO copy (src/app/layout.tsx) — DISTINCT again.
  // kashmir-fund is NOT in the ItemList, so its seo* fields stay unset.
  seoName?: string;
  seoDescription?: string;
  applicationCategory?: ApplicationCategory;

  // Sitemap priority (src/app/sitemap.ts).
  sitemapPriority?: number;
}

export interface ProjectSeoItem {
  name: string;
  description: string;
  url: string;
  applicationCategory: ApplicationCategory;
}

export interface Skill {
  title: string;
  accent: "blue" | "violet" | "emerald" | "amber";
  items: string[];
}
