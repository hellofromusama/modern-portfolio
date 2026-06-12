import { itemListProjects } from "./projects";

// buildItemListSchema() reproduces the JSON-LD ItemList from src/app/layout.tsx
// (the `projectsListData` literal) BYTE-FOR-BYTE. The wrapper fields and
// numberOfItems are kept as the original literals; itemListElement is built by
// mapping itemListProjects (6 projects, kashmir-fund ABSENT, in the curated
// order) so the centralized superset drives the schema. Each item's curated
// seoName / seoDescription / applicationCategory come from the project record.
//
// IMPORTANT: the emitted object must equal the current literal exactly — the
// content-diff gate compares the serialized ItemList. numberOfItems is a manual
// literal that MUST equal itemListProjects.length. Phase 02 (AICON-04/SEO-02)
// appended the MCP flagship to the curated ItemList (6 -> 7), so this literal
// was bumped 6 -> 7 in lockstep. Keep them equal whenever the array changes.
export function buildItemListSchema() {
  const projectsListData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'https://www.usamajaved.com.au/#projects',
    name: 'Usama Javed Portfolio Projects',
    description: 'Featured enterprise projects by Usama Javed, Senior Full Stack Developer in Perth',
    numberOfItems: 7,
    itemListElement: itemListProjects.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: p.seoName,
        description: p.seoDescription,
        url: `https://www.usamajaved.com.au/projects/${p.id}`,
        applicationCategory: p.applicationCategory,
        operatingSystem: 'Web',
        author: { '@id': 'https://www.usamajaved.com.au/#person' },
      },
    })),
  };

  return projectsListData;
}
