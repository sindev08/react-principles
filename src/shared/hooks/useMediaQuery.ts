import { useCallback, useEffect, useState } from "react";

/**
 * Tracks whether a CSS media query matches the current viewport.
 * Uses the `matchMedia` API and listens for changes.
 * Returns `false` during SSR.
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((q: string): boolean => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(q).matches;
  }, []);

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

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
