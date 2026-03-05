'use client';

import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <ScrollReveal delay={0}>
            <div>
              <Link href="/" className="text-sm font-semibold tracking-wide font-[family-name:var(--font-space-grotesk)] transition-colors cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                UJ
              </Link>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-faint)' }}>
                Full Stack Developer in Perth, specializing in modern web technologies and AI integrations.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Pages</h3>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/ideas', label: 'Ideas' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/budget', label: 'Budget' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm transition-all duration-300 hover:translate-x-0.5 inline-block transform cursor-pointer" style={{ color: 'var(--text-faint)' }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Services</h3>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--text-faint)' }}>
                <li>Web Development</li>
                <li>AI Integration</li>
                <li>Enterprise Solutions</li>
                <li>Cloud Infrastructure</li>
                <li>Automation</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Connect</h3>
              <ul className="space-y-2.5">
                {[
                  { href: 'mailto:hellofromusama@gmail.com', label: 'Email' },
                  { href: 'https://wa.me/61433695387', label: 'WhatsApp', external: true },
                  { href: 'https://www.linkedin.com/in/hellofromusama/', label: 'LinkedIn', external: true },
                  { href: 'https://github.com/hellofromusama', label: 'GitHub', external: true },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="text-sm transition-all duration-300 hover:translate-x-0.5 inline-block transform cursor-pointer"
                      style={{ color: 'var(--text-faint)' }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={100}>
          <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>&copy; {currentYear} Usama Javed</p>
            <p className="text-xs" style={{ color: 'var(--text-ghost)' }}>Perth, Australia</p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
