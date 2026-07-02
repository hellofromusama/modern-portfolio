import TeamDive from "./TeamDive";

// Server component (no "use client"). This route had no metadata — none is added, so
// SEO stays byte-identical. The crawlable sr-only copy replaces the DOM the canvas
// hides; the visible team grid is now the reused <TeamSection/> floated in the dive.
export default function TeamPage() {
  return (
    <>
      <div className="sr-only">
        <p>Team</p>
        <h1>Our team.</h1>
        <p>Meet the talented individuals who make our vision a reality</p>
      </div>

      <TeamDive />
    </>
  );
}
