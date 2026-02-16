import { useEffect, useRef } from "react";
import { useAppStore } from "@react-principles/shared/stores";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!initializedRef.current) {
      initializedRef.current = true;
      const stored = localStorage.getItem("theme") as "dark" | "light" | null;
      if (stored && stored !== theme) {
        root.classList.toggle("dark", stored === "dark");
        useAppStore.getState().setTheme(stored);
        return;
      }
    }
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

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
