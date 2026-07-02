"use client";

import { useState } from "react";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop } from "@/components/three/space/shellSpec";

/**
 * /budget as a space dive floating the REAL AI budget chat. The messages
 * ChatMessage[] state (incl. the seeded assistant greeting), userInput, isLoading,
 * handleSubmit (fetch('/api/budget-estimate') with { userMessage, conversationHistory }
 * + the assistant/error message appends) and formatMessage (the dangerouslySetInnerHTML
 * render) are preserved VERBATIM from src/app/budget/page.tsx — only the page chrome
 * (Navigation, floating money-emoji background, page-scroll fade wrappers) is dropped,
 * as the cosmos + HUD replace it. The chat panel floats on an interactive stop so the
 * dive settles and the field is easy to type in.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function BudgetExperience() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm Usama's AI Budget Calculator. I'm here to help estimate your project cost and timeline.\n\n**Please describe your project:** What features do you need? What problem are you solving? Any specific technologies required?\n\n*💡 Note: This is a fun AI tool for quick estimates. For accurate quotes, contact Usama directly!*",
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/budget-estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: userInput,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to get estimate");
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "Sorry, I couldn't process your request right now. Please try again or contact me directly at hellofromusama@gmail.com for a personalized quote.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  };

  const heroPanel = (
    <div className="space-panel space-hero">
      <p className="space-mono space-eyebrow">◦ PERTH, AUSTRALIA — BUDGET</p>
      <h1 className="space-h1">Project Budget Calculator</h1>
      <p className="space-body">
        Get instant estimates for your web development project. Describe your requirements and get
        detailed cost and timeline information.
      </p>
      <p className="space-body" style={{ fontStyle: "italic" }}>
        ⚡ This is an AI-powered tool for quick estimates. For accurate quotes, please contact
        directly.
      </p>
      <p className="space-mono space-hint">SCROLL TO DIVE · CLICK A PLANET TO TRAVEL ↓</p>
    </div>
  );

  const chatPanel = (
    <div className="rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
      {/* Chat Messages */}
      <div className="h-[50vh] md:h-96 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] md:max-w-3xl rounded-lg px-3 md:px-4 py-2 md:py-3"
              style={
                message.role === "user"
                  ? { background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }
                  : { background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }
              }
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
            {isLoading ? "Calculating..." : "Get Estimate"}
          </button>
        </form>
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
      id: "estimate",
      label: "Estimate",
      anchor: 0.6,
      position: anchorToPosition(0.6, 0, 1),
      planet: { texture: "/space/2k_saturn.jpg", radius: 4.0, tint: 0xd8c79a, ring: true },
      contentWidth: "min(92vw, 900px)",
      content: chatPanel,
      interactive: true, // settle the dive here so the chat field is stable to type in
    },
  ];

  return <SpacePageShell stops={stops} scrollVh={420} />;
}
