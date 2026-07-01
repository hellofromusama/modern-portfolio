import type { Metadata } from "next";

// Server layout for the /space route segment.
//
// The /space PAGE is a client component ("use client"), and client components
// CANNOT `export const metadata`. So this sibling SERVER layout carries the
// robots directive for the segment, emitting:
//   <meta name="robots" content="noindex, nofollow">
// This is a design-agnostic PROTOTYPE route — it must never be indexed, followed,
// or leak into search. It is also kept out of sitemap.ts / robots.ts / Navigation.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
