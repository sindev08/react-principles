import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("can render a link child without nesting a button element", () => {
    render(
      <Button asChild variant="ghost" size="sm">
        <a href="https://storybook.reactprinciples.dev">Open in Storybook</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Open in Storybook" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open in Storybook" })).not.toBeInTheDocument();
  });
});
