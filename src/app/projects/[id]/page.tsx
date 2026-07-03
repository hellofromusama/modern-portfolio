import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSpaceMode } from "@/lib/spaceMode";
import { getProject, projectList } from "@/content/projects";
import ProjectDive from "./ProjectDive";
import ProjectClassic from "./ProjectClassic";

export function generateStaticParams() {
  return projectList.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = getProject(id);
  if (!p) return {};
  return { title: p.title, description: p.description };
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  const space = await getSpaceMode();
  if (!space) {
    return <ProjectClassic project={project} />;
  }

  return (
    <>
      {/* Crawlable real-DOM copy — bots read the project detail the canvas hides.
          Space mode only; the classic body is already crawlable. */}
      <div className="sr-only">
        <p>{project.category}</p>
        <h1>{project.title}</h1>
        <p>{project.subtitle}</p>
        <p>{project.description}</p>
        <p>Timeline: {project.timeline}</p>
        <p>Team Size: {project.team}</p>
        {project.liveUrl && (
          <p>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Visit Live Website
            </a>
          </p>
        )}

        <h2>Technology Stack</h2>
        <ul>
          {project.tech.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <h2>Project Overview</h2>
        <p style={{ whiteSpace: "pre-line" }}>{project.longDescription}</p>

        <h2>Key Features</h2>
        <ul>
          {project.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        <h2>Challenges Solved</h2>
        <ul>
          {project.challenges.map((challenge, index) => (
            <li key={index}>{challenge}</li>
          ))}
        </ul>

        <h2>Results Achieved</h2>
        <ul>
          {project.results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>

        <h2>Interested in Similar Solutions?</h2>
        <p>
          I can help you build similar high-performance solutions tailored to your specific needs.{" "}
          <Link href="/contact">Discuss Your Project</Link> or <Link href="/#projects">View More Projects</Link>.
        </p>
      </div>

      <ProjectDive project={project} />
    </>
  );
}
