import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatNumber } from "./formatters";

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats other currencies", () => {
    const result = formatCurrency(1000, "EUR", "de-DE");
    expect(result).toContain("1.000,00");
    expect(result).toContain("€");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative amounts", () => {
    expect(formatCurrency(-99.99)).toBe("-$99.99");
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const date = new Date("2026-01-15T00:00:00Z");
    const result = formatDate(date, { year: "numeric", month: "short", day: "numeric" }, "en-US");
    expect(result).toContain("2026");
    expect(result).toContain("15");
  });

  it("formats an ISO string", () => {
    const result = formatDate("2026-06-01T00:00:00Z", { year: "numeric", month: "short", day: "numeric" }, "en-US");
    expect(result).toContain("2026");
  });

  it("formats a timestamp", () => {
    const ts = new Date("2026-03-01T00:00:00Z").getTime();
    const result = formatDate(ts, { year: "numeric" }, "en-US");
    expect(result).toBe("2026");
  });
});

describe("formatNumber", () => {
  it("formats with default options", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats with decimal places", () => {
    expect(formatNumber(3.14159, { maximumFractionDigits: 2 })).toBe("3.14");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});
