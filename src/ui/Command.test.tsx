import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Command } from "./Command";

describe("Command", () => {
  it("syncs the input value when initialQuery changes", () => {
    const { rerender } = render(
      <Command initialQuery="docs">
        <Command.Input placeholder="Search components" />
      </Command>,
    );

    const input = screen.getByPlaceholderText("Search components");

    expect(input).toHaveValue("docs");

    rerender(
      <Command initialQuery="dialog">
        <Command.Input placeholder="Search components" />
      </Command>,
    );

    expect(input).toHaveValue("dialog");
  });
});
