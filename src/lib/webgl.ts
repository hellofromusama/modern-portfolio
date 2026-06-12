/**
 * SSR-safe WebGL capability probe (no React, no 'use client').
 *
 * Creates a throwaway <canvas> and asks for a WebGL2 (then WebGL1) context.
 * Returns false on the server (no document) and false if context creation
 * throws or is unavailable, so callers can degrade to a static poster instead
 * of mounting a Canvas that would never render.
 *
 * Run this client-side only (behind a `mounted` guard); it touches `document`
 * and `window`.
 */
export function isWebGLAvailable(): boolean {
  // Never run on the server — getContext/window are unavailable there.
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}
