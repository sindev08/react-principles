import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  let changeListeners: Array<(event: { matches: boolean }) => void>;
  let mockMatches: boolean;

  beforeEach(() => {
    changeListeners = [];
    mockMatches = false;

    // Mock window.matchMedia — jsdom doesn't implement it
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        get matches() {
          return mockMatches;
        },
        media: query,
        addEventListener: (_event: string, handler: (event: { matches: boolean }) => void) => {
          changeListeners.push(handler);
        },
        removeEventListener: (_event: string, handler: (event: { matches: boolean }) => void) => {
          changeListeners = changeListeners.filter((h) => h !== handler);
        },
      })),
    });
  });

  afterEach(() => {
    changeListeners = [];
  });

  it("returns false initially (SSR-safe default)", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);
  });

  it("returns true when media query matches on mount", () => {
    mockMatches = true;
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("updates when media query changes", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);

    mockMatches = true;
    act(() => {
      changeListeners.forEach((listener) => listener({ matches: true }));
    });
    expect(result.current).toBe(true);
  });

  it("cleans up listener on unmount", () => {
    const { unmount } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(changeListeners.length).toBeGreaterThan(0);

    unmount();
    expect(changeListeners.length).toBe(0);
  });
});
