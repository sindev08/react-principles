import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputGroup } from "./InputGroup";

describe("InputGroup", () => {
  it("renders with prefix and suffix slots", () => {
    render(
      <InputGroup
        label="Amount"
        prefix={<span>Rp</span>}
        suffix={<span>.00</span>}
        placeholder="100000"
      />,
    );

    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Rp")).toBeInTheDocument();
    expect(screen.getByText(".00")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("100000")).toBeInTheDocument();
  });

  it("handles disabled state across label and input", () => {
    render(
      <InputGroup
        label="Search"
        placeholder="Search keywords..."
        disabled
      />,
    );

    const input = screen.getByPlaceholderText("Search keywords...");
    expect(input).toBeDisabled();
    const label = screen.getByText("Search");
    expect(label).toHaveClass("opacity-50");
  });

  it("renders error message and applies error styles", () => {
    render(
      <InputGroup
        label="Price"
        placeholder="0"
        error="Price is required"
      />,
    );

    expect(screen.getByText("Price is required")).toBeInTheDocument();
    expect(screen.getByText("Price is required")).toHaveClass("text-red-500");
  });
});
