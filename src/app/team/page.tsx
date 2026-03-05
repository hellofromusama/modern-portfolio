"use client";

import Navigation from "@/components/Navigation";
import ScrollReveal from "@/components/ScrollReveal";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export default function TeamPage() {
  const teamMembers: TeamMember[] = [
    {
      id: "usama-javed",
      name: "Usama Javed",
      role: "Full Stack Developer",
      company: "Digital Innovation Architect",
      image: "/team/usama-javed.png",
      socials: {
        linkedin: "https://www.linkedin.com/in/hellofromusama/",
        twitter: "https://x.com/hellofromusama",
        github: "https://github.com/hellofromusama"
      }
    },
    {
      id: "abdullah-shaukat",
      name: "Abdullah Shaukat",
      role: "Junior Software Engineer & Junior Data Scientist",
      company: "Hangul Inc",
      image: "/team/abdullah-shaukat.png",
      socials: {
        linkedin: "#",
        github: "#"
      }
    },
    {
      id: "anas-javed",
      name: "Anas Javed",
      role: "Junior Data Scientist & Student",
      company: "Hangul Inc",
      image: "/team/anas-javed.png",
      socials: {
        linkedin: "#",
        github: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navigation currentPage="team" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Team</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Our <span style={{ color: 'var(--text-secondary)' }}>team.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg max-w-3xl" style={{ color: 'var(--text-tertiary)' }}>
              Meet the talented individuals who make our vision a reality
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Team Grid */}
      <section className="relative z-10 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-x-8 lg:gap-y-10">
            {teamMembers.map((member, index) => (
              <ScrollReveal key={member.id} delay={index * 100}>
                <div className="group flex flex-col">
                  {/* Card */}
                  <div
                    className="relative rounded-xl overflow-hidden transition-all duration-500 h-full flex flex-col hover:-translate-y-1"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="relative w-full h-full">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div
                          className="w-full h-full items-center justify-center absolute inset-0"
                          style={{ background: 'var(--bg-secondary)', display: 'none' }}
                        >
                          <div className="text-center">
                            <div
                              className="w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-4"
                              style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}
                            >
                              <span className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--text-ghost)' }}>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-ghost)' }}>{member.role}</p>
                          </div>
                        </div>
                      </div>

                      {/* Social Links Overlay */}
                      <nav className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
                        {member.socials.twitter && (
                          <a
                            href={member.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-black/70 hover:bg-blue-500 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </a>
                        )}
                        {member.socials.linkedin && (
                          <a
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-black/70 hover:bg-blue-600 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                        {member.socials.github && (
                          <a
                            href={member.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-black/70 hover:bg-purple-600 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                      </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold mb-1 uppercase" style={{ color: 'var(--text-primary)' }}>
                        {member.name}
                      </h3>
                      <p className="text-sm uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                        {member.role}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--accent-blue)' }}>
                        {member.company}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
