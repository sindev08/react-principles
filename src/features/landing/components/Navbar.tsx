"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Home", active: true },
  { href: "#why", label: "Why" },
  { href: "#stack", label: "Tech Stack" },
  { href: "#structure", label: "Structure" },
  { href: "/docs/introduction", label: "Docs" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background-light/80 dark:bg-background-dark/80 border-primary/10 dark:border-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
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
          <span className="text-lg font-extrabold tracking-tight text-primary">
            react-principles
          </span>
        </div>

        <nav className="items-center hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-primary ${
                link.active
                  ? "font-bold text-primary"
                  : "font-medium text-slate-600 dark:text-slate-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/nextjs/cookbook"
            className="items-center hidden gap-2 px-4 py-2 text-sm font-bold text-white transition-all rounded-lg md:flex bg-primary hover:bg-primary/90"
          >
            <span className="text-sm material-symbols-outlined">menu_book</span>
            <span>Cookbook</span>
          </Link>
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
              className={`py-3 text-sm transition-colors border-b hover:text-primary border-slate-100 dark:border-white/5 last:border-0 ${
                link.active
                  ? "font-bold text-primary"
                  : "font-medium text-slate-600 dark:text-slate-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/nextjs/cookbook"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 mt-3 text-sm font-bold text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
          >
            <span className="text-sm material-symbols-outlined">menu_book</span>
            <span>Cookbook</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
