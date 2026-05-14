import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/features/landing/components";
import { cn } from "@/shared/utils/cn";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";
const SKILLS_REPO_URL = "https://github.com/sindev08/react-principles-skills";
const SKILLS_INSTALL_CMD = "npx skills add sindev08/react-principles-skills";

export const metadata: Metadata = {
  title: "AI Corpus — React Principles",
  description:
    "Make your AI tools React Principles-aware. Drop-in context for Claude, Cursor, Copilot, and GPT — plus invocable skills for code review and scaffolding.",
  openGraph: {
    title: "AI Corpus — React Principles",
    description:
      "Make your AI tools React Principles-aware. llms.txt + Agent Skills for Claude, Cursor, Copilot, and GPT.",
    type: "website",
    url: `${SITE_URL}/ai`,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Corpus — React Principles",
    description:
      "Make your AI tools React Principles-aware. llms.txt + Agent Skills for any AI assistant.",
  },
  alternates: {
    canonical: `${SITE_URL}/ai`,
  },
};

interface Skill {
  name: string;
  description: string;
  category: "review" | "scaffolding" | "internal" | "umbrella";
}

const SKILLS: Skill[] = [
  {
    name: "reactprinciples",
    description:
      "Umbrella skill — routes intent to the right sub-skill (review, scaffold, audit).",
    category: "umbrella",
  },
  {
    name: "reactprinciples-review",
    description:
      "Review React/TypeScript code against 13 principle categories. Flags violations with reasoning and fixes.",
    category: "review",
  },
  {
    name: "reactprinciples-folder-structure",
    description:
      "Scaffold a feature-sliced folder layout (components, hooks, stores, data).",
    category: "scaffolding",
  },
  {
    name: "reactprinciples-component",
    description:
      "Scaffold a UI component — props extending HTMLAttributes, Record variants, cn() for class merging.",
    category: "scaffolding",
  },
  {
    name: "reactprinciples-hook",
    description:
      "Scaffold a custom hook with proper naming, stable return shape, and colocated test.",
    category: "scaffolding",
  },
  {
    name: "reactprinciples-store",
    description:
      "Scaffold a Zustand store with selectors, actions, reset, and 'use client' boundary.",
    category: "scaffolding",
  },
  {
    name: "reactprinciples-query",
    description:
      "Scaffold a React Query hook (list, detail, search, or mutation) with staleTime and enabled.",
    category: "scaffolding",
  },
  {
    name: "reactprinciples-form",
    description:
      "Scaffold a React Hook Form + Zod form. Shares schemas between create and edit via .omit/.pick.",
    category: "scaffolding",
  },
  {
    name: "reactprinciples-recipe",
    description:
      "Draft a new cookbook recipe in the standard structure. (Cookbook maintainer skill.)",
    category: "internal",
  },
  {
    name: "reactprinciples-audit-recipe",
    description:
      "Audit an existing recipe for accuracy against the codebase. (Cookbook maintainer skill.)",
    category: "internal",
  },
];

const CATEGORY_LABELS: Record<Skill["category"], string> = {
  umbrella: "Master",
  review: "Review",
  scaffolding: "Scaffolding",
  internal: "Internal",
};

