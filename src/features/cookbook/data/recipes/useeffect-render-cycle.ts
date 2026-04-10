import type { RecipeDetail } from "../types";

export const useeffectRenderCycle: RecipeDetail = {
  slug: "useeffect-render-cycle",
  title: "useEffect & Render Cycle",
  breadcrumbCategory: "Foundations",
  description: "When effects run, why the dependency array exists, and how to clean up after yourself.",
  lastUpdated: "2026-03-01",
  principle: {
    text: "useEffect is not a lifecycle method — it is a synchronization tool. It answers one question: 'what side effects need to stay in sync with this data?' Every time the dependency array changes, React re-runs the effect to keep things synchronized. When you understand this mental model, dependency arrays stop feeling like magic rules and start making sense.",
    tip: "If you find yourself writing useEffect to fetch data, stop. That is what React Query is for. useEffect is for synchronizing with things outside React — browser APIs, subscriptions, timers.",
  },
  rules: [
    {
      title: "Always declare dependencies honestly",
      description: "Every value from the component scope used inside the effect belongs in the dependency array. If you add eslint-disable to hide a missing dependency, you have a bug.",
    },
    {
      title: "Return a cleanup function when needed",
      description: "If your effect creates a subscription, timer, or event listener — clean it up in the return function. Otherwise you get memory leaks and stale handlers.",
    },
    {
      title: "Empty array means once on mount",
      description: "[] runs the effect once after the first render. Only use this when the effect truly has no dependencies — not as a shortcut to avoid thinking about deps.",
    },
    {
      title: "Do not use useEffect for data fetching",
      description: "Fetching data inside useEffect causes race conditions, no loading state management, and no caching. Use React Query instead.",
    },
  ],
  pattern: {
    filename: "hooks/useWindowSize.ts — effect with cleanup",
    code: `import { useEffect, useState } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // The effect: subscribe to resize events
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    // The cleanup: unsubscribe when component unmounts
    // or before the effect re-runs
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // No deps — window never changes

  return size;
}`,
  },
  implementation: {
    nextjs: {
      description: "In Next.js, window is not available on the server. Use 'use client' and guard browser API access. See all three hooks in the starter template: github.com/sindev08/react-principles-nextjs → src/shared/hooks/",
      filename: "shared/hooks/useDebounce.ts — from react-principles-nextjs starter",
      code: `'use client';

import { useEffect, useState } from 'react';

// Effect pattern: setTimeout with cleanup
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: clear the timer if value changes before it fires
    // This is what makes it a "debounce" — rapid changes reset the timer
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // ✅ Honest dependencies

  return debouncedValue;
}

// Also in the starter:
// useMediaQuery — useSyncExternalStore with matchMedia (event listener pattern)
// useLocalStorage — cross-tab sync via storage event (cleanup pattern)`,
    },
    vite: {
      description: "In Vite, all code runs in the browser — no SSR concerns. The pattern is straightforward.",
      filename: "shared/hooks/useWindowSize.ts",
      code: `import { useEffect, useState } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View hooks in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/tree/main/src/shared/hooks",
  },
};
