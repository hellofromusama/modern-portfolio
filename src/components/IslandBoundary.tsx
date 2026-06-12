"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Reusable class error boundary for isolating a single "island"
 * (a dynamically-imported canvas/WebGL component) so a render throw
 * inside it degrades to a static poster fallback instead of bubbling
 * up to the route-level error.tsx and white-screening the page.
 *
 * This is the ONLY class component in the repo — expected and correct:
 * React error boundaries have no hook equivalent (getDerivedStateFromError
 * + componentDidCatch are class-only lifecycle methods).
 */
export default class IslandBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error("[IslandBoundary] island failed, showing fallback:", error);
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
