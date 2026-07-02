import { getSpaceMode } from "@/lib/spaceMode";
import { techStack, features } from "./techStackData";
import TechStackDive from "./TechStackDive";
import TechStackClassic from "./TechStackClassic";

// Server component. This route had NO metadata and NO JSON-LD — none are added, so
// SEO stays byte-identical. The crawlable sr-only copy replaces the DOM the canvas hides.
export default async function TechStack() {
  const space = await getSpaceMode();
  if (!space) return <TechStackClassic />;
  return (
    <>
      <div className="sr-only">
        <h1>Tech Stack</h1>
        <p>Behind the Scenes of This Portfolio</p>
        <p>
          This portfolio showcases modern web development practices using cutting-edge technologies
          for optimal performance, developer experience, and user satisfaction.
        </p>
        {techStack.map((category) => (
          <section key={category.category}>
            <h2>{category.category}</h2>
            <ul>
              {category.technologies.map((tech) => (
                <li key={tech.name}>
                  <strong>{tech.name}</strong> — {tech.description}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <h2>Key Features &amp; Capabilities</h2>
        <ul>
          {features.map((feature) => (
            <li key={feature.title}>
              <strong>{feature.title}</strong> — {feature.description}
            </li>
          ))}
        </ul>
      </div>

      <TechStackDive />
    </>
  );
}
