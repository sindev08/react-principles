"use client";

import { useEffect } from "react";
import { useAppStore } from "@react-principles/shared/stores";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  // Sync Zustand state → <html> class + localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Initialize from localStorage / system preference on first mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      useAppStore.getState().setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      useAppStore.getState().setTheme("dark");
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
    >
      {theme === "dark" ? (
        <span className="material-symbols-outlined text-xl">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-xl">dark_mode</span>
      )}
    </button>
  );
}
