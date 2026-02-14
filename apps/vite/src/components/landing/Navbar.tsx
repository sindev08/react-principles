import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background-light/80 dark:bg-background-dark/80 border-primary/10 dark:border-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <span className="text-3xl material-symbols-outlined text-primary">
            terminal
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            react-principles
          </span>
        </div>

        <nav className="items-center hidden gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-bold transition-colors text-primary"
          >
            Home
          </Link>
          <a
            href="#why"
            className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
          >
            Why
          </a>
          <a
            href="#stack"
            className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
          >
            Tech Stack
          </a>
          <a
            href="#structure"
            className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
          >
            Structure
          </a>
          <Link
            to="/docs/introduction"
            className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all rounded-lg bg-primary hover:bg-primary/90">
            <span className="text-sm material-symbols-outlined">code</span>
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </header>
  );
}
