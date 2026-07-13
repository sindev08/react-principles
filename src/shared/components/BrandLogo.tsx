import Link from "next/link";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";

interface BrandLogoProps {
  /** Extra classes for the link wrapper (e.g. layout tweaks per header). */
  className?: string;
}

/**
 * The React Principles brand mark — logo + wordmark, linked to home.
 * Single source of truth so every header renders it identically.
 */
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="React Principles home"
      className={cn(
        "flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80",
        className,
      )}
    >
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
      <span className="truncate text-lg tracking-tight">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          React
        </span>{" "}
        <span className="font-black text-primary">Principles</span>
      </span>
    </Link>
  );
}
