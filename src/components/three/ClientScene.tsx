"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import IslandBoundary from "@/components/IslandBoundary";
import { isWebGLAvailable } from "@/lib/webgl";
import ScenePoster from "./ScenePoster";

// ssr:false is legal ONLY because this file is a client component ('use client'
// above). Next 15 build-errors dynamic(ssr:false) inside a server file.
// The `loading` view IS the poster: instantly painted (LCP) and the pre-mount view.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => <ScenePoster />,
});

interface ClientSceneProps {
  className?: string;
  /**
   * The scene to mount inside the Canvas, as a render function receiving the
   * gate-derived `paused`. Threaded straight to SceneCanvas; when omitted the
   * island defaults to <ThemedScene/> (the Phase-4 harness behavior). This is the
   * 05-00 scene-injection mechanism — ClientScene stays the SOLE public surface.
   */
  scene?: (paused: boolean) => ReactNode;
  /** Tunes the poster (loading / no-WebGL / fallback) to match the scene. */
  posterVariant?: "default" | "hero";
}

/**
 * The ONLY public entry point for the WebGL island. Pages/layouts/nav/footer
 * import THIS — never SceneCanvas, ThemedScene, or `three` directly — which is
 * what keeps `three` route-split out of the shared bundle (PERF-01).
 *
 * Composition:
 *  - dynamic(ssr:false) lazy-loads SceneCanvas, poster as the loading view
 *  - IslandBoundary degrades a runtime render throw to the poster (not error.tsx)
 *  - a `mounted`-gated isWebGLAvailable() probe sends "no WebGL at all" to the
 *    poster too (the probe runs client-side only, per repo hydration convention)
 */
export default function ClientScene({
  className,
  scene,
  posterVariant = "default",
}: ClientSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [webglOk, setWebglOk] = useState(false);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
    setMounted(true);
  }, []);

  // Pre-hydration and on machines without WebGL -> the static poster.
  if (!mounted || !webglOk)
    return <ScenePoster className={className} variant={posterVariant} />;

  return (
    <IslandBoundary
      fallback={<ScenePoster className={className} variant={posterVariant} />}
    >
      <SceneCanvas
        className={className}
        scene={scene}
        posterVariant={posterVariant}
      />
    </IslandBoundary>
  );
}
