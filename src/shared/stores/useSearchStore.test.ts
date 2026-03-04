import { beforeEach, describe, expect, it } from "vitest";
import { useSearchStore } from "./useSearchStore";

describe("useSearchStore", () => {
  beforeEach(() => {
    useSearchStore.setState({ open: false });
  });

  it("has correct initial state", () => {
    expect(useSearchStore.getState().open).toBe(false);
  });

  it("setOpen sets open to true", () => {
    useSearchStore.getState().setOpen(true);
    expect(useSearchStore.getState().open).toBe(true);
  });

  it("setOpen sets open to false", () => {
    useSearchStore.setState({ open: true });
    useSearchStore.getState().setOpen(false);
    expect(useSearchStore.getState().open).toBe(false);
  });

  it("toggle flips open state", () => {
    useSearchStore.getState().toggle();
    expect(useSearchStore.getState().open).toBe(true);

    useSearchStore.getState().toggle();
    expect(useSearchStore.getState().open).toBe(false);
  });
});
