'use client'

import { useState } from 'react'
import ScrollReveal from './ScrollReveal'
import InteractiveButton from './InteractiveButton'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'technical' | 'business' | 'local'
}

const faqData: FAQItem[] = [
  { question: "What is full stack development and why do I need it?", answer: "Full stack development involves creating both frontend (user interface) and backend (server logic) of web applications. You need it for complete, scalable web solutions that handle everything from user interactions to data management, ensuring seamless performance across all aspects of your digital presence.", category: 'general' },
  { question: "How do I hire the best web developer in Perth?", answer: "Look for a Perth-based developer with proven experience in modern technologies like Next.js and React, strong local business understanding, immediate availability, and a portfolio of successful Australian projects. Usama Javed offers all these qualities with 8+ years experience serving Perth businesses.", category: 'business' },
  { question: "Next.js vs React: Which is better for SEO in 2025?", answer: "Next.js is superior for SEO because it provides server-side rendering, automatic code splitting, and built-in performance optimizations. While React requires additional configuration for SEO, Next.js offers these features out-of-the-box, making it the preferred choice for SEO-focused web applications.", category: 'technical' },
  { question: "What web development services do you provide in Perth?", answer: "I provide comprehensive web development services including custom web applications, e-commerce platforms, AI integration, business automation, mobile app development, API development, cloud architecture, and performance optimization. Serving Perth metro and all of Australia with modern, scalable solutions.", category: 'business' },
  { question: "How long does it take to develop a custom web application?", answer: "Custom web application development typically takes 4-16 weeks depending on complexity. Simple business websites take 2-4 weeks, e-commerce platforms 6-12 weeks, and enterprise applications 12-24 weeks. I provide detailed project timelines during the free consultation phase.", category: 'business' },
  { question: "Do you work with businesses outside of Perth?", answer: "Yes, while I'm based in Perth, Western Australia, I serve clients across all Australian states and internationally. I offer remote development services, video consultations, and can travel for major projects. My Australian timezone ensures excellent communication with all Aussie clients.", category: 'local' },
  { question: "What's the cost of hiring a full stack developer in Perth?", answer: "Full stack developer rates in Perth range from $75-150/hour depending on experience and project complexity. I offer competitive rates with transparent pricing, fixed-price projects available, and free initial consultations to discuss your specific requirements and budget.", category: 'business' },
  { question: "Can you integrate AI into my existing website?", answer: "Absolutely! I specialize in AI integration including chatbots, voice assistants, automated workflows, and machine learning features. Common integrations include OpenAI GPT models, voice recognition, automated customer service, and intelligent business process automation using platforms like N8N.", category: 'technical' },
  { question: "What makes you different from other Perth web developers?", answer: "I combine cutting-edge technology expertise (Next.js 15, React 19, AI integration) with deep local Perth market understanding. I'm immediately available, offer government contractor services, have mining industry experience, and provide comprehensive solutions from concept to deployment with ongoing support.", category: 'local' },
  { question: "Do you provide ongoing support after website launch?", answer: "Yes, I offer comprehensive post-launch support including regular updates, security monitoring, performance optimization, content updates, and technical support. Support packages range from basic maintenance to full managed services depending on your needs.", category: 'business' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredFAQs = activeCategory === 'all' ? faqData : faqData.filter(faq => faq.category === activeCategory)

  const toggleFAQ = (index: number) => { setOpenIndex(openIndex === index ? null : index) }

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } }))
  }

  const categories = ['all', 'general', 'technical', 'business', 'local']

  return (
    <section className="relative py-32 z-10 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-primary)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: 'var(--text-muted)' }}>FAQ</p>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-space-grotesk)]">
            Common<br />
            <span style={{ color: 'var(--text-secondary)' }}>questions.</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="mb-12 max-w-lg" style={{ color: 'var(--text-muted)' }}>
            Get answers about full stack development, hiring developers in Australia, and modern web technologies.
          </p>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal delay={200}>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => { setActiveCategory(category); setOpenIndex(null); }}
                type="button"
                className="px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer"
                style={{
                  background: activeCategory === category ? 'var(--btn-primary-bg)' : 'transparent',
                  color: activeCategory === category ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                  border: activeCategory === category ? 'none' : '1px solid var(--border-subtle)',
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* FAQ Items */}
        <div className="space-y-2">
          {filteredFAQs.map((faq, index) => (
            <ScrollReveal key={`${activeCategory}-${index}`} delay={index * 60}>
              <div
                className="rounded-xl transition-all duration-300 overflow-hidden"
                style={{
                  border: `1px solid ${openIndex === index ? 'var(--border-default)' : 'var(--border-subtle)'}`,
                  background: openIndex === index ? 'var(--bg-card)' : 'transparent',
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center cursor-pointer group"
                >
                  <h3
                    className="text-sm font-medium pr-4 transition-colors duration-300"
                    style={{ color: openIndex === index ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 text-lg transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}
                    style={{ color: 'var(--text-faint)' }}
                  >
                    +
                  </div>
                </button>

                <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  openIndex === index ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={200}>
          <div
            className="mt-16 p-8 rounded-xl text-center transition-all duration-500"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
          >
            <h3 className="text-xl font-semibold mb-3 font-[family-name:var(--font-space-grotesk)]">Still have questions?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Get expert answers and a free consultation for your project</p>
            <InteractiveButton href="/contact" variant="primary" size="lg">Get In Touch</InteractiveButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
