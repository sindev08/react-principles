"use client";

import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Avatar } from "@/ui/Avatar";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Avatar } from "@/ui/Avatar";

<Avatar.Root size="lg">
  <Avatar.Image src="https://i.pravatar.cc/120" alt="Profile" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>`;

const COPY_PASTE_SNIPPET = `function AvatarRoot({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">{children}</span>;
}

type AvatarCompound = typeof AvatarRoot & { Root: typeof AvatarRoot };
export const Avatar = Object.assign(AvatarRoot, { Root: AvatarRoot }) as AvatarCompound;`;

export default function AvatarDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Avatar</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">User identity visual with image fallback initials.</p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Avatar.Root size="sm">
              <Avatar.Image src="https://i.pravatar.cc/40?img=15" alt="User" />
              <Avatar.Fallback>AL</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root size="md">
              <Avatar.Image src="https://i.pravatar.cc/60?img=32" alt="User" />
              <Avatar.Fallback>BR</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root size="lg">
              <Avatar.Image src="https://i.pravatar.cc/100?img=12" alt="User" />
              <Avatar.Fallback>CK</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root size="xl">
              <Avatar.Image src="https://invalid.example.com/avatar.png" alt="Fallback" />
              <Avatar.Fallback>DD</Avatar.Fallback>
            </Avatar.Root>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Avatar.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Avatar.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
