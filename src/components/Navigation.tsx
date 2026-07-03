'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE_SIGNATURE } from '@/lib/motion';
import ThemeToggle from './ThemeToggle';
import InteractiveButton from './InteractiveButton';

interface NavigationProps {
  // Retained for backward compatibility — 7 call sites pass it. Active-page
  // state is derived from `usePathname()`, so the value itself is unused here.
  currentPage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Navigation({ currentPage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  // Refs for focus management: the toggle to restore focus to, and the menu
  // panel whose focusable children we trap focus within while open.
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    { href: '/ai-engineering', label: 'AI Engineering' },
    { href: '/ideas', label: 'Ideas' },
    { href: '/contact', label: 'Contact' },
    { href: '/budget', label: 'Budget' },
    { href: '/fund-me', label: 'Fund Me' },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  // a11y: while the mobile menu is open — Escape closes (restoring focus to the
  // toggle), focus is trapped within the panel, and the first item is focused on
  // open. The background is made inert/aria-hidden via the wrapper below.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const menuEl = menuRef.current;
    if (!menuEl) return;

    // Make the rest of the page inert + hidden from assistive tech while the
    // menu is open. The <nav> is a fixed sibling of the page content, so we mark
    // every top-level body child that isn't this nav as inert/aria-hidden, then
    // restore them on close. `inert` removes them from tab order and pointer/AT.
    const navEl = menuEl.closest('nav');
    const inerted: HTMLElement[] = [];
    Array.from(document.body.children).forEach((child) => {
      const el = child as HTMLElement;
      if (el === navEl || el.contains(navEl)) return;
      if (!el.hasAttribute('inert')) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
        inerted.push(el);
      }
    });

    const getFocusable = () =>
      Array.from(
        menuEl.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Focus the first focusable item on open.
    const focusables = getFocusable();
    focusables[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        const items = getFocusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement | null;

        // Cycle focus within the open panel.
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (active && !menuEl.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore the previously-inerted background content on close/unmount.
      inerted.forEach((el) => {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      });
    };
  }, [isMobileMenuOpen]);

  // Shared focus-visible ring (token --accent-blue) for keyboard users.
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

  // Anthropic-style logo morph: the "sama " / "aved" segments collapse to width 0
  // once `scrolled` flips (window.scrollY > 20), leaving "UJ". `scrolled` starts
  // false, so SSR HTML carries the full "Usama Javed" wordmark (no flash, SEO-safe).
  const segStyle: React.CSSProperties = {
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    verticalAlign: 'bottom', // inline-block + overflow:hidden shifts baseline; keep glyphs level with U/J
    maxWidth: scrolled ? 0 : '4em', // 4em safely exceeds each segment's natural width at text-sm
    opacity: scrolled ? 0 : 1,
    transition: reduceMotion
      ? 'opacity 0.3s ease' // reduced motion: crossfade only, width snaps
      : 'max-width 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease', // EASE_SIGNATURE as CSS string
  };

  // Motion underline: a scaleX span driven by variants tied to the link's
  // hover/active state — no imperative inline-style DOM mutation.
  const underlineVariants = {
    rest: { scaleX: 0 },
    hover: { scaleX: 1 },
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        background: scrolled ? 'var(--bg-nav)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition:
          'opacity 0.8s ease, transform 0.8s ease, background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            aria-label="Usama Javed — home"
            className={`text-sm font-semibold tracking-wide font-[family-name:var(--font-space-grotesk)] rounded-md ${focusRing}`}
            style={{ color: 'var(--text-primary)' }}
          >
            {/* The nbsp lives INSIDE the first collapse span: a trailing normal space
                inside an inline-block gets trimmed ("UsamaJaved"), and a leading space
                on the always-visible J would survive collapse ("U J"). */}
            <span aria-hidden="true" style={{ whiteSpace: 'nowrap' }}>
              U<span style={segStyle}>sama&nbsp;</span>J<span style={segStyle}>aved</span>
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            ref={toggleRef}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={`md:hidden p-2 rounded-md transition-colors cursor-pointer ${focusRing}`}
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
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
            {navItems.map((item) => {
              const active = isActivePage(item.href);
              return (
                <motion.div key={item.href} initial="rest" animate="rest" whileHover="hover" className="relative">
                  <Link
                    href={item.href}
                    className={`relative block text-xs tracking-wide rounded-sm transition-colors duration-300 ${focusRing}`}
                    style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-px w-full origin-left"
                      style={{ background: 'currentColor' }}
                      variants={active ? undefined : underlineVariants}
                      initial={false}
                      animate={active ? { scaleX: 1 } : undefined}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE_SIGNATURE }}
                    />
                  </Link>
                </motion.div>
              );
            })}

            {pathname === '/' && (
              <>
                {['About', 'Projects'].map((label) => (
                  <motion.div key={label} initial="rest" animate="rest" whileHover="hover" className="relative">
                    <a
                      href={`#${label.toLowerCase()}`}
                      className={`relative block text-xs tracking-wide rounded-sm transition-colors duration-300 ${focusRing}`}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {label}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-px w-full origin-left"
                        style={{ background: 'currentColor' }}
                        variants={underlineVariants}
                        initial={false}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE_SIGNATURE }}
                      />
                    </a>
                  </motion.div>
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

        {/* Mobile menu — AnimatePresence drives open AND close choreography */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              id="mobile-menu"
              ref={menuRef}
              className="md:hidden overflow-hidden backdrop-blur-xl"
              style={{
                background: 'var(--bg-nav)',
                borderTop: '1px solid var(--border-subtle)',
              }}
              initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: EASE_SIGNATURE }}
            >
              <div className="py-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-sm transition-colors duration-300 rounded-lg ${focusRing}`}
                    style={{
                      color: isActivePage(item.href) ? 'var(--text-primary)' : 'var(--text-muted)',
                      background: isActivePage(item.href) ? 'var(--bg-card)' : 'transparent',
                    }}
                    aria-current={isActivePage(item.href) ? 'page' : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}

                {pathname === '/' && (
                  <>
                    <a
                      href="#about"
                      className={`block px-4 py-3 text-sm transition-colors rounded-lg ${focusRing}`}
                      style={{ color: 'var(--text-muted)' }}
                      onClick={closeMenu}
                    >
                      About
                    </a>
                    <a
                      href="#projects"
                      className={`block px-4 py-3 text-sm transition-colors rounded-lg ${focusRing}`}
                      style={{ color: 'var(--text-muted)' }}
                      onClick={closeMenu}
                    >
                      Projects
                    </a>
                  </>
                )}

                <div className="pt-4 px-4 space-y-3 mt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                  <a
                    href="https://wa.me/61433695387"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center px-5 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer ${focusRing}`}
                    style={{ border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                    onClick={closeMenu}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
