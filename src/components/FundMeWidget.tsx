'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FundMeWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();

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

  const handleClick = () => {
    if (isExpanded) {
      // Start amazing transition animation
      setIsAnimating(true);

      // Create fullscreen animation overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 z-[9999] pointer-events-none';
      overlay.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 opacity-0 animate-fade-in-fast"></div>
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
        router.push('/fund-me');
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
          <div className="absolute bottom-full right-0 mb-2 animate-bounce">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-semibold whitespace-nowrap">
              💖 Support my work!
              <div className="absolute -bottom-1 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-purple-600"></div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <div className="relative">
          {/* Pulse Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-75 animate-ping"></div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-xl opacity-60 animate-pulse"></div>

          {/* Button Container */}
          <button
            onClick={handleClick}
            disabled={isAnimating}
            className={`relative bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${
              isExpanded ? 'px-6 py-4' : 'w-16 h-16 md:w-20 md:h-20'
            } ${isAnimating ? 'scale-150 opacity-0' : ''}`}
          >
            {isExpanded ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <span className="text-2xl md:text-3xl animate-bounce">💖</span>
                <div className="text-left">
                  <div className="font-bold text-sm md:text-base whitespace-nowrap">Fund Me</div>
                  <div className="text-xs opacity-90 whitespace-nowrap">Support my work!</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-3xl md:text-4xl animate-pulse">💖</span>
              </div>
            )}
          </button>

          {/* Sparkles */}
          <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
          <div className="absolute -bottom-2 -left-2 text-xl animate-spin-reverse">⭐</div>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-4 w-64 animate-slide-up">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-pink-500/50 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-4 border-b border-pink-500/30">
                <h3 className="font-bold text-white mb-1">💖 Support Me</h3>
                <p className="text-xs text-slate-300">Every contribution helps!</p>
              </div>
              <div className="p-4">
                <button
                  onClick={handleClick}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🎉 View All Donation Options
                </button>
                <p className="text-xs text-slate-400 text-center mt-3">
                  Click to see all the fun ways to support! 🚀
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations Styles */}
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
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 4s linear infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}