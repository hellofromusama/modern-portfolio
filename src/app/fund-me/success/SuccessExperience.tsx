"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ScenePoster from "@/components/three/ScenePoster";
import SpacePageShell from "@/components/three/space/SpacePageShell";
import { anchorToPosition, type SpaceStop } from "@/components/three/space/shellSpec";

/**
 * /fund-me/success as a space dive floating the REAL thank-you confirmation. The
 * useSearchParams() read of session_id and the isLoading 1.5s timer are preserved
 * VERBATIM from src/app/fund-me/success/page.tsx — only the page chrome (Navigation,
 * the full-screen gradient wrappers) is dropped, as the cosmos + HUD replace them.
 *
 * useSearchParams MUST stay under a Suspense boundary (the original did this) so the
 * strict build stays green — SuccessInner reads searchParams and is wrapped in
 * <Suspense> here, feeding sessionId into the floated panel.
 */

function SuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const loadingPanel = (
    <div className="text-white text-center">
      <div className="w-16 h-16 border-t-4 border-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-xl text-slate-300">Processing your payment...</p>
    </div>
  );

  const confirmationPanel = (
    <div className="text-white max-w-2xl mx-auto text-center">
      {/* Success Animation */}
      <div className="mb-8 relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/50 animate-bounce">
          <span className="text-6xl">🎉</span>
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
        Thank You So Much!
      </h1>

      <p className="text-xl md:text-2xl text-slate-300 mb-8">
        Your support means the world to me! 💖
      </p>

      <div className="bg-slate-800/50 rounded-xl border border-pink-500/30 p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-pink-400">
          Payment Successful! ✅
        </h2>

        <p className="text-slate-300 mb-6">
          Your contribution will help me continue building amazing projects, improving my skills,
          and creating valuable content for the community.
        </p>

        {sessionId && (
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-400 mb-1">Transaction ID:</p>
            <p className="text-xs text-pink-400 font-mono break-all">{sessionId}</p>
          </div>
        )}

        <div className="text-sm text-slate-400 mb-4">
          📧 You&apos;ll receive a receipt via email shortly.
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/30 p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">
          🚀 What&apos;s Next?
        </h3>
        <div className="space-y-3 text-left text-slate-300">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <strong>Stay Connected:</strong> Follow me on LinkedIn for updates on new projects
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💻</span>
            <div>
              <strong>Check Out My Work:</strong> Explore my portfolio and recent projects
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <strong>Let&apos;s Collaborate:</strong> Got a project idea? Let&apos;s discuss it!
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🏠 Back to Home
        </Link>
        <Link
          href="/budget"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          💰 Get Project Quote
        </Link>
        <Link
          href="/contact"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          📧 Contact Me
        </Link>
      </div>

      {/* Social Sharing */}
      <div className="mt-12 pt-8 border-t border-slate-700">
        <p className="text-slate-400 mb-4">
          💬 Enjoying my work? Share it with others!
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://www.linkedin.com/in/hellofromusama/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            LinkedIn
          </a>
          <a
            href="https://wa.me/61433695387"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );

  const stops: SpaceStop[] = [
    {
      id: "thank-you",
      label: "",
      anchor: 0.0,
      position: anchorToPosition(0.0, 0, 1),
      planet: { texture: "/space/2k_saturn.jpg", radius: 5.0, tint: 0xe0709a, ring: true },
      contentWidth: "min(92vw, 720px)",
      content: isLoading ? loadingPanel : confirmationPanel,
      interactive: true, // settle the dive here so the confirmation + links are stable
    },
  ];

  return <SpacePageShell stops={stops} scrollVh={360} />;
}

export default function SuccessExperience() {
  return (
    <Suspense fallback={<ScenePoster variant="hero" />}>
      <SuccessInner />
    </Suspense>
  );
}
