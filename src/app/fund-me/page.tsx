'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import ScrollReveal, { MagneticHover, AnimatedCounter } from '@/components/ScrollReveal';
import InteractiveButton from '@/components/InteractiveButton';
import { HeartBroken, LoadingSuccess, LockUnlock } from '@/components/AnimatedIcons';

const InteractiveGlobe = dynamic(() => import('@/components/InteractiveGlobe'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] rounded-2xl animate-pulse" style={{ background: 'var(--bg-card)' }} />,
});

interface DonationOption {
  id: string;
  label: string;
  amount: number;
  description: string;
  icon: React.ReactNode;
}

export default function FundMePage() {
  const [selectedOption, setSelectedOption] = useState<DonationOption | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const donationOptions: DonationOption[] = [
    {
      id: 'coffee',
      label: 'Buy Me a Coffee',
      amount: 5,
      description: 'Fuel my coding sessions!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      id: 'meal',
      label: 'Buy Me a Meal',
      amount: 15,
      description: 'Keep me energized!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0A2.704 2.704 0 014.5 16 2.704 2.704 0 013 15.546M9 6v2m3-2v2m3-2v2M9 3h6m-5 6h4a1 1 0 011 1v7H8v-7a1 1 0 011-1z" /></svg>,
    },
    {
      id: 'project',
      label: 'Support This Project',
      amount: 10,
      description: 'Help improve this portfolio!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
    },
    {
      id: 'pants',
      label: 'Buy Me New Pants',
      amount: 50,
      description: 'My pants have holes!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    },
    {
      id: 'computer',
      label: 'Upgrade My Computer',
      amount: 100,
      description: 'Help me get faster hardware!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>,
    },
    {
      id: 'chair',
      label: 'New Gaming Chair',
      amount: 200,
      description: 'My back hurts from coding!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
    },
    {
      id: 'headphones',
      label: 'Buy Me Headphones',
      amount: 150,
      description: 'Better sound for coding focus!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>,
    },
    {
      id: 'monitor',
      label: 'Buy Me a Monitor',
      amount: 300,
      description: 'More screen space = more code!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.125c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125z" /></svg>,
    },
    {
      id: 'vacation',
      label: 'Send Me on Vacation',
      amount: 1000,
      description: 'Even devs need breaks!',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
    },
  ];

  const handleDonationClick = (option: DonationOption) => {
    setSelectedOption(option);
    setCustomAmount('');
  };

  const handleCustomAmountSelect = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      setSelectedOption({
        id: 'custom',
        label: 'Custom Amount',
        amount: parseFloat(customAmount),
        description: 'Your generous contribution!',
        icon: <HeartBroken size={24} />,
      });
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedOption) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedOption.amount,
          label: selectedOption.label,
          message: message
        })
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session. Please try again.');
        setIsProcessing(false);
      }
    } catch {
      alert('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navigation currentPage="fund-me" />

      <div className="pt-20">
        {/* Header */}
        <section className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <ScrollReveal>
                  <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md mb-6"
                    style={{ border: '1px solid var(--border-default)', background: 'var(--bg-card)' }}
                  >
                    <HeartBroken size={14} className="text-rose-400" />
                    <span className="text-[11px] tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>Support My Work</span>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={100}>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 font-[family-name:var(--font-space-grotesk)]">
                    Fund<br />
                    <span style={{ color: 'var(--text-secondary)' }}>me.</span>
                  </h1>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                  <p className="text-lg max-w-md mb-4" style={{ color: 'var(--text-tertiary)' }}>
                    Love my work? Support me with a contribution! Every donation helps me create better projects and maintain this portfolio.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <p className="text-sm max-w-md" style={{ color: 'var(--text-faint)' }}>
                    All donations go towards improving skills, tools, and late-night coding fuel.
                  </p>
                </ScrollReveal>
              </div>

              {/* Globe */}
              <ScrollReveal delay={200} direction="right">
                <div className="relative">
                  <InteractiveGlobe className="w-full h-[350px] md:h-[400px]" />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-faint)' }}>Drag to explore</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Globe Stats */}
        <section style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 150, suffix: "+", label: "Global Reach" },
                { value: 50, suffix: "ms", label: "Response Time" },
                { value: 99, suffix: ".9%", label: "Uptime" },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 100}>
                  <div className="text-center p-4">
                    <div className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--text-primary)' }}>
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--text-faint)' }}>{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Donation Options */}
            <div>
              <ScrollReveal>
                <h2 className="text-2xl font-bold mb-8 font-[family-name:var(--font-space-grotesk)]">
                  Choose your <span style={{ color: 'var(--text-secondary)' }}>support level.</span>
                </h2>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {donationOptions.map((option, i) => (
                  <ScrollReveal key={option.id} delay={i * 50}>
                    <button
                      onClick={() => handleDonationClick(option)}
                      className="w-full p-4 rounded-xl transition-all duration-300 text-left cursor-pointer group hover:-translate-y-0.5"
                      style={{
                        border: `1px solid ${selectedOption?.id === option.id ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                        background: selectedOption?.id === option.id ? 'color-mix(in srgb, var(--accent-blue) 10%, transparent)' : 'var(--bg-card)',
                        boxShadow: selectedOption?.id === option.id ? 'var(--shadow-card)' : 'none',
                      }}
                      onMouseEnter={e => {
                        if (selectedOption?.id !== option.id) {
                          e.currentTarget.style.borderColor = 'var(--border-hover)';
                          e.currentTarget.style.background = 'var(--bg-card-hover)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (selectedOption?.id !== option.id) {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.background = 'var(--bg-card)';
                        }
                      }}
                    >
                      <div className="mb-2 transition-colors duration-300" style={{ color: selectedOption?.id === option.id ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                        {option.icon}
                      </div>
                      <div className="font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>{option.label}</div>
                      <div className="text-xl font-bold mt-1 font-[family-name:var(--font-space-grotesk)]" style={{ color: selectedOption?.id === option.id ? 'var(--accent-blue)' : 'var(--text-tertiary)' }}>
                        ${option.amount} <span className="text-xs font-normal" style={{ color: 'var(--text-faint)' }}>AUD</span>
                      </div>
                      <div className="text-[11px] mt-1" style={{ color: 'var(--text-faint)' }}>{option.description}</div>
                    </button>
                  </ScrollReveal>
                ))}
              </div>

              {/* Custom Amount */}
              <ScrollReveal delay={200}>
                <div className="rounded-xl p-5" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-tertiary)' }}>Custom Amount</h3>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount in AUD"
                      className="flex-1 rounded-lg px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <InteractiveButton
                      onClick={handleCustomAmountSelect}
                      variant="secondary"
                      size="md"
                    >
                      Select
                    </InteractiveButton>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column - Payment */}
            <div>
              <ScrollReveal delay={100}>
                <h2 className="text-2xl font-bold mb-8 font-[family-name:var(--font-space-grotesk)]">
                  Your support <span style={{ color: 'var(--text-secondary)' }}>details.</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
                  {selectedOption ? (
                    <div className="mb-6 p-4 rounded-lg" style={{ border: '1px solid var(--accent-blue)', background: 'color-mix(in srgb, var(--accent-blue) 8%, transparent)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span style={{ color: 'var(--accent-blue)' }}>{selectedOption.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{selectedOption.label}</div>
                          <div className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--accent-blue)' }}>
                            ${selectedOption.amount} AUD
                          </div>
                        </div>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{selectedOption.description}</div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 rounded-lg text-center text-sm" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-faint)' }}>
                      Select a donation option above
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Add a Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Leave a message..."
                      rows={4}
                      className="w-full rounded-lg px-4 py-3 resize-none text-sm transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <InteractiveButton
                    onClick={handleProceedToPayment}
                    variant="primary"
                    size="lg"
                    className={`w-full justify-center ${(!selectedOption || isProcessing) ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <LoadingSuccess size={18} />
                        Processing...
                      </span>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </InteractiveButton>

                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: 'var(--text-faint)' }}>
                    <LockUnlock size={12} />
                    <span>Secure payment powered by Stripe</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Why Support */}
              <ScrollReveal delay={300}>
                <div className="rounded-xl p-6" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
                  <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-tertiary)' }}>Why Support Me?</h3>
                  <ul className="space-y-3">
                    {[
                      "Help me build more awesome projects",
                      "Fuel my late-night coding sessions",
                      "Support continuous learning & improvement",
                      "Upgrade my development tools & equipment",
                      "Keep this portfolio free & open for everyone",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--accent-blue)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Bottom CTA */}
          <ScrollReveal delay={200}>
            <div className="mt-16 p-8 rounded-xl text-center" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
              <h3 className="text-xl font-semibold mb-3 font-[family-name:var(--font-space-grotesk)]">
                Thank you for your support!
              </h3>
              <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
                Every contribution, no matter the size, makes a huge difference and keeps me motivated to create better projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <InteractiveButton href="/budget" variant="primary">
                  Get a Project Quote
                </InteractiveButton>
                <InteractiveButton href="/contact" variant="secondary">
                  Contact Me
                </InteractiveButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
