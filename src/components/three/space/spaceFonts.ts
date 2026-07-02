// Scoped fonts for the /space experience (additive — Space Grotesk is already
// loaded globally in src/app/layout.tsx; this only ADDS Inter + JetBrains Mono).
//
// next/font/google MUST be called at module scope (no "use client"). The exported
// `spaceFontVars` string is applied to the /space wrapper className so the CSS
// variables --font-inter / --font-jetbrains-mono resolve only within /space.
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Space-scoped font CSS-variable classes to apply on the /space wrapper. */
export const spaceFontVars = `${inter.variable} ${jetbrainsMono.variable}`;
