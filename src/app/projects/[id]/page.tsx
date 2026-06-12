import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, projectList } from "@/content/projects";

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

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              UJ
            </Link>
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/#about" className="hover:text-blue-400 transition-all duration-300">About</Link>
              <Link href="/#projects" className="hover:text-blue-400 transition-all duration-300">Projects</Link>
              <Link href="/ideas" className="hover:text-purple-400 transition-all duration-300">Ideas</Link>
              <Link href="/contact" className="hover:text-blue-400 transition-all duration-300">Contact</Link>
              <a
                href="https://www.linkedin.com/in/hellofromusama/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Hire Me →
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/#projects"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
            >
              ← Back to Projects
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                  {project.category}
                </span>
              </div>

              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {project.title}
              </h1>

              <h2 className="text-2xl text-slate-300 mb-8 font-light">
                {project.subtitle}
              </h2>

              <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Timeline</div>
                  <div className="text-lg font-semibold text-blue-400">{project.timeline}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Team Size</div>
                  <div className="text-lg font-semibold text-purple-400">{project.team}</div>
                </div>
              </div>
            </div>

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`h-96 bg-gradient-to-br ${project.gradient} rounded-2xl relative overflow-hidden block group cursor-pointer transition-transform duration-300 hover:scale-105`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    🔗
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <div className="text-white/90 text-lg font-semibold group-hover:text-white transition-colors">
                    🌐 Visit Live Website
                  </div>
                  <div className="text-white/70 text-sm mt-1 group-hover:text-white/90 transition-colors">
                    Click to open →
                  </div>
                </div>
              </a>
            ) : (
              <div className={`h-96 bg-gradient-to-br ${project.gradient} rounded-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6">
                  <div className="text-white/90 text-lg font-semibold">Live Project</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Technology Stack
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {project.tech.map((tech) => (
              <span key={tech} className="px-6 py-3 bg-slate-900/50 border border-slate-600 rounded-full text-slate-300 hover:border-blue-500/50 hover:text-blue-300 transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-blue-400">Project Overview</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                  {project.longDescription}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 text-purple-400">Key Features</h2>
              <div className="space-y-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0" />
                    <p className="text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Results */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-orange-400">Challenges Solved</h2>
              <div className="space-y-6">
                {project.challenges.map((challenge, index) => (
                  <div key={index} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-slate-300">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 text-green-400">Results Achieved</h2>
              <div className="space-y-6">
                {project.results.map((result, index) => (
                  <div key={index} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700 border-l-4 border-l-green-400">
                    <p className="text-slate-300">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Interested in Similar Solutions?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            I can help you build similar high-performance solutions tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              Discuss Your Project
            </Link>
            <Link
              href="/#projects"
              className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 hover:bg-blue-400/10"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}