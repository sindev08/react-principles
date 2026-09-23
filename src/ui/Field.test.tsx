import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";

describe("Field", () => {
  it("renders label and connects to child input via generated id", () => {
    render(
      <Field label="Full Name">
        <input placeholder="Enter name" />
      </Field>,
    );

    const input = screen.getByPlaceholderText("Enter name");
    const label = screen.getByText("Full Name");
    expect(input).toHaveAttribute("id", "full-name");
    expect(label).toHaveAttribute("for", "full-name");
  });

  it("passes disabled state to both Label and child input", () => {
    render(
      <Field label="Phone" disabled>
        <input placeholder="Phone number" />
      </Field>,
    );

    const label = screen.getByText("Phone");
    const input = screen.getByPlaceholderText("Phone number");
    expect(label).toHaveClass("opacity-50", "cursor-not-allowed");
    expect(input).toBeDisabled();
  });

  it("displays helperText when there is no error", () => {
    render(
      <Field label="Bio" helperText="Maximum 200 characters">
        <textarea placeholder="Tell about yourself" />
      </Field>,
    );

    expect(screen.getByText("Maximum 200 characters")).toBeInTheDocument();
  });

  it("displays errorMessage in error style and overrides helperText", () => {
    render(
      <Field
        label="Email"
        helperText="We will never share your email"
        errorMessage="Invalid email address"
      >
        <input placeholder="Email" />
      </Field>,
    );

    expect(screen.queryByText("We will never share your email")).not.toBeInTheDocument();
    const error = screen.getByText("Invalid email address");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("text-red-500");

    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
