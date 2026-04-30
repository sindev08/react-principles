"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/docs/introduction", label: "Docs" },
  { href: "/nextjs/cookbook", label: "Cookbook" },
  { href: "/create", label: "Create" },
] as const;

function GithubIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background-light/80 dark:bg-background-dark/80 border-primary/10 dark:border-white/5 backdrop-blur-md">
      <div className="grid grid-cols-3 items-center h-16 px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-icon.svg"
            alt="React Principles logo"
            width={32}
            height={32}
            className="block dark:hidden"
          />
          <Image
            src="/logo-icon-dark.svg"
            alt="React Principles logo"
            width={32}
            height={32}
            className="hidden dark:block"
          />
          <span className="text-lg tracking-tight">
            <span className="font-medium text-slate-600 dark:text-slate-300">React</span>
            {" "}
            <span className="font-black text-primary">Principles</span>
          </span>
        </div>

        <nav className="items-center justify-center hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />
          <a
            href="https://github.com/sindev08/react-principles"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center justify-center p-2 transition-colors rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white md:flex"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
          <button
            className="flex items-center justify-center transition-colors rounded-lg md:hidden w-9 h-9 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden border-primary/10 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 border-t" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="py-3 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors border-b hover:text-primary border-slate-100 dark:border-white/5 last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
