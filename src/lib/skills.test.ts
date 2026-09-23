import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./skills";

describe("parseFrontmatter", () => {
  it("parses valid frontmatter correctly", () => {
    const raw = `---
name: reactprinciples-store
description: Scaffold a Zustand store
when_to_use: When creating client-side state
allowed-tools: bash, edit
disable-model-invocation: true
---
# Content body
This is the markdown body.`;

    const result = parseFrontmatter(raw);
    expect(result).not.toBeNull();
    expect(result?.data.name).toBe("reactprinciples-store");
    expect(result?.data.description).toBe("Scaffold a Zustand store");
    expect(result?.data.when_to_use).toBe("When creating client-side state");
    expect(result?.data["allowed-tools"]).toBe("bash, edit");
    expect(result?.data["disable-model-invocation"]).toBe("true");
    expect(result?.body.trim()).toBe("# Content body\nThis is the markdown body.");
  });

  it("handles when-to-use with dash format", () => {
    const raw = `---
name: test-skill
when-to-use: Test trigger
---
Body`;

    const result = parseFrontmatter(raw);
    expect(result).not.toBeNull();
    expect(result?.data["when-to-use"]).toBe("Test trigger");
  });

  it("returns null on malformed frontmatter", () => {
    const raw = `No frontmatter here`;
    expect(parseFrontmatter(raw)).toBeNull();
  });
});
