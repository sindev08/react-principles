import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar, Footer } from "@/features/landing/components";
import { cn } from "@/shared/utils/cn";
import { getSkill, getSkillsBundle, type SkillCategory } from "@/lib/skills";
import { CopyButton } from "./CopyButton";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  umbrella: "Master",
  review: "Review",
  scaffolding: "Scaffolding",
  internal: "Internal",
};

const CATEGORY_BADGE_CLASSES: Record<SkillCategory, string> = {
  umbrella: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  review: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  scaffolding:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  internal: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const bundle = await getSkillsBundle();
  return bundle.skills.map((s) => ({ name: s.name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const result = await getSkill(name);
  if (!result) return { title: "Skill not found — React Principles" };
  const { skill } = result;
  const title = `/${skill.name} — React Principles Skill`;
  return {
    title,
    description: skill.description,
    openGraph: {
      title,
      description: skill.description,
      type: "article",
      url: `${SITE_URL}/ai/skills/${skill.name}`,
    },
    twitter: { card: "summary", title, description: skill.description },
    alternates: { canonical: `${SITE_URL}/ai/skills/${skill.name}` },
  };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { name } = await params;
  const result = await getSkill(name);
  if (!result) notFound();
  const { skill, bundle } = result;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20 lg:pt-40">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/ai" className="hover:text-slate-900 dark:hover:text-white">
            AI Corpus
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-white">Skills</span>
        </nav>

        {/* Header */}
        <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium",
                CATEGORY_BADGE_CLASSES[skill.category],
              )}
            >
              {CATEGORY_LABELS[skill.category]}
            </span>
            {bundle.version && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {bundle.version}
              </span>
            )}
          </div>
          <h1 className="mb-3 font-mono text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            /{skill.name}
          </h1>
          <p className="text-base leading-7 text-slate-600 dark:text-slate-400">
            {skill.description}
          </p>
          {skill.allowedTools.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-500">Allowed tools:</span>
              {skill.allowedTools.map((tool) => (
                <code
                  key={tool}
                  className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tool}
                </code>
              ))}
            </div>
          )}
        </header>

        {/* Install */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Install
          </h2>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="select-none text-slate-400 dark:text-slate-500">$</span>
            <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-slate-800 dark:text-slate-200">
              {bundle.installCommand}
            </code>
            <CopyButton text={bundle.installCommand} label="Copy install command" />
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
            Installs all skills from{" "}
            <Link
              href={bundle.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              the repo
            </Link>
            . To copy only this skill manually, use the button below.
          </p>
        </section>

        {/* Manual copy + GitHub link */}
        <section className="mb-12 flex flex-wrap gap-3">
          <CopyButton
            text={skill.rawMarkdown}
            label="Copy SKILL.md"
            variant="labeled"
          />
          <Link
            href={`${bundle.repoUrl}/blob/main/skills/${skill.name}/SKILL.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            View on GitHub
          </Link>
        </section>

        {/* Markdown body */}
        <article
          className="skill-markdown"
          dangerouslySetInnerHTML={{ __html: skill.bodyHtml }}
        />
      </main>
      <Footer />
    </>
  );
}
