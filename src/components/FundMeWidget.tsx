'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'motion/react';

/*
 * Token-driven accent treatment for the fund-me widget.
 * Previously this component hardcoded warm magenta/violet/blue gradients + a dark
 * panel, which only read correctly in dark mode. We now drive the warm/playful
 * accent from theme tokens (--accent-violet -> --accent-blue) so it is
 * theme-correct in BOTH light and dark, while preserving the widget's identity.
 */
const ACCENT_GRADIENT = 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))';
const ACCENT_GRADIENT_SOFT =
  'linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-blue) 100%)';

export default function FundMeWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  // Show tooltip on first visit
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('fundme_tooltip_seen');
    if (!hasSeenTooltip) {
      setTimeout(() => {
        setShowTooltip(true);
        localStorage.setItem('fundme_tooltip_seen', 'true');
        setTimeout(() => setShowTooltip(false), 5000);
      }, 3000);
    }
  }, []);

  const navigateToFundMe = () => {
    router.push('/fund-me');
  };

  const handleClick = () => {
    if (isExpanded) {
      // Reduced-motion: skip the heart-rain delight and navigate straight away.
      if (reduceMotion) {
        navigateToFundMe();
        return;
      }

      // Start celebratory transition animation (delight on explicit click only)
      setIsAnimating(true);

      // Create fullscreen animation overlay (token-driven accent gradient)
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 z-[9999] pointer-events-none';
      overlay.innerHTML = `
        <div class="absolute inset-0 opacity-0 animate-fade-in-fast" style="background: ${ACCENT_GRADIENT_SOFT};"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-white text-6xl md:text-8xl font-bold animate-zoom-in">
            💖
          </div>
        </div>
        <div class="absolute inset-0 overflow-hidden">
          <div class="hearts-rain"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Add heart rain effect
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes heart-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.3s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoom-in 0.6s ease-out forwards;
        }
        .hearts-rain::before,
        .hearts-rain::after {
          content: '💖';
          position: absolute;
          font-size: 2rem;
          animation: heart-fall 2s linear infinite;
        }
        .hearts-rain::before {
          left: 20%;
          animation-delay: 0s;
        }
        .hearts-rain::after {
          left: 80%;
          animation-delay: 0.5s;
        }
      `;
      document.head.appendChild(style);

      // Navigate after animation
      setTimeout(() => {
        navigateToFundMe();
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.head.removeChild(style);
          setIsAnimating(false);
        }, 500);
      }, 800);
    } else {
      setIsExpanded(true);
      setTimeout(() => setIsExpanded(false), 5000);
    }
  };

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        {showTooltip && !isExpanded && (
          <div className={`absolute bottom-full right-0 mb-2 ${reduceMotion ? '' : 'animate-bounce-calm'}`}>
            <div
              className="text-white px-4 py-2 rounded-lg shadow-xl text-sm font-semibold whitespace-nowrap"
              style={{ background: ACCENT_GRADIENT }}
            >
              💖 Support my work!
              <div
                className="absolute -bottom-1 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent"
                style={{ borderTopColor: 'var(--accent-blue)' }}
              ></div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <div className="relative">
          {/* Pulse Ring — calmed + reduced-motion-gated */}
          {!reduceMotion && (
            <div
              className="absolute inset-0 rounded-full opacity-50 animate-ping-calm"
              style={{ background: ACCENT_GRADIENT }}
            ></div>
          )}

          {/* Glow Effect — calmed + reduced-motion-gated */}
          <div
            className={`absolute inset-0 rounded-full blur-xl opacity-50 ${
              reduceMotion ? '' : 'animate-pulse-calm'
            }`}
            style={{ background: ACCENT_GRADIENT }}
          ></div>

          {/* Button Container */}
          <button
            onClick={handleClick}
            disabled={isAnimating}
            aria-label="Open fund-me support widget"
            className={`relative text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${
              isExpanded ? 'px-6 py-4' : 'w-16 h-16 md:w-20 md:h-20'
            } ${isAnimating ? 'scale-150 opacity-0' : ''}`}
            style={{ background: ACCENT_GRADIENT }}
          >
            {isExpanded ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <span className={`text-2xl md:text-3xl ${reduceMotion ? '' : 'animate-bounce-calm'}`}>💖</span>
                <div className="text-left">
                  <div className="font-bold text-sm md:text-base whitespace-nowrap">Fund Me</div>
                  <div className="text-xs opacity-90 whitespace-nowrap">Support my work!</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className={`text-3xl md:text-4xl ${reduceMotion ? '' : 'animate-pulse-calm'}`}>💖</span>
              </div>
            )}
          </button>

          {/* Sparkles — calmed + reduced-motion-gated */}
          {!reduceMotion && (
            <>
              <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
              <div className="absolute -bottom-2 -left-2 text-xl animate-spin-reverse">⭐</div>
            </>
          )}
          {reduceMotion && (
            <>
              <div className="absolute -top-2 -right-2 text-2xl">✨</div>
              <div className="absolute -bottom-2 -left-2 text-xl">⭐</div>
            </>
          )}
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className={`absolute bottom-full right-0 mb-4 w-64 ${reduceMotion ? '' : 'animate-slide-up'}`}>
            <div
              className="backdrop-blur-xl rounded-2xl shadow-2xl border-2 overflow-hidden"
              style={{
                background: 'var(--bg-elevated)',
                borderColor: 'var(--border-hover)',
              }}
            >
              <div
                className="p-4 border-b"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--accent-violet) 18%, transparent), color-mix(in srgb, var(--accent-blue) 18%, transparent))',
                  borderColor: 'var(--border-default)',
                }}
              >
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>💖 Support Me</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Every contribution helps!</p>
              </div>
              <div className="p-4">
                <button
                  onClick={handleClick}
                  className="w-full text-white px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ background: ACCENT_GRADIENT }}
                >
                  🎉 View All Donation Options
                </button>
                <p className="text-xs text-center mt-3" style={{ color: 'var(--text-tertiary)' }}>
                  Click to see all the fun ways to support! 🚀
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations Styles — calmed (slower/subtler) variants */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        /* Calmed always-on motions: gentler amplitude + slower cadence */
        @keyframes ping-calm {
          0% { transform: scale(1); opacity: 0.45; }
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes pulse-calm {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce-calm {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15%); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-ping-calm {
          animation: ping-calm 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pulse-calm {
          animation: pulse-calm 3s ease-in-out infinite;
        }
        .animate-bounce-calm {
          animation: bounce-calm 2s ease-in-out infinite;
        }

        /* Defence-in-depth: even if useReducedMotion misfires, freeze motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-spin-slow,
          .animate-spin-reverse,
          .animate-ping-calm,
          .animate-pulse-calm,
          .animate-bounce-calm,
          .animate-slide-up {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
