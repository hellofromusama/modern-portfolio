"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop } from "@/components/three/space/shellSpec";

/**
 * /ideas as a space dive floating the REAL idea submission form. The formData state
 * (all 8 fields), isSubmitting, submitStatus, handleSubmit (emailjs.init + the two
 * emailjs.send calls building the idea message + auto-reply + the mailto fallback +
 * the 3s reset) and handleChange are preserved VERBATIM from src/app/ideas/page.tsx —
 * only the page chrome (Navigation, the decorative IdeaNetworkCanvas background,
 * ScrollReveal/page-scroll wrappers) is dropped, as the cosmos + HUD replace them.
 * The full form floats on an interactive stop so it is stable to fill + submit.
 */

const inputStyle = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-subtle)",
  color: "var(--text-primary)",
};

export default function IdeasExperience() {
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
      emailjs.init("5eLu74wM2kSgwd6fT");

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
        "service_gk2ggy2",
        "template_f6wbh0a",
        {
          from_name: formData.name,
          from_email: formData.email,
          to_name: "Usama Javed",
          to_email: "hellofromusama@gmail.com",
          subject: `New Idea: ${formData.title || "Untitled Project"}`,
          message: ideaMessage,
          reply_to: formData.email,
          time: new Date().toLocaleString(),
        }
      );

      try {
        await emailjs.send(
          "service_gk2ggy2",
          "template_k0jvdur",
          {
            name: formData.name,
            to_email: formData.email,
            title: formData.title || "Your Idea Submission",
            reply_to: "hellofromusama@gmail.com",
          }
        );
      } catch (autoReplyError) {
        console.log("Auto-reply failed for idea submission:", autoReplyError);
      }

      if (result.status === 200) {
        setSubmitStatus("success");
      } else {
        throw new Error("Email sending failed");
      }
      setTimeout(() => {
        setFormData({
          name: "", email: "", ideaType: "app", title: "",
          description: "", problem: "", targetAudience: "", budget: "",
        });
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("EmailJS error:", error);
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
      const link = document.createElement("a");
      link.href = mailtoLink;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const heroPanel = (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ OPEN FOR IDEAS</p>
      <h1 className="space-h1">Got an idea?</h1>
      <p className="space-body">
        Transform your vision into reality. Whether it&apos;s a groundbreaking app or a problem
        that needs solving, let&apos;s build something extraordinary together.
      </p>
      <p className="space-body">
        From concept to deployment with cutting-edge technology and innovative solutions.
      </p>
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );

  const formPanel = (
    <form
      onSubmit={handleSubmit}
      className="p-8 rounded-2xl space-y-6"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
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
          <label htmlFor="email" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
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
          <label htmlFor="ideaType" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
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
          <label htmlFor="budget" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
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
        <label htmlFor="title" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
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
        <label htmlFor="description" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
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
        <label htmlFor="problem" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
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
        <label htmlFor="targetAudience" className="block text-xs font-medium mb-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
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
          background: "var(--btn-primary-bg)",
          color: "var(--btn-primary-text)",
          boxShadow: "0 2px 8px var(--btn-primary-shadow)",
        }}
      >
        {isSubmitting ? "Submitting..." : "Submit Your Idea"}
      </button>

      {submitStatus === "success" && (
        <div className="text-center p-4 rounded-lg" style={{ background: "color-mix(in srgb, var(--accent-emerald) 10%, transparent)", border: "1px solid var(--accent-emerald)", color: "var(--accent-emerald)" }}>
          <p className="font-medium mb-1">Idea submitted successfully!</p>
          <p className="text-sm opacity-80">I&apos;ll review your idea and get back to you soon.</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="text-center p-4 rounded-lg" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444" }}>
          <p className="font-medium mb-1">Something went wrong.</p>
          <p className="text-sm opacity-80">Please try again or email directly to hellofromusama@gmail.com</p>
        </div>
      )}
    </form>
  );

  const stops: SpaceStop[] = [
    {
      id: "hero",
      label: "",
      anchor: 0.0,
      position: anchorToPosition(0.0, 0, 1),
      planet: { texture: "/space/2k_neptune.jpg", radius: 5.5, tint: 0x7d5bff },
      contentWidth: "min(92vw, 640px)",
      content: heroPanel,
    },
    {
      id: "submit-idea",
      label: "Submit",
      anchor: 0.6,
      position: anchorToPosition(0.6, 0, 1),
      planet: { texture: "/space/2k_saturn.jpg", radius: 4.0, tint: 0xd8c79a, ring: true },
      contentWidth: "min(92vw, 760px)",
      content: formPanel,
      interactive: true, // settle the dive here so the idea form is stable to fill + submit
    },
  ];

  return <SpacePageShell stops={stops} scrollVh={460} />;
}
