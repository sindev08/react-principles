"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnimatedMountResult {
  /** Whether the component should be in the DOM (stays true during exit animation) */
  mounted: boolean;
  /** Whether the "open" state is active — drives CSS enter/exit classes */
  visible: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages mount/unmount timing for animated overlays.
 *
 * - `mounted` controls DOM presence. Stays `true` during the exit animation
 *   so the element can animate out before being removed.
 * - `visible` drives CSS classes. Flip `visible` immediately on open/close;
 *   flip `mounted` only after the exit `duration` has elapsed.
 *
 * @example
 * const { mounted, visible } = useAnimatedMount(open, 200);
 * if (!mounted) return null;
 * return (
 *   <div className={visible ? "animate-in fade-in" : "animate-out fade-out"}>
 *     {children}
 *   </div>
 * );
 */
export function useAnimatedMount(open: boolean, duration = 200): AnimatedMountResult {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Double rAF ensures the element is painted before adding the visible
      // class, guaranteeing the CSS transition fires on the first frame.
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(t);
    }
  }, [open, duration]);

  return { mounted, visible };
}
