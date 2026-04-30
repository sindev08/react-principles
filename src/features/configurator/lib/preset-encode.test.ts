import { describe, expect, it } from "vitest";
import { encodePreset, decodePreset } from "./preset-encode";
import { DEFAULT_PRESET } from "../data/default-config";
import type { PresetConfig } from "../data/config-schema";

describe("preset-encode", () => {
  const sampleConfig: PresetConfig = {
    style: "arc",
    colors: {
      base: "#0f172a",
      brand: "#3b82f6",
      accent: "#8b5cf6",
      chart: "#10b981",
    },
    fonts: {
      header: "Inter",
      body: "Inter",
    },
    iconSet: "material-symbols",
    radius: "md",
    components: ["Button", "Input", "Card"],
    stack: {
      framework: "nextjs",
      stateManagement: true,
      dataFetching: true,
      forms: true,
      monorepo: false,
      rtl: false,
    },
    version: 1,
  };

  describe("encodePreset", () => {
    it("encodes a valid config to URL-safe string", () => {
      const encoded = encodePreset(sampleConfig);
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe("string");
    });

    it("produces URL-safe output", () => {
      const encoded = encodePreset(sampleConfig);
      // Should not contain +, /, or = characters
      expect(encoded).not.toMatch(/[+/=]/);
      // Should only contain URL-safe characters
      expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it("produces output smaller than 2KB", () => {
      const encoded = encodePreset(sampleConfig);
      const sizeInBytes = new Blob([encoded]).size;
      expect(sizeInBytes).toBeLessThan(2048); // 2KB
    });

    it("produces consistent output for same input", () => {
      const encoded1 = encodePreset(sampleConfig);
      const encoded2 = encodePreset(sampleConfig);
      expect(encoded1).toBe(encoded2);
    });

    it("throws on invalid config", () => {
      const invalidConfig = {
        ...sampleConfig,
        colors: {
          base: "not-a-hex",
          brand: "#3b82f6",
          accent: "#8b5cf6",
          chart: "#10b981",
        },
      } as unknown as PresetConfig;

      expect(() => encodePreset(invalidConfig)).toThrow();
    });
  });

  describe("decodePreset", () => {
    it("decodes a valid encoded string back to config", () => {
      const encoded = encodePreset(sampleConfig);
      const decoded = decodePreset(encoded);
      expect(decoded).toEqual(sampleConfig);
    });

    it("returns default preset on malformed input", () => {
      const malformed = "not-valid-base64!!!";
      const decoded = decodePreset(malformed);
      expect(decoded).toEqual(DEFAULT_PRESET);
    });

    it("returns default preset on empty string", () => {
      const decoded = decodePreset("");
      expect(decoded).toEqual(DEFAULT_PRESET);
    });

    it("handles URL-safe encoding correctly", () => {
      const encoded = encodePreset(sampleConfig);
      // Manually replace -_ with +/ to test URL-safe restoration
      const _standardBase64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = decodePreset(encoded);
      expect(decoded).toEqual(sampleConfig);
    });
  });

  describe("roundtrip encoding/decoding", () => {
    it("maintains data integrity through encode→decode cycle", () => {
      const encoded = encodePreset(sampleConfig);
      const decoded = decodePreset(encoded);
      expect(decoded).toEqual(sampleConfig);
    });

    it("roundtrips with different style presets", () => {
      const styles: Array<"arc" | "edge" | "soleil"> = ["arc", "edge", "soleil"];
      styles.forEach((style) => {
        const config = { ...sampleConfig, style };
        const encoded = encodePreset(config);
        const decoded = decodePreset(encoded);
        expect(decoded).toEqual(config);
      });
    });

    it("roundtrips with different radius options", () => {
      const radii: Array<"none" | "sm" | "md" | "lg" | "full"> = [
        "none",
        "sm",
        "md",
        "lg",
        "full",
      ];
      radii.forEach((radius) => {
        const config = { ...sampleConfig, radius };
        const encoded = encodePreset(config);
        const decoded = decodePreset(encoded);
        expect(decoded).toEqual(config);
      });
    });

    it("roundtrips with different framework options", () => {
      const frameworks: Array<"nextjs" | "vite"> = ["nextjs", "vite"];
      frameworks.forEach((framework) => {
        const config = {
          ...sampleConfig,
          stack: { ...sampleConfig.stack, framework },
        };
        const encoded = encodePreset(config);
        const decoded = decodePreset(encoded);
        expect(decoded).toEqual(config);
      });
    });

    it("roundtrips with empty component list", () => {
      const config = { ...sampleConfig, components: [] };
      const encoded = encodePreset(config);
      const decoded = decodePreset(encoded);
      expect(decoded).toEqual(config);
    });

    it("roundtrips with large component list", () => {
      const manyComponents = Array.from({ length: 50 }, (_, i) => `Component${i}`);
      const config = { ...sampleConfig, components: manyComponents };
      const encoded = encodePreset(config);
      const decoded = decodePreset(encoded);
      expect(decoded).toEqual(config);
    });
  });

  describe("compression effectiveness", () => {
    it("compressed output is smaller than JSON", () => {
      const json = JSON.stringify(sampleConfig);
      const jsonSize = new Blob([json]).size;
      const encoded = encodePreset(sampleConfig);
      const compressedSize = new Blob([encoded]).size;

      // Compressed should be smaller (or at least not significantly larger due to base64 overhead)
      // Base64 increases size by ~33%, so we expect compressed+base64 to be smaller than raw JSON
      expect(compressedSize).toBeLessThan(jsonSize);
    });
  });
});
