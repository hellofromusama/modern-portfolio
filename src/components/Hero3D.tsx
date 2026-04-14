"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import InteractiveButton from "./InteractiveButton";

const Hero3DScene = dynamic(() => import("./Hero3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full animate-pulse" style={{ background: 'var(--bg-card)' }} />
  ),
});

export default function Hero3D() {
  const mouse = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0" style={{ opacity: 'var(--canvas-opacity)' }}>
        <Hero3DScene mouse={mouse} />
      </div>

      {/* Text overlay */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 pointer-events-none">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md mb-8 pointer-events-auto"
            style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>Available for projects</span>
          </div>

          {/* Name */}
          <h1 className={`font-[family-name:var(--font-space-grotesk)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="block">Usama</span>
            <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-flow">
              Javed
            </span>
          </h1>

          {/* Role */}
          <div className={`mt-8 max-w-lg transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="hero-description text-lg sm:text-xl font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Perth&apos;s Senior Full Stack Developer &<br />
              <span style={{ color: 'var(--text-muted)' }}>AI Integration Specialist</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-faint)' }}>
              8+ years building enterprise solutions that deliver results &mdash;
              $180K/year saved through automation, 100K+ concurrent users
              on cloud platforms, 50+ projects across Australia.
              Free consultation. Immediate start.
            </p>
          </div>

          {/* CTAs */}
          <div className={`mt-10 flex flex-wrap gap-4 pointer-events-auto transition-all duration-1000 delay-[600ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <InteractiveButton href="#projects" variant="primary" size="md">
              View Work
              <span className="inline-block ml-1">&rarr;</span>
            </InteractiveButton>
            <InteractiveButton href="/contact" variant="secondary" size="md">
              Contact
            </InteractiveButton>
          </div>

          {/* Stats */}
          <div className={`mt-16 flex gap-10 transition-all duration-1000 delay-[800ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { value: "50+", label: "Projects" },
              { value: "8+", label: "Years" },
              { value: "20+", label: "Technologies" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>{stat.value}</div>
                <div className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: 'var(--text-faint)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 delay-[1000ms] ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-faint)' }}>Scroll</span>
          <div className="w-[1px] h-8 animate-pulse" style={{ background: 'linear-gradient(to bottom, var(--text-faint), transparent)' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-flow {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient-flow { animation: gradient-flow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
