"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCopyToClipboardOptions {
  /** How long the `copied` flag stays true, in ms. Defaults to 2000. */
  resetDelay?: number;
}

interface UseCopyToClipboardResult {
  /** True for `resetDelay` ms after a successful copy. */
  copied: boolean;
  /** Copies `text` to the clipboard and flips `copied` on success. */
  copy: (text: string) => Promise<void>;
}

/**
 * Single source of truth for copy-to-clipboard behaviour: writes to
 * the clipboard, sets a `copied` flag, then resets it after a delay.
 * Every copy affordance in the app should build on this hook so the
 * timing and semantics stay consistent.
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardResult {
  const { resetDelay = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
      } catch (error) {
        console.error("Failed to copy to clipboard", error);
      }
    },
    [resetDelay],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copied, copy };
}
