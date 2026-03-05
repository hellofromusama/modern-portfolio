"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-md transition-all duration-500 cursor-pointer group hover:border-white/20"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Track background */}
      <div
        className={`absolute inset-0.5 rounded-full transition-colors duration-500 ${
          theme === "light" ? "bg-amber-100/20" : "bg-white/[0.03]"
        }`}
      />

      {/* Sliding circle with sun/moon */}
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
          theme === "light"
            ? "translate-x-7 bg-amber-400 shadow-lg shadow-amber-400/30"
            : "translate-x-0.5 bg-white/80 shadow-lg shadow-white/10"
        }`}
      >
        {/* Sun icon */}
        <svg
          className={`w-3.5 h-3.5 absolute transition-all duration-500 ${
            theme === "light"
              ? "opacity-100 rotate-0 scale-100 text-amber-900"
              : "opacity-0 rotate-90 scale-50 text-slate-700"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* Moon icon */}
        <svg
          className={`w-3.5 h-3.5 absolute transition-all duration-500 ${
            theme === "dark"
              ? "opacity-100 rotate-0 scale-100 text-slate-700"
              : "opacity-0 -rotate-90 scale-50 text-amber-900"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </div>
    </button>
  );
}
