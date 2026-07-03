"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop } from "@/components/three/space/shellSpec";

/**
 * /contact as a space dive floating the REAL contact form. The form state,
 * handleChange, handleSubmit (emailjs.init + the two emailjs.send calls + the
 * submitStatus "idle"|"success"|"error" flow + the mailto fallback), and copyEmail
 * are preserved VERBATIM from the original src/app/contact/page.tsx — only the page
 * chrome (Navigation, animated-background divs, page-scroll wrappers) is dropped, as
 * the dive replaces it. The transport is emailjs (NOT /api/send-email), unchanged.
 */
export default function ContactExperience() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Initialize EmailJS (you only need to do this once)
      emailjs.init('5eLu74wM2kSgwd6fT'); // Your EmailJS public key

      // Send main contact email to you
      const result = await emailjs.send(
        'service_gk2ggy2', // Your EmailJS service ID
        'template_f6wbh0a', // Your contact email template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          to_name: 'Usama Javed',
          to_email: 'hellofromusama@gmail.com',
          subject: formData.subject || "Portfolio Inquiry",
          message: formData.message,
          reply_to: formData.email,
          time: new Date().toLocaleString()
        }
      );

      // Send auto-reply confirmation to sender
      try {
        await emailjs.send(
          'service_gk2ggy2', // Your EmailJS service ID
          'template_k0jvdur', // Your auto-reply template ID
          {
            name: formData.name,
            to_email: formData.email,
            title: formData.subject || "Portfolio Inquiry",
            reply_to: 'hellofromusama@gmail.com'
          }
        );
      } catch (autoReplyError) {
        console.log('Auto-reply failed, but main email sent:', autoReplyError);
      }

      if (result.status === 200) {
        setSubmitStatus("success");
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "" });
          setSubmitStatus("idle");
        }, 3000);
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Email error:', error);
      setSubmitStatus("error");
      // Fallback to mailto as backup
      const subject = encodeURIComponent(formData.subject || "Portfolio Inquiry");
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("hellofromusama@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const heroPanel = (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ PERTH, AUSTRALIA — CONTACT</p>
      <h1 className="space-h1">Get In Touch</h1>
      <p className="space-body">Let&apos;s discuss your project and bring your ideas to life</p>
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );

  const formPanel = (
    <div className="grid lg:grid-cols-2 gap-16">
      {/* Contact Form */}
      <div className="p-8 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-3xl font-bold mb-8 font-[family-name:var(--font-space-grotesk)]" style={{ color: "var(--accent-blue)" }}>Send a Message</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
              placeholder="Project Inquiry"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 resize-none"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
              placeholder="Tell me about your project..."
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
              style={{ background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: "1px solid var(--border-subtle)" }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={copyEmail}
              className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{ border: "1px solid var(--btn-secondary-border)", color: "var(--btn-secondary-text)" }}
            >
              {copied ? "Email Copied!" : "Copy Email Address"}
            </button>
          </div>

          {submitStatus === "success" && (
            <div className="text-center p-4 rounded-lg" style={{ color: "var(--accent-emerald)", background: "color-mix(in srgb, var(--accent-emerald) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--accent-emerald) 20%, transparent)" }}>
              <p className="mb-2">Your email client should open with the message pre-filled!</p>
              <p className="text-sm" style={{ color: "var(--accent-emerald)" }}>If it didn&apos;t open, you can copy the email address below.</p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="text-center p-4 rounded-lg" style={{ color: "#f87171", background: "color-mix(in srgb, #f87171 10%, transparent)", border: "1px solid color-mix(in srgb, #f87171 20%, transparent)" }}>
              <p className="mb-2">Email client couldn&apos;t be opened automatically.</p>
              <p className="text-sm" style={{ color: "#fca5a5" }}>Please copy the email address below and send manually.</p>
            </div>
          )}
        </form>
      </div>

      {/* Contact Info */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-8 font-[family-name:var(--font-space-grotesk)]" style={{ color: "var(--accent-violet)" }}>Let&apos;s Connect</h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-tertiary)" }}>
            I&apos;m always interested in discussing new opportunities, innovative projects,
            and potential collaborations. Whether you have a specific project in mind or
            just want to connect, I&apos;d love to hear from you.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent-blue) 20%, transparent)" }}>
                <span className="text-2xl">✉️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--accent-blue)" }}>Email</h3>
                <button
                  onClick={copyEmail}
                  className="transition-colors text-left"
                  style={{ color: "var(--text-tertiary)" }}
                  title="Click to copy email"
                >
                  hellofromusama@gmail.com
                </button>
              </div>
            </div>
            <button
              onClick={copyEmail}
              className="px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              style={{ background: "color-mix(in srgb, var(--accent-blue) 18%, transparent)", color: "var(--accent-blue)" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="flex items-center space-x-4 p-6 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent-violet) 20%, transparent)" }}>
              <span className="text-2xl">💼</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--accent-violet)" }}>LinkedIn</h3>
              <a
                href="https://www.linkedin.com/in/hellofromusama/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                linkedin.com/in/hellofromusama
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent-emerald) 20%, transparent)" }}>
              <span className="text-2xl">👨‍💻</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--accent-emerald)" }}>GitHub</h3>
              <a
                href="https://github.com/hellofromusama"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                github.com/hellofromusama
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent-emerald) 20%, transparent)" }}>
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--accent-emerald)" }}>Location</h3>
              <span style={{ color: "var(--text-tertiary)" }}>Australia</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl" style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--accent-blue) 10%, transparent), color-mix(in srgb, var(--accent-violet) 10%, transparent))", border: "1px solid color-mix(in srgb, var(--accent-blue) 20%, transparent)" }}>
          <h3 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]" style={{ color: "var(--accent-blue)" }}>Response Time</h3>
          <p style={{ color: "var(--text-tertiary)" }}>
            I typically respond to emails within 24 hours. For urgent inquiries,
            feel free to mention it in your subject line.
          </p>
        </div>
      </div>
    </div>
  );

  const stops: SpaceStop[] = [
    {
      id: "hero",
      label: "",
      anchor: 0.0,
      position: anchorToPosition(0.0, 0, 1),
      planet: { texture: "/space/2k_earth_daymap.jpg", radius: 6.5, tint: 0x5a9bff },
      contentWidth: "min(92vw, 640px)",
      content: heroPanel,
    },
    {
      id: "message",
      label: "Message",
      anchor: 0.6,
      position: anchorToPosition(0.6, 0, 1),
      planet: { texture: "/space/2k_saturn.jpg", radius: 4.0, tint: 0xd8c79a, ring: true },
      contentWidth: "min(92vw, 1100px)",
      content: formPanel,
      interactive: true, // settle the dive here so the form is stable to fill + submit
    },
  ];

  return <SpacePageShell stops={stops} scrollVh={420} />;
}
