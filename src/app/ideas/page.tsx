"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import emailjs from '@emailjs/browser';
import Navigation from '@/components/Navigation';
import ScrollReveal, { AnimatedCounter } from '@/components/ScrollReveal';
import InteractiveButton from '@/components/InteractiveButton';

const IdeaNetworkCanvas = dynamic(() => import('@/components/IdeaNetworkCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse" style={{ background: 'var(--bg-card)' }} />,
});

export default function Ideas() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ideaType: "app",
    title: "",
    description: "",
    problem: "",
    targetAudience: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      emailjs.init('5eLu74wM2kSgwd6fT');

      const ideaMessage = `=== NEW IDEA SUBMISSION ===

From: ${formData.name}
Email: ${formData.email}
Type: ${formData.ideaType === "app" ? "App Idea" : "Problem to Solve"}

Title: ${formData.title}

Description:
${formData.description}

Problem Statement:
${formData.problem}

Target Audience:
${formData.targetAudience}

Budget Range: ${formData.budget}

========================
Let's bring this idea to life together!`;

      const result = await emailjs.send(
        'service_gk2ggy2',
        'template_f6wbh0a',
        {
          from_name: formData.name,
          from_email: formData.email,
          to_name: 'Usama Javed',
          to_email: 'hellofromusama@gmail.com',
          subject: `New Idea: ${formData.title || "Untitled Project"}`,
          message: ideaMessage,
          reply_to: formData.email,
          time: new Date().toLocaleString()
        }
      );

      try {
        await emailjs.send(
          'service_gk2ggy2',
          'template_k0jvdur',
          {
            name: formData.name,
            to_email: formData.email,
            title: formData.title || "Your Idea Submission",
            reply_to: 'hellofromusama@gmail.com'
          }
        );
      } catch (autoReplyError) {
        console.log('Auto-reply failed for idea submission:', autoReplyError);
      }

      if (result.status === 200) {
        setSubmitStatus("success");
      } else {
        throw new Error('Email sending failed');
      }
      setTimeout(() => {
        setFormData({
          name: "", email: "", ideaType: "app", title: "",
          description: "", problem: "", targetAudience: "", budget: "",
        });
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitStatus("error");

      const subject = encodeURIComponent(`New Idea: ${formData.title || "Untitled Project"}`);
      const body = encodeURIComponent(
        `=== NEW IDEA SUBMISSION ===\n\n` +
        `From: ${formData.name}\nEmail: ${formData.email}\n` +
        `Type: ${formData.ideaType === "app" ? "App Idea" : "Problem to Solve"}\n\n` +
        `Title: ${formData.title}\n\nDescription:\n${formData.description}\n\n` +
        `Problem Statement:\n${formData.problem}\n\nTarget Audience:\n${formData.targetAudience}\n\n` +
        `Budget Range: ${formData.budget}`
      );
      const mailtoLink = `mailto:hellofromusama@gmail.com?subject=${subject}&body=${body}`;
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const categories = [
    { icon: "rocket", title: "Startup Ideas", desc: "Transform your vision into a scalable product" },
    { icon: "phone", title: "Mobile Apps", desc: "Native & cross-platform solutions" },
    { icon: "globe", title: "Web Platforms", desc: "Scalable web applications" },
    { icon: "brain", title: "AI Solutions", desc: "Intelligent automation & ML" },
    { icon: "cart", title: "E-commerce", desc: "Online marketplace solutions" },
    { icon: "game", title: "Interactive", desc: "Engaging digital experiences" },
  ];

  const iconPaths: Record<string, string> = {
    rocket: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
    phone: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
    globe: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    brain: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
    cart: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
    game: "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z",
  };

  const inputStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navigation currentPage="ideas" />

      {/* Hero with Interactive Canvas */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Canvas Background */}
        <div className="absolute inset-0 z-0" style={{ opacity: 'var(--canvas-opacity)' }}>
          <IdeaNetworkCanvas className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md mb-8"
                  style={{ border: '1px solid var(--border-default)', background: 'var(--bg-card)' }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
                  </span>
                  <span className="text-[11px] tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
                    Open for Ideas
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] mb-6 font-[family-name:var(--font-space-grotesk)]">
                  Got an<br />
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-flow">
                    idea?
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="text-lg leading-relaxed max-w-md mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  Transform your vision into reality. Whether it's a groundbreaking app or a problem
                  that needs solving, let's build something extraordinary together.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <p className="text-sm max-w-md mb-8" style={{ color: 'var(--text-faint)' }}>
                  From concept to deployment with cutting-edge technology and innovative solutions.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="flex flex-wrap gap-4">
                  <InteractiveButton href="#submit-idea" variant="primary" size="lg">
                    Share Your Idea
                    <span className="inline-block ml-1">&darr;</span>
                  </InteractiveButton>
                  <InteractiveButton href="/contact" variant="secondary" size="lg">
                    Let's Talk
                  </InteractiveButton>
                </div>
              </ScrollReveal>
            </div>

            {/* Stats column */}
            <div className="hidden lg:block">
              <ScrollReveal delay={300} direction="right">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 50, suffix: "+", label: "Ideas Built" },
                    { value: 95, suffix: "%", label: "Success Rate" },
                    { value: 4, suffix: "wk", label: "Avg. MVP Time" },
                    { value: 24, suffix: "h", label: "Response Time" },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className="p-5 rounded-xl backdrop-blur-sm transition-all duration-500"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-card)',
                        animationDelay: `${i * 100}ms`,
                      }}
                    >
                      <div className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--text-faint)' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* Categories */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
              Categories
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-space-grotesk)]">
              What can we<br />
              <span style={{ color: 'var(--text-secondary)' }}>build together?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="mb-16 max-w-lg" style={{ color: 'var(--text-muted)' }}>
              Choose your category and let's get started on turning your concept into a working product.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.title} delay={i * 80} direction="up">
                <div
                  className="group p-5 rounded-xl transition-all duration-500 cursor-default hover:-translate-y-1"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div className="mb-3 transition-transform duration-500 group-hover:scale-110" style={{ color: 'var(--accent-violet)' }}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[cat.icon]} />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold mb-1 font-[family-name:var(--font-space-grotesk)]">{cat.title}</h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>{cat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* Form Section */}
      <section id="submit-idea" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
              Submit
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-space-grotesk)]">
              Share your<br />
              <span style={{ color: 'var(--text-secondary)' }}>vision.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="mb-12 max-w-lg" style={{ color: 'var(--text-muted)' }}>
              Fill in the details below and I'll get back to you within 24 hours with a plan to bring your idea to life.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl space-y-6"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
                    style={inputStyle}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
                    style={inputStyle}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ideaType" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Idea Type
                  </label>
                  <select
                    id="ideaType"
                    name="ideaType"
                    value={formData.ideaType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
                    style={inputStyle}
                  >
                    <option value="app">App Idea</option>
                    <option value="problem">Problem to Solve</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
                    style={inputStyle}
                  >
                    <option value="">Select Budget</option>
                    <option value="$1k-5k">$1,000 - $5,000</option>
                    <option value="$5k-10k">$5,000 - $10,000</option>
                    <option value="$10k-25k">$10,000 - $25,000</option>
                    <option value="$25k-50k">$25,000 - $50,000</option>
                    <option value="$50k+">$50,000+</option>
                    <option value="Equity/Partnership">Equity/Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
                  style={inputStyle}
                  placeholder="My Amazing App Idea"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Describe Your Idea
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Explain your idea in detail..."
                />
              </div>

              <div>
                <label htmlFor="problem" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  What Problem Does It Solve?
                </label>
                <textarea
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
                  style={inputStyle}
                  placeholder="What problem are you trying to solve?"
                />
              </div>

              <div>
                <label htmlFor="targetAudience" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Target Audience
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Who will use this?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                style={{
                  background: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                  boxShadow: '0 2px 8px var(--btn-primary-shadow)',
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Your Idea"}
              </button>

              {submitStatus === "success" && (
                <div className="text-center p-4 rounded-lg" style={{ background: 'color-mix(in srgb, var(--accent-emerald) 10%, transparent)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)' }}>
                  <p className="font-medium mb-1">Idea submitted successfully!</p>
                  <p className="text-sm opacity-80">I'll review your idea and get back to you soon.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                  <p className="font-medium mb-1">Something went wrong.</p>
                  <p className="text-sm opacity-80">Please try again or email directly to hellofromusama@gmail.com</p>
                </div>
              )}
            </form>
          </ScrollReveal>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal><div className="h-px" style={{ background: 'var(--gradient-divider)' }} /></ScrollReveal>
      </div>

      {/* Why Work With Me */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
              Why Me
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-16 font-[family-name:var(--font-space-grotesk)]">
              Bring your ideas<br />
              <span style={{ color: 'var(--text-secondary)' }}>to me.</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
                title: "Idea to Reality",
                desc: "I transform concepts into fully functional applications with modern technology stack and scalable architecture.",
              },
              {
                icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
                title: "Rapid Prototyping",
                desc: "Quick MVP development to validate your ideas and get to market faster with iterative improvements.",
              },
              {
                icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
                title: "End-to-End Support",
                desc: "From initial concept to deployment and maintenance, I'm with you every step of the journey.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100} direction="up">
                <div
                  className="group p-8 rounded-xl transition-all duration-500 cursor-default hover:-translate-y-1 h-full"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div className="mb-4 transition-transform duration-500 group-hover:scale-110" style={{ color: 'var(--accent-violet)' }}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 font-[family-name:var(--font-space-grotesk)]">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div
              className="p-8 rounded-xl text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
            >
              <h3 className="text-xl font-semibold mb-3 font-[family-name:var(--font-space-grotesk)]">
                Ready to start building?
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Let's discuss your idea and create a roadmap to bring it to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <InteractiveButton href="/contact" variant="primary" size="lg">
                  Get In Touch
                </InteractiveButton>
                <InteractiveButton href="/budget" variant="secondary" size="lg">
                  Get a Quote
                </InteractiveButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

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
