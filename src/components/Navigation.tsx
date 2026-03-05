'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import InteractiveButton from './InteractiveButton';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActivePage = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/ideas', label: 'Ideas' },
    { href: '/contact', label: 'Contact' },
    { href: '/budget', label: 'Budget' },
    { href: '/fund-me', label: 'Fund Me' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        background: scrolled ? 'var(--bg-nav)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'opacity 0.8s ease, transform 0.8s ease, background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-sm font-semibold tracking-wide font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--text-primary)' }}>
            UJ
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-xs tracking-wide transition-colors duration-300 group"
                style={{ color: isActivePage(item.href) ? 'var(--text-primary)' : 'var(--text-muted)' }}
                onMouseEnter={e => { if (!isActivePage(item.href)) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={e => { if (!isActivePage(item.href)) e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {item.label}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                  style={{
                    background: 'currentColor',
                    width: isActivePage(item.href) ? '100%' : '0%',
                  }}
                  ref={el => {
                    if (el) {
                      const parent = el.parentElement;
                      if (parent) {
                        parent.onmouseenter = () => { el.style.width = '100%'; };
                        parent.onmouseleave = () => { if (!isActivePage(item.href)) el.style.width = '0%'; };
                      }
                    }
                  }}
                />
              </Link>
            ))}

            {pathname === '/' && (
              <>
                {['About', 'Projects'].map(label => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase()}`}
                    className="relative text-xs tracking-wide transition-colors duration-300 group"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {label}
                  </a>
                ))}
              </>
            )}

            <ThemeToggle />

            <InteractiveButton
              href="https://www.linkedin.com/in/hellofromusama/"
              external
              variant="primary"
              size="sm"
            >
              Hire Me
            </InteractiveButton>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden backdrop-blur-xl"
            style={{
              background: 'var(--bg-nav)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div className="py-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-sm transition-colors duration-300 rounded-lg"
                  style={{
                    color: isActivePage(item.href) ? 'var(--text-primary)' : 'var(--text-muted)',
                    background: isActivePage(item.href) ? 'var(--bg-card)' : 'transparent',
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {pathname === '/' && (
                <>
                  <a href="#about" className="block px-4 py-3 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setIsMobileMenuOpen(false)}>About</a>
                  <a href="#projects" className="block px-4 py-3 text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
                </>
              )}

              <div className="pt-4 px-4 space-y-3 mt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Theme</span>
                  <ThemeToggle />
                </div>
                <a
                  href="https://wa.me/61433695387"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-5 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer"
                  style={{ border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                >
                  WhatsApp
                </a>
                <InteractiveButton
                  href="https://www.linkedin.com/in/hellofromusama/"
                  external
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                >
                  Hire Me
                </InteractiveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
