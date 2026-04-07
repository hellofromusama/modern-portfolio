"use client";

import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import ScrollReveal, { AnimatedCounter } from "@/components/ScrollReveal";
import InteractiveButton from "@/components/InteractiveButton";
import AISeoContent from "@/components/AISeoContent";
import LastUpdated from "@/components/LastUpdated";

const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => <div className="animate-pulse h-96" style={{ background: 'var(--bg-card)' }}></div>,
  ssr: false
});

const VisitorTracker = dynamic(() => import("@/components/VisitorTracker"), {
  ssr: false
});

const VisitorCounter = dynamic(() => import("@/components/VisitorCounter"), {
  ssr: false
});

const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  loading: () => <div className="animate-pulse h-[92vh]" style={{ background: 'var(--bg-card)' }}></div>,
  ssr: false
});

const TeamSection = dynamic(() => import("@/components/TeamSection"), {
  loading: () => <div className="animate-pulse h-96" style={{ background: 'var(--bg-card)' }}></div>,
  ssr: false
});

export default function Home() {

  const projects = [
    {
      id: "kashmir-fund",
      title: "Fund for Azad Kashmir",
      description: "Humanitarian donation platform with Stripe integration and transparent fund tracking",
      tech: ["Next.js 15", "React 19", "Stripe", "Tailwind CSS"],
      category: "Humanitarian"
    },
    {
      id: "n8n-automation",
      title: "N8N Automation Platform",
      description: "Enterprise automation workflows connecting 200+ services with custom business logic",
      tech: ["N8N", "Node.js", "PostgreSQL", "Docker"],
      category: "Automation"
    },
    {
      id: "voice-ai-agent",
      title: "Voice AI Booking Agent",
      description: "AI-powered voice assistant for automated appointment scheduling",
      tech: ["OpenAI", "Speech-to-Text", "Node.js", "WebRTC"],
      category: "AI/ML"
    },
    {
      id: "erp-system",
      title: "Enterprise Resource Planning",
      description: "Full-scale ERP with inventory, CRM, and financial management modules",
      tech: ["React", "Node.js", "PostgreSQL", "Redis"],
      category: "Enterprise"
    },
    {
      id: "netsuite-integration",
      title: "NetSuite Integration Suite",
      description: "Custom SuiteScripts and RESTlets for seamless third-party integrations",
      tech: ["SuiteScript", "RESTlets", "JavaScript", "OAuth"],
      category: "Integration"
    },
    {
      id: "cloud-infrastructure",
      title: "Cloud Infrastructure Platform",
      description: "Scalable microservices architecture with automated CI/CD pipelines",
      tech: ["AWS", "Docker", "Kubernetes", "Terraform"],
      category: "DevOps"
    }
  ];

  const skills = [
    { title: "Frontend", accent: "blue", items: ["React / Next.js 15", "TypeScript", "Tailwind CSS", "Vue.js / Nuxt.js"] },
    { title: "Backend", accent: "violet", items: ["Node.js / Express", "Python / Django", "PostgreSQL / MongoDB", "REST / GraphQL"] },
    { title: "Cloud & DevOps", accent: "emerald", items: ["AWS / Azure / GCP", "Docker / Kubernetes", "CI/CD Pipelines", "Terraform"] },
    { title: "Specializations", accent: "amber", items: ["NetSuite SuiteScripts", "N8N Automation", "AI/ML Integration", "ERP Systems"] }
  ];

  const accentMap: Record<string, { dot: string; text: string }> = {
    blue: { dot: "bg-blue-400", text: "text-blue-400" },
    violet: { dot: "bg-violet-400", text: "text-violet-400" },
    emerald: { dot: "bg-emerald-400", text: "text-emerald-400" },
    amber: { dot: "bg-amber-400", text: "text-amber-400" },
  };

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="overflow-hidden">
      <AISeoContent />
      <VisitorTracker />
      <VisitorCounter />
      <Navigation currentPage="home" />

      {/* Hero */}
      <section className="relative z-10 pt-16">
        <Suspense fallback={<div className="animate-pulse h-[90vh]" style={{ background: 'var(--bg-card)' }}></div>}>
          <Hero3D />
        </Suspense>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* About */}
      <section id="about" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8" aria-labelledby="about-heading">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-3 space-y-6">
              <ScrollReveal>
                <p className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: 'var(--text-muted)' }}>About</p>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h2 id="about-heading" className="text-4xl sm:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                  Building digital<br />
                  <span style={{ color: 'var(--text-secondary)' }}>excellence.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="bio-summary text-lg leading-relaxed max-w-xl" style={{ color: 'var(--text-tertiary)' }}>
                  Senior Full Stack Developer with 8+ years of expertise delivering 50+ enterprise projects
                  across government, mining, fintech, and healthcare sectors in Perth, Western Australia.
                  From AI-powered automation saving clients $180,000/year to cloud platforms handling
                  100K+ concurrent users, I build solutions that drive measurable business growth.
                </p>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { value: 50, suffix: "+", label: "Projects" },
                { value: 8, suffix: "+", label: "Years" },
                { value: 20, suffix: "+", label: "Technologies" },
                { value: 100, suffix: "%", label: "Satisfaction" },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={100 + i * 100} direction="up">
                  <div
                    className="group p-6 rounded-xl transition-all duration-500 cursor-default"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--bg-card-hover)';
                      e.currentTarget.style.borderColor = 'var(--border-hover)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* Skills */}
      <section id="skills" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8" aria-labelledby="skills-heading">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Expertise</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 id="skills-heading" className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-space-grotesk)]">
              Technical<br />
              <span style={{ color: 'var(--text-secondary)' }}>stack.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="key-skills-summary text-sm mb-16 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              Mastery in 20+ technologies including React 19, Next.js 15, Node.js, TypeScript, Python, AI/ML integration,
              AWS, Docker, Kubernetes, and NetSuite — delivering enterprise-grade solutions across every layer of the stack.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map((skill, i) => {
              const colors = accentMap[skill.accent];
              return (
                <ScrollReveal key={skill.title} delay={i * 100} direction="up">
                  <div
                    className="group p-6 rounded-xl transition-all duration-500 cursor-default h-full"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--bg-card-hover)';
                      e.currentTarget.style.borderColor = 'var(--border-hover)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} group-hover:scale-150 transition-transform duration-300`} />
                      <h3 className={`text-sm font-semibold tracking-wide ${colors.text}`}>{skill.title}</h3>
                    </div>
                    <div className="space-y-2.5">
                      {skill.items.map((item, j) => (
                        <div key={item} className="text-sm transition-all duration-300" style={{ color: 'var(--text-muted)', transitionDelay: `${j * 50}ms` }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* Projects */}
      <section id="projects" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8" aria-labelledby="projects-heading">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Work</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 id="projects-heading" className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-space-grotesk)]">
              Featured<br />
              <span style={{ color: 'var(--text-secondary)' }}>projects.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="project-highlights text-sm mb-16 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              Enterprise solutions delivering measurable results — from automation platforms saving $180K/year
              to cloud infrastructure supporting 100K+ concurrent users with 99.99% uptime.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 80} direction="up">
                <Link href={`/projects/${project.id}`}>
                  <div
                    className="group h-full p-6 rounded-xl transition-all duration-500 cursor-pointer hover:-translate-y-1"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--bg-card-hover)';
                      e.currentTarget.style.borderColor = 'var(--border-hover)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: 'var(--text-faint)' }}>
                        {project.category}
                      </span>
                      <span className="text-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: 'var(--text-faint)' }}>&nearr;</span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 transition-colors duration-300 font-[family-name:var(--font-space-grotesk)]">
                      {project.title}
                    </h3>
                    <p className="text-sm mb-5 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-[11px] rounded-md transition-all duration-300"
                          style={{
                            color: 'var(--text-muted)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* Team */}
      <Suspense fallback={<div className="animate-pulse h-96" style={{ background: 'var(--bg-card)' }}></div>}>
        <TeamSection />
      </Suspense>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* Contact */}
      <section id="contact" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8" aria-labelledby="contact-heading">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Contact</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 id="contact-heading" className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-space-grotesk)]">
              Let&apos;s work<br />
              <span style={{ color: 'var(--text-secondary)' }}>together.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="cta-section text-lg mb-12 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
              Ready to bring your ideas to life? Get a free 30-minute consultation.
              Available for immediate start — Perth, Australia and worldwide remote.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <InteractiveButton href="mailto:hellofromusama@gmail.com" variant="primary" size="lg">
                Send an Email
              </InteractiveButton>
              <InteractiveButton href="/contact" variant="secondary" size="lg">
                Contact Form
              </InteractiveButton>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex justify-center gap-8">
              {[
                { href: "https://www.linkedin.com/in/hellofromusama/", label: "LinkedIn" },
                { href: "https://github.com/hellofromusama", label: "GitHub" },
                { href: "https://x.com/hellofromusama", label: "X" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-all duration-300 hover:-translate-y-0.5 transform cursor-pointer"
                  style={{ color: 'var(--text-faint)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* FAQ */}
      <Suspense fallback={<div className="animate-pulse h-96" style={{ background: 'var(--bg-card)' }}></div>}>
        <FAQ />
      </Suspense>

      {/* Last Updated - AI freshness signal */}
      <LastUpdated />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
