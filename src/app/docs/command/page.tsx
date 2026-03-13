"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Command } from "@/ui/Command";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Command } from "@/ui/Command";

<Command>
  <Command.Input placeholder="Type a command..." />
  <Command.List>
    <Command.Group>
      <Command.Label>Navigation</Command.Label>
      <Command.Item value="Go to dashboard">Go to dashboard</Command.Item>
      <Command.Item value="Open settings">Open settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command>`;

const COPY_PASTE_SNIPPET = `function CommandRoot({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-200 bg-white">{children}</div>;
}

type CommandCompound = typeof CommandRoot & { Root: typeof CommandRoot };
export const Command = Object.assign(CommandRoot, { Root: CommandRoot }) as CommandCompound;`;

export default function CommandDocPage() {
  const [lastCommand, setLastCommand] = useState("None");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Command</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">Quick-action list with search filtering for power users.</p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Command>
              <Command.Input placeholder="Type a command..." />
              <Command.List>
                <Command.Group>
                  <Command.Label>Navigation</Command.Label>
                  <Command.Item value="Go to dashboard" onClick={() => setLastCommand("Go to dashboard")}>Go to dashboard</Command.Item>
                  <Command.Item value="Open settings" onClick={() => setLastCommand("Open settings")}>Open settings</Command.Item>
                </Command.Group>
                <Command.Separator />
                <Command.Group>
                  <Command.Label>Project</Command.Label>
                  <Command.Item value="Invite member" onClick={() => setLastCommand("Invite member")}>Invite member</Command.Item>
                  <Command.Item value="Archive project" onClick={() => setLastCommand("Archive project")}>Archive project</Command.Item>
                </Command.Group>
                <Command.Empty>No commands found</Command.Empty>
              </Command.List>
            </Command>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last command: {lastCommand}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Command.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Command.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
