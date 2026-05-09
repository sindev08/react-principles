import { inflateRawSync } from "zlib";

export interface CliPreset {
  style: "arc" | "edge" | "soleil";
  colors: { base: string; brand: string; accent: string; chart: string };
  fonts: { header: string; body: string };
  iconSet: string;
  radius: "none" | "sm" | "md" | "lg";
  components: string[];
  stack: {
    framework: "nextjs" | "vite";
    stateManagement: boolean;
    dataFetching: boolean;
    forms: boolean;
    monorepo: boolean;
    rtl: boolean;
  };
  version: number;
}

/**
 * Decodes a URL-safe base64+deflate preset string produced by encodePreset()
 * in the web app. Uses Node.js built-in zlib (raw deflate) — no extra deps.
 */
export function decodePreset(encoded: string): CliPreset | null {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";

    const compressed = Buffer.from(base64, "base64");
    const decompressed = inflateRawSync(compressed);
    const json = decompressed.toString("utf8");
    return JSON.parse(json) as CliPreset;
  } catch (err) {
    const reason = err instanceof SyntaxError
      ? "invalid JSON after decompression"
      : err instanceof Error && err.message.includes("incorrect header check")
        ? "invalid compression format"
        : "could not decode";
    console.warn(`⚠ Preset decode failed (${reason}). Make sure you copied it correctly from reactprinciples.dev/create.`);
    return null;
  }
}
