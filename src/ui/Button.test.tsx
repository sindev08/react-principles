import Link from "next/link";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a link child with button styles when asChild is enabled", () => {
    render(
      <Button asChild variant="ghost" size="sm">
        <Link href="https://storybook.reactprinciples.dev">Open in Storybook</Link>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Open in Storybook" });

    expect(link).toHaveAttribute("href", "https://storybook.reactprinciples.dev");
    expect(link).toHaveClass("inline-flex", "rounded-lg", "text-xs", "px-3", "py-1.5");
  });
});
