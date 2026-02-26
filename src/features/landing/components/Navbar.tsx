"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { FrameworkSwitcher } from "./FrameworkSwitcher";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background-light/80 dark:bg-background-dark/80 border-primary/10 dark:border-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight text-primary">
            react-principles
          </span>
        </div>

        <nav className="items-center hidden gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-bold transition-colors text-primary"
          >
            Home
          </Link>
          <Link
            href="#why"
            className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
          >
            Why
          </Link>
          <Link
            href="#stack"
            className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
          >
            Tech Stack
          </Link>
          <Link
            href="#structure"
            className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
          >
            Structure
          </Link>
          <FrameworkSwitcher />
          <Link
            href="/docs/introduction"
            className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/nextjs/cookbook"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
          >
            <span className="text-sm material-symbols-outlined">menu_book</span>
            <span>Cookbook</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
