import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/features/landing/components";
import { cn } from "@/shared/utils/cn";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";
const SKILLS_REPO_URL = "https://github.com/sindev08/react-principles-skills";
const SKILLS_INSTALL_CMD = "npx skills add sindev08/react-principles-skills";
const INIT_CMD = "npx react-principles init";
const CREATE_CMD = "npx react-principles create my-app";
// MCP clients POST directly and may not follow the apex→www 307 redirect,
// so advertise the canonical www host explicitly for the endpoint.
const MCP_ENDPOINT = "https://www.reactprinciples.dev/api/mcp";
const MCP_INSTALL_CMD = `claude mcp add --transport http reactprinciples ${MCP_ENDPOINT}`;
const MCP_JSON_CONFIG = `{
  "mcpServers": {
    "reactprinciples": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`;

export const metadata: Metadata = {
  title: "AI Corpus — React Principles",
  description:
    "Make your AI tools React Principles-aware. Remote MCP server, drop-in context for Claude, Cursor, Copilot, and GPT — plus invocable skills for code review and scaffolding.",
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
            One command.{" "}
            <span className="text-primary">Your AI already knows the rules.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Run <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">{INIT_CMD}</code> and
            your project is wired into React Principles: your AI follows the
            patterns, looks up recipes, and pulls components on its own. No
            copy-paste, no keeping docs in sync.
          </p>
        </section>

        {/* Quick start — the one-command path */}
        <section className="mb-20">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                New
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                One-command setup
              </span>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-primary">
                  Existing project
                </p>
                <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Make it React Principles–aware in one step.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100 dark:bg-black">
                  <code>{INIT_CMD}</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-primary">
                  New project
                </p>
                <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Scaffold a starter that ships wired-in from the first commit.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100 dark:bg-black">
                  <code>{CREATE_CMD}</code>
                </pre>
              </div>
            </div>

            <div className="mt-8 border-t border-primary/15 pt-6">
              <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                Both wire up everything below — automatically:
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <SetupItem
                  icon="description"
                  title="AGENTS.md"
                  description="The principles, so any AI assistant follows them."
                />
                <SetupItem
                  icon="hub"
                  title=".mcp.json"
                  description="The MCP server — live recipe and component lookup."
                />
                <SetupItem
                  icon="terminal"
                  title="Skills"
                  description="Invocable review and scaffolding commands."
                />
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  autorenew
                </span>
                Always current — recipe updates reach your tools automatically,
                no re-sync.
              </p>
            </div>
          </div>
        </section>

        {/* Offerings — what init wires up, or set up piece by piece */}
        <section className="mb-10">
          <SectionHeader
            eyebrow="Under the hood"
            title="Prefer to wire it up yourself?"
            description="init and create configure all of this for you. Here's each piece — connect them manually, or go deeper on how they work."
          />
        </section>

        <section className="mb-20 grid gap-6 md:grid-cols-3">
          <OfferingCard
            icon="hub"
            title="MCP Server"
            subtitle="Live connection"
            description="Add the remote MCP server once — your AI looks up recipes by itself in any conversation. Always current, token-efficient."
            cta={{ label: "Connect below", href: "#mcp" }}
          />
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

        {/* MCP */}
        <section id="mcp" className="mb-20 scroll-mt-24">
          <SectionHeader
            eyebrow="MCP Server"
            title="Live connection to the cookbook and UI Kit"
            description="A remote Model Context Protocol server serving both the cookbook and the UI Kit. Connect once and your AI can look up recipes and pull component source on demand — no copy-paste, always in sync with the published site."
          />

          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Claude Code — one command:
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100 dark:bg-black">
              <code>{MCP_INSTALL_CMD}</code>
            </pre>
            <p className="mt-6 mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Cursor, Claude Desktop, and other MCP clients — add to your MCP
              config:
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100 dark:bg-black">
              <code>{MCP_JSON_CONFIG}</code>
            </pre>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <McpToolCard
              name="list_recipes"
              description="All published recipes with slugs, categories, and descriptions."
            />
            <McpToolCard
              name="search_recipes"
              description="Ranked keyword search across titles, rules, and principles."
            />
            <McpToolCard
              name="get_recipe"
              description="Full recipe as markdown — principle, rules, pattern, implementations."
            />
            <McpToolCard
              isNew
              name="list_components"
              description="All UI Kit components with target dir, description, and dependencies."
            />
            <McpToolCard
              isNew
              name="search_components"
              description="Ranked keyword search across component names and descriptions."
            />
            <McpToolCard
              isNew
              name="get_component"
              description="Full component source (matches the CLI), install command, and deps."
            />
          </div>
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
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary/5 to-transparent p-6 text-center sm:p-10 dark:border-slate-800">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-3xl">
            Ready to install?
          </h2>
          <p className="mb-6 text-base text-slate-600 dark:text-slate-400">
            One command. Works across Claude Code, Cursor, and any tool
            supporting Agent Skills.
          </p>
          <pre className="mb-4 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-left text-xs text-slate-100 sm:px-5 sm:text-center sm:text-sm dark:bg-black">
            <code>{SKILLS_INSTALL_CMD}</code>
          </pre>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href={SKILLS_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              View skills repo
              <span className="material-symbols-outlined text-base">
                open_in_new
              </span>
            </Link>
            <Link
              href="/cookbook"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
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

function SetupItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <span className="material-symbols-outlined text-[18px] text-primary">
          {icon}
        </span>
      </span>
      <div>
        <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
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
    <Link
      href={`/ai/skills/${skill.name}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-primary/40 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-primary/40 dark:hover:bg-slate-900"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <code className="font-mono text-sm font-semibold text-slate-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary">
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
    </Link>
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

function McpToolCard({
  name,
  description,
  isNew = false,
}: {
  name: string;
  description: string;
  isNew?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-2 flex items-center justify-between gap-2">
        <code className="block font-mono text-sm font-semibold text-slate-900 dark:text-white">
          {name}
        </code>
        {isNew && (
          <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-primary">
            New
          </span>
        )}
      </div>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>
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
