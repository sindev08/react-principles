import { describe, it, expect } from "vitest";
import { cn } from "../src/utils/cn";
import { formatCurrency, formatDate, formatNumber } from "../src/utils/formatters";

describe("cn", () => {
  it("should merge class names", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    const result = cn("base", true && "included", false && "excluded");
    expect(result).toBe("base included");
  });

  it("should resolve Tailwind CSS conflicts (last wins)", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle arrays of classes", () => {
    const result = cn(["foo", "bar"], "baz");
    expect(result).toBe("foo bar baz");
  });

  it("should handle object syntax", () => {
    const result = cn({ "text-red-500": true, "text-blue-500": false });
    expect(result).toBe("text-red-500");
  });

  it("should handle undefined and null values", () => {
    const result = cn("foo", undefined, null, "bar");
    expect(result).toBe("foo bar");
  });

  it("should return empty string for no arguments", () => {
    const result = cn();
    expect(result).toBe("");
  });
});

describe("formatCurrency", () => {
  it("should format USD by default", () => {
    const result = formatCurrency(1234.56);
    expect(result).toBe("$1,234.56");
  });

  it("should format zero", () => {
    const result = formatCurrency(0);
    expect(result).toBe("$0.00");
  });

  it("should format negative amounts", () => {
    const result = formatCurrency(-99.99);
    expect(result).toBe("-$99.99");
  });

  it("should format with a different currency", () => {
    const result = formatCurrency(1000, "EUR", "de-DE");
    expect(result).toContain("1.000,00");
  });
});

describe("formatDate", () => {
  it("should format an ISO date string with default options", () => {
    const result = formatDate("2024-01-15T00:00:00.000Z");
    expect(result).toMatch(/Jan\s+15,\s+2024/);
  });

  it("should format a Date object", () => {
    const date = new Date("2024-06-01T00:00:00.000Z");
    const result = formatDate(date);
    expect(result).toMatch(/Jun\s+1,\s+2024|May\s+31,\s+2024/);
  });

  it("should accept custom formatting options", () => {
    const result = formatDate("2024-01-15T00:00:00.000Z", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(result).toContain("2024");
    expect(result).toContain("January");
  });
});

describe("formatNumber", () => {
  it("should format a number with default options", () => {
    const result = formatNumber(1234567.89);
    expect(result).toBe("1,234,567.89");
  });

  it("should format with custom options", () => {
    const result = formatNumber(0.756, {
      style: "percent",
    });
    expect(result).toBe("76%");
  });

  it("should format zero", () => {
    const result = formatNumber(0);
    expect(result).toBe("0");
  });

  it("should format negative numbers", () => {
    const result = formatNumber(-42);
    expect(result).toBe("-42");
  });
});
