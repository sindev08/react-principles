import { describe, expect, it } from "vitest";
import {
  buildUsageSnippet,
  getDefaultPlaygroundEntry,
  getPlaygroundEntries,
} from "./registry";

describe("playground registry", () => {
  it("exposes component entries from the internal registry", () => {
    const entries = getPlaygroundEntries();

    expect(entries.length).toBeGreaterThan(20);
    expect(entries.some((entry) => entry.slug === "button")).toBe(true);
    expect(entries.some((entry) => entry.slug === "dialog")).toBe(true);
  });

  it("returns button as the default playground entry", () => {
    expect(getDefaultPlaygroundEntry()?.slug).toBe("button");
  });

  it("builds usage snippets from control state for configurable components", () => {
    const button = getPlaygroundEntries().find((entry) => entry.slug === "button");
    const radioGroup = getPlaygroundEntries().find((entry) => entry.slug === "radio-group");
    const command = getPlaygroundEntries().find((entry) => entry.slug === "command");
    const searchDialog = getPlaygroundEntries().find((entry) => entry.slug === "search-dialog");

    expect(button).toBeDefined();
    expect(radioGroup).toBeDefined();
    expect(command).toBeDefined();
    expect(searchDialog).toBeDefined();

    if (!button || !radioGroup || !command || !searchDialog) {
      throw new Error("Expected playground entries to exist");
    }

    const buttonSnippet = buildUsageSnippet(button, "nextjs", {
      variant: "outline",
      size: "lg",
      label: "Ship now",
      isLoading: true,
      disabled: false,
    });
    const radioSnippet = buildUsageSnippet(radioGroup, "vitejs", {
      value: "vitejs",
      showDescriptions: true,
    });
    const commandSnippet = buildUsageSnippet(command, "nextjs", {
      query: "dialog",
    });
    const searchDialogSnippet = buildUsageSnippet(searchDialog, "vitejs", {
      open: true,
      query: "button",
    });

    expect(buttonSnippet).toContain('<Button variant="outline" size="lg" isLoading>');
    expect(buttonSnippet).toContain("Ship now");
    expect(buttonSnippet).toContain('"use client";');
    expect(buttonSnippet).toContain('import { Button } from "@/components/ui/Button"');
    expect(radioSnippet).toContain('<RadioGroup value="vitejs"');
    expect(radioSnippet).toContain('description="Lean client-side tooling with fast local iteration."');
    expect(radioSnippet).toContain('import { RadioGroup } from "@/components/ui/RadioGroup"');
    expect(radioSnippet).not.toContain('"use client";');
    expect(commandSnippet).toContain('<Command initialQuery="dialog">');
    expect(searchDialogSnippet).toContain('initialQuery="button"');
  });
});
