import { describe, it, expect } from "vitest";
import {
  listComponents,
  searchComponents,
  getComponent,
  REGISTRY,
} from "./ui-registry";

describe("listComponents", () => {
  it("returns every registry entry with the summary fields", () => {
    const components = listComponents();
    expect(components.length).toBe(REGISTRY.length);
    for (const c of components) {
      expect(c.name).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(["components", "hooks", "lib"]).toContain(c.target);
    }
  });
});

describe("searchComponents", () => {
  it("ranks name matches above description-only matches", () => {
    const results = searchComponents("dialog");
    expect(results.length).toBeGreaterThan(0);
    // 'dialog' is in the name of several entries — those rank first
    expect(results[0]?.name).toContain("dialog");
  });

  it("respects the limit", () => {
    expect(searchComponents("a", 3).length).toBeLessThanOrEqual(3);
  });

  it("returns empty for queries with no usable terms", () => {
    expect(searchComponents("")).toEqual([]);
    expect(searchComponents("x !")).toEqual([]);
  });
});

describe("getComponent", () => {
  it("returns source, install command, and resolved deps for a known component", () => {
    const badge = getComponent("badge");
    expect(badge).not.toBeNull();
    expect(badge?.installCommand).toBe("npx react-principles add badge");
    expect(badge?.source).toContain("import");
    // badge depends on `utils`, whose npm deps must be pulled in transitively
    expect(badge?.internalDeps).toContain("utils");
    expect(badge?.resolvedNpmDeps).toContain("clsx");
    expect(badge?.resolvedNpmDeps).toContain("tailwind-merge");
  });

  it("returns null for an unknown component", () => {
    expect(getComponent("does-not-exist")).toBeNull();
  });

  it("returns non-empty source for every registry entry", () => {
    for (const entry of REGISTRY) {
      const detail = getComponent(entry.name);
      expect(detail?.source, `${entry.name} has source`).toBeTruthy();
    }
  });
});
