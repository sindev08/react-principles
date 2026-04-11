import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DocsSidebar } from "./DocsSidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/docs/button",
}));

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("DocsSidebar", () => {
  it("renders a static Storybook footer link on docs pages", () => {
    render(<DocsSidebar />);

    const link = screen.getByRole("link", { name: /storybook/i });

    expect(link).toHaveAttribute("href", "https://storybook.reactprinciples.dev");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
