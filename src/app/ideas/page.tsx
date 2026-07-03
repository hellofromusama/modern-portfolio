import type { Metadata } from "next";
import { getSpaceMode } from "@/lib/spaceMode";
import IdeasDive from "./IdeasDive";
import IdeasClassic from "./IdeasClassic";

export const metadata: Metadata = {
  title: "Got an Idea? Submit Your App or Project Idea | Usama Javed Perth",
  description:
    "Transform your vision into reality. Whether it's a groundbreaking app or a problem that needs solving, let's build something extraordinary together — from concept to deployment.",
};

export default async function IdeasPage() {
  const space = await getSpaceMode();
  if (!space) return <IdeasClassic />;
  return (
    <>
      {/* Crawlable real-DOM copy of the ideas page — bots read what the canvas hides.
          Space mode only; the classic body is already crawlable. */}
      <div className="sr-only">
        <h1>Got an idea?</h1>
        <p>
          Transform your vision into reality. Whether it&apos;s a groundbreaking app or a problem
          that needs solving, let&apos;s build something extraordinary together.
        </p>
        <p>From concept to deployment with cutting-edge technology and innovative solutions.</p>

        <h2>What can we build together?</h2>
        <ul>
          <li>
            <strong>Startup Ideas</strong> — Transform your vision into a scalable product
          </li>
          <li>
            <strong>Mobile Apps</strong> — Native &amp; cross-platform solutions
          </li>
          <li>
            <strong>Web Platforms</strong> — Scalable web applications
          </li>
          <li>
            <strong>AI Solutions</strong> — Intelligent automation &amp; ML
          </li>
          <li>
            <strong>E-commerce</strong> — Online marketplace solutions
          </li>
          <li>
            <strong>Interactive</strong> — Engaging digital experiences
          </li>
        </ul>

        <h2>Share your vision.</h2>
        <p>
          Fill in the details below and I&apos;ll get back to you within 24 hours with a plan to
          bring your idea to life.
        </p>

        <h2>Bring your ideas to me.</h2>
        <ul>
          <li>
            <strong>Idea to Reality</strong> — I transform concepts into fully functional
            applications with modern technology stack and scalable architecture.
          </li>
          <li>
            <strong>Rapid Prototyping</strong> — Quick MVP development to validate your ideas and
            get to market faster with iterative improvements.
          </li>
          <li>
            <strong>End-to-End Support</strong> — From initial concept to deployment and
            maintenance, I&apos;m with you every step of the journey.
          </li>
        </ul>
      </div>

      <IdeasDive />
    </>
  );
}
