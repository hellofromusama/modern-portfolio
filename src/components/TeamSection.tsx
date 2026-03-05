"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

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
    socials: { linkedin: "#", github: "#" }
  },
  {
    id: "anas-javed",
    name: "Anas Javed",
    role: "Junior Data Scientist & Student",
    company: "Hangul Inc",
    image: "/team/anas-javed.png",
    socials: { linkedin: "#", github: "#" }
  }
];

export default function TeamSection() {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [activeMember, setActiveMember] = useState<number>(0);

  useEffect(() => {
    if (hoveredMember === null) {
      const interval = setInterval(() => {
        setActiveMember((prev) => (prev + 1) % teamMembers.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hoveredMember]);

  const displayedMember = hoveredMember
    ? teamMembers.find(m => m.id === hoveredMember)
    : teamMembers[activeMember];

  return (
    <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <ScrollReveal>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Team</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Featured<br />
                <span style={{ color: 'var(--text-secondary)' }}>people.</span>
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link
              href="/team"
              className="group text-xs tracking-wider transition-colors duration-300 flex items-center gap-2 cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              View all
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </ScrollReveal>
        </div>

        {/* Team Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left - Names list */}
          <ScrollReveal delay={100}>
            <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
              {teamMembers.map((member, index) => {
                const isActive = hoveredMember === member.id || (hoveredMember === null && index === activeMember);
                return (
                  <div
                    key={member.id}
                    className="group py-5 cursor-pointer transition-all duration-300 px-4"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isActive ? 'var(--bg-card)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredMember(member.id)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3
                          className="text-lg sm:text-xl font-semibold tracking-tight transition-all duration-300 font-[family-name:var(--font-space-grotesk)]"
                          style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-ghost)' }}
                        >
                          {member.name}
                        </h3>
                        <p
                          className="text-xs mt-1 transition-all duration-300"
                          style={{
                            color: isActive ? 'var(--accent-blue)' : 'var(--text-faint)',
                            opacity: isActive ? 1 : 0,
                          }}
                        >
                          {member.role}
                        </p>
                      </div>
                      <div className="flex gap-3 transition-all duration-300" style={{ opacity: isActive ? 1 : 0 }}>
                        {member.socials.twitter && (
                          <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-faint)' }} onClick={(e) => e.stopPropagation()}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </a>
                        )}
                        {member.socials.linkedin && (
                          <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-faint)' }} onClick={(e) => e.stopPropagation()}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                          </a>
                        )}
                        {member.socials.github && (
                          <a href={member.socials.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-faint)' }} onClick={(e) => e.stopPropagation()}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Right - Photo display */}
          <ScrollReveal delay={300} direction="right">
            <div className="lg:sticky lg:top-32 h-[550px] relative">
              <div
                className="w-full h-full relative overflow-hidden rounded-2xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                {teamMembers.map((member) => {
                  const isDisplayed = displayedMember?.id === member.id;
                  return (
                    <div key={member.id} className={`absolute inset-0 transition-all duration-700 ${isDisplayed ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full items-center justify-center absolute inset-0" style={{ background: 'var(--bg-secondary)', display: 'none' }}>
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
                            <span className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--text-ghost)' }}>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>{member.role}</p>
                        </div>
                      </div>

                      {/* Name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white/70 font-semibold font-[family-name:var(--font-space-grotesk)]">{member.name}</p>
                        <p className="text-white/30 text-sm">{member.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 justify-center mt-4">
                {teamMembers.map((member, i) => {
                  const isActive = displayedMember?.id === member.id;
                  return (
                    <button
                      key={member.id}
                      onClick={() => { setActiveMember(i); setHoveredMember(null); }}
                      className="h-1 rounded-full transition-all duration-500 cursor-pointer"
                      style={{
                        width: isActive ? 24 : 6,
                        background: isActive ? 'var(--accent-blue)' : 'var(--border-subtle)',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
