"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether a CSS media query matches the current viewport.
 * Uses the `matchMedia` API and listens for changes.
 * Returns `false` during SSR and on the initial render to avoid hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {

  // Always init false so SSR and client hydration match, then sync in useEffect
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value in case it changed between render and effect
    setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", handleChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
