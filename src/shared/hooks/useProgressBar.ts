import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressBarState {
  /** Current progress 0–100 */
  progress: number;
  /** Whether the bar should be visible (false = fade out) */
  visible: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Fake-progress animation keyed to a navigation signal (e.g. pathname).
 *
 * - Skips the initial mount (no bar on first page load)
 * - On key change: 0 → 40% instantly, eases to 75%, then jumps to 100%
 * - Fades out after completion
 *
 * @example
 * const { progress, visible } = useProgressBar(pathname);
 */
export function useProgressBar(key: string): ProgressBarState {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    // Skip initial mount — only fire on actual navigations
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    setProgress(0);
    setVisible(true);

    const t1 = setTimeout(() => setProgress(40), 10);
    const t2 = setTimeout(() => setProgress(75), 250);
    const t3 = setTimeout(() => setProgress(100), 500);
    // Fade out after the bar reaches 100%
    const t4 = setTimeout(() => setVisible(false), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [key]);

  return { progress, visible };
}
