import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFilterStore, useHasActiveFilters } from "./useFilterStore";

describe("useFilterStore", () => {
  beforeEach(() => {
    useFilterStore.getState().reset();
  });

  it("has correct initial state", () => {
    const { search, role, status } = useFilterStore.getState();
    expect(search).toBe("");
    expect(role).toBeNull();
    expect(status).toBeNull();
  });

  it("setSearch updates search", () => {
    useFilterStore.getState().setSearch("john");
    expect(useFilterStore.getState().search).toBe("john");
  });

  it("setRole updates role", () => {
    useFilterStore.getState().setRole("admin");
    expect(useFilterStore.getState().role).toBe("admin");
  });

  it("setStatus updates status", () => {
    useFilterStore.getState().setStatus("active");
    expect(useFilterStore.getState().status).toBe("active");
  });

  it("reset clears all filters", () => {
    useFilterStore.getState().setSearch("test");
    useFilterStore.getState().setRole("editor");
    useFilterStore.getState().reset();

    const { search, role, status } = useFilterStore.getState();
    expect(search).toBe("");
    expect(role).toBeNull();
    expect(status).toBeNull();
  });
});

describe("useHasActiveFilters", () => {
  beforeEach(() => {
    useFilterStore.getState().reset();
  });

  it("returns false when no filters active", () => {
    const { result } = renderHook(() => useHasActiveFilters());
    expect(result.current).toBe(false);
  });

  it("returns true when search is set", () => {
    useFilterStore.getState().setSearch("test");
    const { result } = renderHook(() => useHasActiveFilters());
    expect(result.current).toBe(true);
  });

  it("returns true when role is set", () => {
    useFilterStore.getState().setRole("admin");
    const { result } = renderHook(() => useHasActiveFilters());
    expect(result.current).toBe(true);
  });

  it("returns true when status is set", () => {
    useFilterStore.getState().setStatus("active");
    const { result } = renderHook(() => useHasActiveFilters());
    expect(result.current).toBe(true);
  });
});
