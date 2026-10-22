'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import ScrollReveal from './ScrollReveal'
import InteractiveButton from './InteractiveButton'
import { transitions } from '@/lib/motion'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'technical' | 'business' | 'local'
}

const faqData: FAQItem[] = [
  { question: "What do you actually do day to day?", answer: "I'm a Forward Deployed Engineer at Lakestone AI. I sit with a client's business, learn how their back office runs, and build the software that runs it instead: invoice and document extraction with a human review gate, judge models that check the extractors, agents that act within limits a person sets, and the SimPro or NetSuite integration underneath. I own each product end to end.", category: 'general' },
  { question: "What is in production right now?", answer: "Three products: an invoice, supplier and fleet platform for a construction company; a mail, property and agreement workflow for a commercial property agency; and a headless e-signature service with a PDF toolkit that the other two call. Each is described on this site as problem, design, trade-off and result.", category: 'general' },
  { question: "Which models and tooling do you use?", answer: "Gemini Flash for extraction and chat, Claude for reasoning and review, DeepSeek for bounded tasks, each benchmarked per path with promptfoo and traced in Langfuse. Claude Code is the primary developer on every repo; I write the skills, agent roles and hooks that keep it inside the lines.", category: 'technical' },
  { question: "How do you stop an AI feature from doing something it shouldn't?", answer: "Nothing an extractor or classifier produces reaches a client system without a judge pass. The chat assistant's SQL runs as a dedicated read-only Postgres role, and exploit tests in CI prove it can't be talked into data it shouldn't see. AI checks fail open for the user and never silently.", category: 'technical' },
  { question: "What stack do you work in?", answer: "TypeScript end to end: Bun, Hono, React 19, TanStack, Tailwind, Supabase Postgres with row-level security, Trigger.dev and Vercel. Earlier work covered Node.js, .NET, Java, Python, AWS and Terraform. ERP side: NetSuite SuiteScript 2.1 and the SimPro API.", category: 'technical' },
  { question: "Which projects on this site are real and which are concepts?", answer: "The Lakestone AI products are live and in daily use. The MCP NetSuite bridge ran in production at a previous employer. The earlier enterprise projects are labelled as concept or architecture studies, and the personal AI projects as personal. If something isn't labelled, ask.", category: 'business' },
  { question: "Are you open to new roles?", answer: "Yes, for the right one: forward deployed, AI engineering or senior full-stack, remote or hybrid. The resume is downloadable from this page, and I'm happy to walk through the private client work in a call.", category: 'business' },
  { question: "Do you take freelance work?", answer: "Occasionally, for well-defined automation and integration work: NetSuite or SimPro integrations, n8n workflows, extraction pipelines. Use the contact form with the problem you want solved rather than the technology you think you need.", category: 'local' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const reduceMotion = useReducedMotion()

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
              <motion.div
                className="rounded-xl overflow-hidden"
                style={{
                  border: `1px solid ${openIndex === index ? 'var(--border-default)' : 'var(--border-subtle)'}`,
                  background: openIndex === index ? 'var(--bg-card)' : 'transparent',
                  transition: 'background 0.3s, border-color 0.3s',
                }}
                whileHover={reduceMotion ? undefined : { y: -1 }}
                transition={transitions.quick}
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
                    style={{ color: 'var(--text-muted)' }}
                  >
                    +
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      key="answer"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={reduceMotion ? { duration: 0 } : transitions.base}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
