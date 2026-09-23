import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./Label";

describe("Label", () => {
  it("renders label element with children text", () => {
    render(<Label htmlFor="test-input">Username</Label>);
    const label = screen.getByText("Username");
    expect(label.tagName.toLowerCase()).toBe("label");
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("renders required asterisk indicator when required is true", () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies disabled and muted styles when disabled is true", () => {
    render(<Label disabled>Disabled Label</Label>);
    const label = screen.getByText("Disabled Label");
    expect(label).toHaveClass("opacity-50", "cursor-not-allowed");
  });
});
