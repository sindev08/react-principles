import { describe, expect, it } from "vitest";
import { getStorybookComponentUrl, STORYBOOK_BASE_URL } from "./storybook";

describe("getStorybookComponentUrl", () => {
  it("builds the default story URL from a component slug", () => {
    expect(getStorybookComponentUrl("button")).toBe(
      `${STORYBOOK_BASE_URL}/?path=/story/ui-button--default`,
    );
  });

  it("preserves hyphenated slugs", () => {
    expect(getStorybookComponentUrl("alert-dialog")).toBe(
      `${STORYBOOK_BASE_URL}/?path=/story/ui-alertdialog--destructive`,
    );
  });

  it("maps multi-word Storybook titles to their actual story ids", () => {
    expect(getStorybookComponentUrl("date-picker")).toBe(
      `${STORYBOOK_BASE_URL}/?path=/story/ui-datepicker--default`,
    );
    expect(getStorybookComponentUrl("dropdown-menu")).toBe(
      `${STORYBOOK_BASE_URL}/?path=/story/ui-dropdownmenu--default`,
    );
    expect(getStorybookComponentUrl("radio-group")).toBe(
      `${STORYBOOK_BASE_URL}/?path=/story/ui-radiogroup--default`,
    );
  });

  it("maps components without a Default story to the closest primary story", () => {
    expect(getStorybookComponentUrl("separator")).toBe(
      `${STORYBOOK_BASE_URL}/?path=/story/ui-separator--horizontal`,
    );
    expect(getStorybookComponentUrl("tabs")).toBe(
      `${STORYBOOK_BASE_URL}/?path=/story/ui-tabs--underline`,
    );
    expect(getStorybookComponentUrl("tooltip")).toBe(
      `${STORYBOOK_BASE_URL}/?path=/story/ui-tooltip--top`,
    );
  });
});
