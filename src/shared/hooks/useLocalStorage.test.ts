import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("returns initial value when key does not exist", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("sets and reads a value", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => { result.current[1]("updated"); });

    expect(result.current[0]).toBe("updated");
    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("updated"));
  });

  it("accepts a function updater", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));

    act(() => { result.current[1]((prev) => prev + 1); });

    expect(result.current[0]).toBe(1);
  });

  it("removes value and resets to initial", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => { result.current[1]("updated"); });
    act(() => { result.current[2](); });

    expect(result.current[0]).toBe("default");
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("works with objects", () => {
    const initial = { name: "John", age: 30 };
    const { result } = renderHook(() => useLocalStorage("user", initial));

    act(() => { result.current[1]({ name: "Jane", age: 25 }); });

    expect(result.current[0]).toEqual({ name: "Jane", age: 25 });
  });
});
