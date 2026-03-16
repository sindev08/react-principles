"use client";

import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Alert } from "@/ui/Alert";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Alert } from "@/ui/Alert";

<Alert variant="warning">
  <Alert.Title>Unsaved changes</Alert.Title>
  <Alert.Description>You have pending edits that are not published yet.</Alert.Description>
  <Alert.Footer>
    <Alert.Action>Review changes</Alert.Action>
  </Alert.Footer>
</Alert>`;

const COPY_PASTE_SNIPPET = `function AlertRoot({ children }: { children: React.ReactNode }) {
  return <div role="alert" className="rounded-xl border border-slate-200 bg-white p-4">{children}</div>;
}

type AlertCompound = typeof AlertRoot & { Root: typeof AlertRoot };
export const Alert = Object.assign(AlertRoot, { Root: AlertRoot }) as AlertCompound;`;

export default function AlertDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Alert</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">Callout banner for important contextual messages.</p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Alert>
              <Alert.Title>Information</Alert.Title>
              <Alert.Description>System maintenance window starts at 22:00.</Alert.Description>
            </Alert>
            <Alert variant="warning">
              <Alert.Title>Unsaved changes</Alert.Title>
              <Alert.Description>You have pending edits that are not published yet.</Alert.Description>
              <Alert.Footer>
                <Alert.Action>Review changes</Alert.Action>
              </Alert.Footer>
            </Alert>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Alert.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Alert.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
