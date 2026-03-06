import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "./useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState({ theme: "dark", sidebarOpen: true });
  });

  it("has correct initial state", () => {
    const { theme, sidebarOpen } = useAppStore.getState();
    expect(theme).toBe("dark");
    expect(sidebarOpen).toBe(true);
  });

  it("setTheme updates theme", () => {
    useAppStore.getState().setTheme("light");
    expect(useAppStore.getState().theme).toBe("light");
  });

  it("toggleTheme switches between light and dark", () => {
    useAppStore.getState().toggleTheme();
    expect(useAppStore.getState().theme).toBe("light");

    useAppStore.getState().toggleTheme();
    expect(useAppStore.getState().theme).toBe("dark");
  });

  it("setSidebarOpen sets value", () => {
    useAppStore.getState().setSidebarOpen(false);
    expect(useAppStore.getState().sidebarOpen).toBe(false);
  });

  it("toggleSidebar flips sidebarOpen", () => {
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(false);

    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(true);
  });
});