const CATEGORY_BADGE_CLASSES: Record<Skill["category"], string> = {
  umbrella:
    "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  review:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  scaffolding:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  internal:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function AICorpusPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-20 lg:pt-40">
        {/* Hero */}
        <section className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="material-symbols-outlined text-sm">
              auto_awesome
            </span>
            AI Corpus
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-6xl">
            Make your AI tools{" "}
            <span className="text-primary">React Principles–aware</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Drop-in context for Claude, Cursor, Copilot, and GPT. Plus
            invocable skills that scaffold code and review against documented
            patterns — installable in one command.
          </p>
        </section>

        {/* Two main offerings */}
        <section className="mb-20 grid gap-6 md:grid-cols-2">
          <OfferingCard
            icon="terminal"
            title="Skills"
            subtitle="Invocable commands"
            description="10 Agent Skills following the open standard. Works with Claude Code, Cursor, and any AI tool that supports skills.sh."
            cta={{ label: "View skills below", href: "#skills" }}
          />
          <OfferingCard
            icon="description"
            title="llms.txt"
            subtitle="Drop-in AI context"
            description="The cookbook as AI-readable markdown. Two versions: compact for quick reference, full for deep RAG context."
            cta={{ label: "See files below", href: "#llms-txt" }}
          />
        </section>

        {/* Skills */}
        <section id="skills" className="mb-20 scroll-mt-24">
          <SectionHeader
            eyebrow="Skills"
            title="Invocable commands"
            description="Install once, invoke when needed. Each skill encodes a workflow — from reviewing code to scaffolding components — following React Principles patterns exactly."
          />

          {/* Install instructions */}
          <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Install all skills with one command:
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100 dark:bg-black">
              <code>{SKILLS_INSTALL_CMD}</code>
            </pre>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Or manually copy any{" "}
              <code className="rounded bg-slate-200 px-1 py-0.5 font-mono dark:bg-slate-800">
                SKILL.md
              </code>{" "}
              from the{" "}
              <Link
                href={SKILLS_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                react-principles-skills repo
              </Link>{" "}
              into{" "}
              <code className="rounded bg-slate-200 px-1 py-0.5 font-mono dark:bg-slate-800">
                ~/.claude/skills/
              </code>
              .
            </p>
          </div>

          {/* Skills grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {SKILLS.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </section>

        {/* llms.txt */}
        <section id="llms-txt" className="mb-20 scroll-mt-24">
          <SectionHeader
            eyebrow="llms.txt"
            title="Drop-in AI context"
            description="The cookbook compiled into AI-readable markdown. Auto-rebuilds on every publish. No setup — just point your AI at the URL."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <LlmsCard
              title="Compact"
              size="~5K tokens"
              href={`${SITE_URL}/llms.txt`}
              description="Principles + rules only, no code. Drop into any AI context window for quick principle-aware help."
              useCase="Best for: quick chat sessions, lightweight rules in Cursor."
            />
            <LlmsCard
              title="Full"
              size="~17K tokens"
              href={`${SITE_URL}/llms-full.txt`}
              description="Every recipe with pattern code and Next.js + Vite implementations. Suitable for RAG, fine-tuning, or long-form briefing."
              useCase="Best for: custom AI assistants, retrieval pipelines, deep context."
            />
          </div>
        </section>

        {/* Use cases */}
        <section className="mb-20">
          <SectionHeader
            eyebrow="Use cases"
            title="How developers use this"
            description="Practical patterns for getting AI tools aligned with React Principles."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <UseCaseCard
              icon="rule"
              title="Code review in editor"
              description={`Invoke "/reactprinciples-review" in Claude Code or Cursor to audit your changes against documented patterns before opening a PR.`}
            />
            <UseCaseCard
              icon="construction"
              title="Scaffold features faster"
              description={`Use "/reactprinciples-component", "/reactprinciples-query", or "/reactprinciples-form" to generate code that already follows the conventions — no boilerplate copy-paste.`}
            />
            <UseCaseCard
              icon="psychology"
              title="Project-aware chat context"
              description="Paste llms.txt into Claude Projects, ChatGPT custom GPTs, or Cursor rules so every conversation stays principle-aligned."
            />
            <UseCaseCard
              icon="all_inclusive"
              title="Custom AI assistants"
              description="Use llms-full.txt as RAG corpus or fine-tuning data to build a React Principles assistant for your team."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary/5 to-transparent p-10 text-center dark:border-slate-800">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-3xl">
            Ready to install?
          </h2>
          <p className="mb-6 text-base text-slate-600 dark:text-slate-400">
            One command. Works across Claude Code, Cursor, and any tool
            supporting Agent Skills.
          </p>
          <pre className="mx-auto mb-4 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm text-slate-100 dark:bg-black">
            <code>{SKILLS_INSTALL_CMD}</code>
          </pre>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={SKILLS_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              View skills repo
              <span className="material-symbols-outlined text-base">
                open_in_new
              </span>
            </Link>
            <Link
              href="/cookbook"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Browse the cookbook
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-primary">
        {eyebrow}
      </p>
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="text-base leading-7 text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function OfferingCard({
  icon,
  title,
  subtitle,
  description,
  cta,
}: {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-3 text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-500">
        {subtitle}
      </p>
      <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>
      <Link
        href={cta.href}
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {cta.label}
        <span className="material-symbols-outlined text-base">
          arrow_forward
        </span>
      </Link>
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-3 flex items-start justify-between gap-3">
        <code className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
          /{skill.name}
        </code>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
            CATEGORY_BADGE_CLASSES[skill.category],
          )}
        >
          {CATEGORY_LABELS[skill.category]}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
        {skill.description}
      </p>
    </div>
  );
}

function LlmsCard({
  title,
  size,
  href,
  description,
  useCase,
}: {
  title: string;
  size: string;
  href: string;
  description: string;
  useCase: string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {size}
        </span>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>
      <p className="mb-5 text-xs italic text-slate-500 dark:text-slate-500">
        {useCase}
      </p>
      <div className="mt-auto">
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
        >
          Open {title.toLowerCase()} version
          <span className="material-symbols-outlined text-base">
            open_in_new
          </span>
        </Link>
      </div>
    </div>
  );
}

function UseCaseCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">
          {icon}
        </span>
      </div>
      <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
