import { compressSync, decompressSync } from "fflate";
import { presetConfigSchema } from "../data/config-schema";
import { DEFAULT_PRESET } from "../data/default-config";
import type { PresetConfig } from "../data/config-schema";

/**
 * Encode a PresetConfig object into a URL-safe base64 string
 *
 * Process:
 * 1. Validate with Zod schema
 * 2. Convert to JSON string
 * 3. Compress using fflate
 * 4. Convert to base64
 * 5. Make URL-safe (replace +/ with -_, remove = padding)
 *
 * @param config - PresetConfig object to encode
 * @returns URL-safe encoded string
 */
export function encodePreset(config: PresetConfig): string {
  // Validate with Zod schema
  const validated = presetConfigSchema.parse(config);

  // Convert to JSON string
  const json = JSON.stringify(validated);

  // Convert string to Uint8Array
  const uint8Array = new TextEncoder().encode(json);

  // Compress
  const compressed = compressSync(uint8Array);

  // Convert to binary string for base64 encoding
  let binary = "";
  compressed.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  // Base64 encode
  const base64 = btoa(binary);

  // Make URL-safe
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decode a URL-safe base64 string back to PresetConfig
 *
 * Process:
 * 1. Restore URL-safe chars (-_ to +/)
 * 2. Add padding if needed
 * 3. Base64 decode
 * 4. Decompress using fflate
 * 5. Parse JSON
 * 6. Validate with Zod schema
 * 7. Return safe fallback on error
 *
 * @param encoded - URL-safe encoded string
 * @returns PresetConfig object or default preset on error
 */
export function decodePreset(encoded: string): PresetConfig {
  try {
    // Restore URL-safe chars
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }

    // Base64 decode
    const binary = atob(base64);

    // Convert binary string to Uint8Array
    const compressed = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      compressed[i] = binary.charCodeAt(i);
    }

    // Decompress
    const decompressed = decompressSync(compressed);

    // Convert Uint8Array to string
    const json = new TextDecoder().decode(decompressed);

    // Parse JSON
    const parsed = JSON.parse(json);

    // Validate with Zod schema
    const validated = presetConfigSchema.parse(parsed);

    return validated;
  } catch (error) {
    // Return safe fallback on any error
    console.error("Failed to decode preset:", error);
    return DEFAULT_PRESET;
  }
}
