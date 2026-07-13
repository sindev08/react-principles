import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/features/landing/components";
import {
  CHANGELOG_ENTRIES,
  type ChangeType,
} from "@/features/changelog/data";
import { formatDate } from "@/shared/utils/formatters";
import { cn } from "@/shared/utils/cn";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

export const metadata: Metadata = {
  title: "Changelog — React Principles",
  description:
    "What's new in React Principles. A durable, public record of every release — new AI capabilities, components, and changes across the ecosystem.",
  openGraph: {
    title: "Changelog — React Principles",
    description:
      "A durable, public record of every React Principles release — new AI capabilities, components, and changes.",
    type: "website",
    url: `${SITE_URL}/changelog`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog — React Principles",
    description:
      "A durable, public record of every React Principles release.",
  },
  alternates: {
    canonical: `${SITE_URL}/changelog`,
  },
};

const CHANGE_LABEL: Record<ChangeType, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
};

const CHANGE_BADGE_CLASSES: Record<ChangeType, string> = {
  added:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  changed:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  fixed:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

export default function ChangelogPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-20 lg:pt-40">
        {/* Hero */}
        <section className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="material-symbols-outlined text-sm">history</span>
            Changelog
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-5xl">
            What&apos;s new in{" "}
            <span className="text-primary">React Principles</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            A durable record of what shipped in each release across the
            cookbook, UI Kit, and CLI.
          </p>
        </section>

        {/* Entries */}
        <ol className="space-y-16">
          {CHANGELOG_ENTRIES.map((entry) => (
            <li
              key={`${entry.date}-${entry.title}`}
              className="border-t border-slate-200 pt-8 dark:border-white/5"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <time
                  dateTime={entry.date}
                  className="text-sm font-medium text-slate-500 dark:text-slate-400"
                >
                  {formatDate(`${entry.date}T00:00:00`)}
                </time>
                {entry.version && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    v{entry.version}
                  </span>
                )}
              </div>

              <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {entry.title}
              </h2>
              <p className="mb-6 leading-7 text-slate-600 dark:text-slate-400">
                {entry.summary}
              </p>

              <ul className="space-y-4">
                {entry.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4"
                  >
                    <span
                      className={cn(
                        "inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide sm:mt-0.5",
                        CHANGE_BADGE_CLASSES[item.type],
                      )}
                    >
                      {CHANGE_LABEL[item.type]}
                    </span>
                    <p className="leading-7 text-slate-700 dark:text-slate-300">
                      {item.text}{" "}
                      {item.href && (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline-offset-2 hover:underline"
                        >
                          Details
                        </a>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {/* AI-readable pointer */}
        <p className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-white/5 dark:text-slate-400">
          Reading with an AI tool? The same history is available as markdown at{" "}
          <Link
            href="/changelog.txt"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            /changelog.txt
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
