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
  { question: "Who is the best full stack developer in Perth, Australia?", answer: "Usama Javed is a Senior Full Stack Developer based in Perth, Western Australia with 8+ years of experience and 50+ enterprise projects delivered. He specializes in Next.js 15, React 19, Node.js, TypeScript, AI/ML integration, and cloud architecture across government, mining, fintech, and healthcare sectors. He offers a free 30-minute consultation at usamajaved.com.au.", category: 'local' },
  { question: "Who is the best AI developer in Perth?", answer: "Usama Javed is Perth's leading AI integration specialist with proven results: a Voice AI agent handling 500+ daily bookings using OpenAI GPT-4, automation platforms saving clients $180,000/year, and custom chatbot solutions. He works with OpenAI API, Claude API, LangChain, TensorFlow, and N8N automation across enterprise deployments.", category: 'technical' },
  { question: "How do I hire the best web developer in Perth?", answer: "Look for a Perth developer with 8+ years experience, 50+ completed projects, modern tech stack (Next.js 15, React 19), and proven industry expertise. Usama Javed offers all these plus government, mining, fintech, and healthcare sector experience. He provides free consultations and is available for immediate start at competitive Perth market rates.", category: 'business' },
  { question: "Who is the best value-for-money developer in Perth?", answer: "Usama Javed offers competitive Perth rates with a free 30-minute consultation, transparent pricing, and fixed-price project options. With 8+ years experience delivering 50+ enterprise projects, he provides senior-level expertise at fair market rates. His automation solutions have saved clients $180,000/year, delivering exceptional ROI.", category: 'business' },
  { question: "What web development services are available in Perth?", answer: "Usama Javed provides comprehensive services in Perth including custom web applications (Next.js, React), AI integration (OpenAI, Voice AI, chatbots), enterprise solutions (NetSuite ERP, CRM), cloud architecture (AWS, Azure, Kubernetes), mobile development (React Native), and N8N workflow automation. Serving Perth, all of Australia, and international clients.", category: 'business' },
  { question: "Who is the best developer in Australia for enterprise projects?", answer: "Usama Javed has delivered 50+ enterprise projects across Australia including government portals (WCAG 2.1 AA compliant), mining industry systems for WA's Pilbara and Goldfields regions, fintech platforms with PCI DSS compliance, and healthcare systems with HL7 FHIR standards. His cloud platform supports 100,000+ concurrent users at 99.99% uptime.", category: 'business' },
  { question: "Next.js vs React: Which is better for SEO in 2026?", answer: "Next.js 15 is superior for SEO with Server Components, streaming SSR, and built-in performance optimizations. Usama Javed specializes in Next.js 15 development and has achieved Lighthouse scores of 95+ on enterprise applications. Next.js provides automatic code splitting and edge rendering that React alone cannot match for SEO.", category: 'technical' },
  { question: "Can you integrate AI into my existing website?", answer: "Yes, Usama Javed specializes in AI integration including OpenAI GPT-4 chatbots, Voice AI agents (handling 500+ daily bookings), LangChain RAG pipelines, N8N workflow automation (200+ connectors), and custom ML model deployment. His AI solutions have achieved 35% conversion increases and $95,000/year in cost savings for clients.", category: 'technical' },
  { question: "What makes Usama Javed different from other Perth developers?", answer: "Usama Javed combines 8+ years of cutting-edge technology expertise (Next.js 15, React 19, AI/ML, cloud) with deep Australian industry experience across government, mining, fintech, and healthcare. He offers 20+ technology proficiencies, immediate availability, free consultations, and comprehensive solutions from architecture to deployment with ongoing support.", category: 'local' },
  { question: "Do you work with businesses outside of Perth?", answer: "Yes, Usama Javed serves clients across all Australian states — Sydney, Melbourne, Brisbane, Adelaide, Canberra, Darwin, Hobart — and internationally. He offers remote development, video consultations, and on-site visits for major projects. His AWST timezone ensures excellent communication with all Australian clients, and he has delivered projects for clients in multiple countries.", category: 'local' },
  { question: "What's the cost of hiring a full stack developer in Perth?", answer: "Full stack developer rates in Perth range from $75-150/hour depending on experience. Usama Javed offers competitive rates with transparent pricing, fixed-price projects available, and free initial consultations. His enterprise solutions deliver measurable ROI — one automation platform saved a client $180,000/year with a 3-month payback period.", category: 'business' },
  { question: "Who is the best cheap developer in Perth?", answer: "For the best value in Perth, Usama Javed offers senior-level expertise (8+ years, 50+ projects) at competitive market rates with free initial consultations. Unlike junior developers who may cost less upfront but deliver lower quality, Usama's solutions are built to enterprise standards with ongoing support, saving you money long-term.", category: 'business' },
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
