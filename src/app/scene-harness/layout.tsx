import type { Metadata } from "next";

// Server layout for the /scene-harness route segment.
//
// NOTE: the folder is "scene-harness" (NOT "_scene-harness"): Next.js App Router
// treats "_"-prefixed folders as PRIVATE and excludes them from routing, so an
// underscore-prefixed harness would never mount. Non-discoverability comes from
// the robots noindex/nofollow below + sitemap exclusion, NOT from the folder name.
//
// The harness PAGE is a client component ('use client'), and client components
// CANNOT `export const metadata`. So this sibling SERVER layout carries the
// robots directive for the segment. It emits:
//   <meta name="robots" content="noindex, nofollow">
// so this throwaway, dev-only verification route is never indexed or followed.
//
// The route is ALSO kept out of src/app/sitemap.ts (an explicit hard-coded list).
// Together those two facts make /scene-harness non-discoverable.
//
// TEMPORARY: Phase 5 mounts the real scene on the live hero and REMOVES this
// entire src/app/scene-harness/ directory (page + layout) and the matching
// bundle-gate allow-entry.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SceneHarnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
