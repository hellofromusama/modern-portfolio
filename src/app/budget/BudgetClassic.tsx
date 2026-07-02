'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function BudgetClassic() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! 👋 I\'m Usama\'s AI Budget Calculator. I\'m here to help estimate your project cost and timeline.\n\n**Please describe your project:** What features do you need? What problem are you solving? Any specific technologies required?\n\n*💡 Note: This is a fun AI tool for quick estimates. For accurate quotes, contact Usama directly!*',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/budget-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: userInput,
          conversationHistory: messages
        })
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get estimate');
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I couldn\'t process your request right now. Please try again or contact me directly at hellofromusama@gmail.com for a personalized quote.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Animated Money/Calculator Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-6xl opacity-5 animate-float-slow">💰</div>
        <div className="absolute top-40 right-32 text-5xl opacity-5 animate-float-slow delay-1000">💸</div>
        <div className="absolute bottom-40 left-1/4 text-7xl opacity-5 animate-float-slow delay-2000">🧮</div>
        <div className="absolute bottom-60 right-1/3 text-6xl opacity-5 animate-float-slow delay-3000">📊</div>
        <div className="absolute top-1/2 left-1/3 text-5xl opacity-5 animate-float-slow delay-4000">💵</div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom right, color-mix(in srgb, var(--accent-emerald) 5%, transparent), transparent, color-mix(in srgb, var(--accent-blue) 5%, transparent))" }}></div>
      </div>

      <div className="relative z-10">
        <Navigation currentPage="budget" />

        <div className="pt-20">
          {/* Header */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`} style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--accent-emerald) 14%, transparent), color-mix(in srgb, var(--accent-blue) 14%, transparent))", borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
              <div className="text-center mb-3 md:mb-4">
                <span className="inline-block px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4 animate-pulse-glow" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--accent-emerald)" }}>
                  🎉 Fun AI-Powered Budget Calculator
                </span>
              </div>
              <div className="flex justify-center mb-4">
                <span className="text-6xl animate-bounce-money">💰</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 md:mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)] bg-clip-text text-transparent animate-shimmer" style={{ backgroundImage: "linear-gradient(to right, var(--accent-emerald), var(--accent-blue))" }}>
                Project Budget Calculator
              </h1>
              <p className="text-base md:text-xl text-center max-w-3xl mx-auto mb-3 md:mb-4" style={{ color: "var(--text-tertiary)" }}>
                Get instant estimates for your web development project. Describe your requirements and get detailed cost and timeline information.
              </p>
              <p className="text-xs md:text-sm text-center max-w-2xl mx-auto italic" style={{ color: "var(--text-muted)" }}>
                ⚡ This is an AI-powered tool for quick estimates. For accurate quotes, please contact directly.
              </p>
            </div>
          </div>

        {/* Chat Interface */}
        <div className={`max-w-4xl mx-auto px-4 py-4 md:py-8 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{transitionDelay: '300ms'}}>
          <div className="rounded-xl transition-all duration-500" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            {/* Chat Messages */}
            <div className="h-[50vh] md:h-96 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] md:max-w-3xl rounded-lg px-3 md:px-4 py-2 md:py-3"
                    style={message.role === 'user'
                      ? { background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }
                      : { background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
                  >
                    <div
                      className="text-xs sm:text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    <div className="text-[10px] sm:text-xs opacity-60 mt-1 md:mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent-blue)" }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ background: "var(--accent-blue)" }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ background: "var(--accent-blue)" }}></div>
                      <span className="ml-2" style={{ color: "var(--text-tertiary)" }}>Calculating estimate...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-3 md:p-6" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Describe your project (e.g., 'I need an e-commerce website with payment integration')"
                  className="flex-1 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="disabled:opacity-50 disabled:cursor-not-allowed px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                  style={{ background: "linear-gradient(to right, var(--accent-emerald), var(--accent-blue))", color: "#fff" }}
                >
                  {isLoading ? 'Calculating...' : 'Get Estimate'}
                </button>
              </form>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--accent-emerald)" }}>💡 Sample Questions</h3>
              <div className="space-y-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
                <div>&quot;I need an e-commerce website with payment integration&quot;</div>
                <div>&quot;Build a custom CRM system for my business&quot;</div>
                <div>&quot;Create a mobile app with AI features&quot;</div>
                <div>&quot;Develop a SaaS platform with user authentication&quot;</div>
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--accent-blue)" }}>📊 What You&apos;ll Get</h3>
              <div className="space-y-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
                <div>• Detailed cost breakdown</div>
                <div>• Project timeline estimate</div>
                <div>• Technology recommendations</div>
                <div>• Feature analysis & suggestions</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            <h3 className="text-xl font-semibold mb-2 font-[family-name:var(--font-space-grotesk)]" style={{ color: "var(--text-primary)" }}>Need a Detailed Quote?</h3>
            <p className="mb-4" style={{ color: "var(--text-tertiary)" }}>
              For complex projects or personalized consultation, contact me directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hellofromusama@gmail.com"
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }}
              >
                Email: hellofromusama@gmail.com
              </a>
              <a
                href="https://wa.me/61433695387"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "var(--accent-emerald)", color: "#fff" }}
              >
                WhatsApp: +61 433 695 387
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.05;
          }
          50% {
            transform: translateY(-30px) translateX(20px) rotate(10deg);
            opacity: 0.1;
          }
        }

        @keyframes bounce-money {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          25% { transform: translateY(-15px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
          75% { transform: translateY(-12px) rotate(-3deg); }
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
            border-color: rgba(234, 179, 8, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.6);
            border-color: rgba(234, 179, 8, 0.8);
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-bounce-money {
          animation: bounce-money 2s ease-in-out infinite;
        }

        .animate-shimmer {
          background-size: 200% 200%;
          animation: shimmer 4s ease infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }

        .delay-3000 {
          animation-delay: 3s;
        }

        .delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}