import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchDialog, type SearchItem } from "./SearchDialog";

const ITEMS: SearchItem[] = [
  {
    title: "Button",
    href: "/docs/button",
    description: "Primitive action trigger",
    group: "Docs",
  },
];

describe("SearchDialog", () => {
  it("hydrates the search input from initialQuery when opened", () => {
    render(
      <SearchDialog
        open
        items={ITEMS}
        onClose={() => {}}
        onNavigate={() => {}}
        initialQuery="button"
      />,
    );

    expect(screen.getByPlaceholderText("Search docs, components, patterns...")).toHaveValue("button");
  });
});
