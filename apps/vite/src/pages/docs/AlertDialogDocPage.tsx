import { useState } from "react";
import { DocsPageLayout } from "@/components/docs";
import { CodeBlock } from "@react-principles/shared/components";
import { AlertDialog, Button } from "@react-principles/shared/ui";
import type { AlertDialogVariant } from "@react-principles/shared/ui";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Props", href: "#props" },
];

const VARIANTS: AlertDialogVariant[] = ["destructive", "warning", "default"];

const CODE_SNIPPET = `import { AlertDialog } from "@/components/ui/AlertDialog";

const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);

const handleConfirm = async () => {
  setLoading(true);
  await deleteItem();
  setLoading(false);
  setOpen(false);
};

<Button variant="destructive" onClick={() => setOpen(true)}>
  Delete project
</Button>

<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
  title="Delete project?"
  description="This will permanently delete your project and all associated data. This action cannot be undone."
  confirmLabel="Delete project"
  cancelLabel="Keep it"
  variant="destructive"
  isLoading={loading}
/>

// Variants: "destructive" | "warning" | "default"`;

const PROPS_ROWS = [
  { prop: "open", type: "boolean", default: "—", description: "Controls visibility." },
  { prop: "onClose", type: "() => void", default: "—", description: "Called when Cancel is clicked. Backdrop and Escape do NOT trigger this." },
  { prop: "onConfirm", type: "() => void", default: "—", description: "Called when the confirm button is clicked." },
  { prop: "title", type: "string", default: "—", description: "Bold heading inside the dialog." },
  { prop: "description", type: "string", default: "—", description: "Muted supporting text below the title." },
  { prop: "cancelLabel", type: "string", default: '"Cancel"', description: "Label for the cancel button." },
  { prop: "confirmLabel", type: "string", default: '"Confirm"', description: "Label for the confirm button." },
  { prop: "variant", type: '"destructive" | "warning" | "default"', default: '"default"', description: "Controls icon, icon background, and confirm button colour." },
  { prop: "isLoading", type: "boolean", default: "false", description: "Shows a spinner and disables both buttons during async operations." },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

type ForcedTheme = {
  panelBg: string;
  panelBorder: string;
  wrapBg: string;
  title: string;
  desc: string;
  cancelBorder: string;
  cancelText: string;
};

const FORCED: Record<"light" | "dark", ForcedTheme> = {
  light: {
    panelBg: "bg-white",
    panelBorder: "border border-slate-200",
    wrapBg: "bg-slate-100",
    title: "text-slate-900",
    desc: "text-slate-500",
    cancelBorder: "border border-slate-200",
    cancelText: "text-slate-600",
  },
  dark: {
    panelBg: "bg-[#161b22]",
    panelBorder: "border border-[#1f2937]",
    wrapBg: "bg-[#0d1117]",
    title: "text-white",
    desc: "text-slate-400",
    cancelBorder: "border border-[#1f2937]",
    cancelText: "text-slate-300",
  },
};

const DESTRUCTIVE_SVG = (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 5v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function ThemedAlertPreview({ theme }: { theme: "light" | "dark" }) {
  const c = FORCED[theme];
  const dot =
    theme === "dark"
      ? "h-3 w-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-400"
      : "h-3 w-3 rounded-full bg-amber-400 shadow-sm shadow-amber-300";

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={dot} />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {theme === "dark" ? "Dark" : "Light"}
        </span>
      </div>
      <div className={`${c.wrapBg} rounded-xl p-6`}>
        <div className={`${c.panelBg} ${c.panelBorder} rounded-2xl shadow-lg`}>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                {DESTRUCTIVE_SVG}
              </div>
              <div>
                <h3 className={`text-base font-semibold ${c.title}`}>Delete project?</h3>
                <p className={`mt-1.5 text-sm leading-relaxed ${c.desc}`}>
                  This will permanently delete your project and all associated data.
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6 flex justify-end gap-3">
            <button className={`px-4 py-2 rounded-lg text-sm font-medium ${c.cancelBorder} ${c.cancelText}`}>
              Keep it
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white">
              Delete project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Demo configs ─────────────────────────────────────────────────────────────

const DEMO_CONFIGS: Record<AlertDialogVariant, {
  buttonLabel: string;
  buttonVariant: "destructive" | "secondary" | "outline";
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
}> = {
  destructive: {
    buttonLabel: "Delete account",
    buttonVariant: "destructive",
    title: "Delete account?",
    description: "Your account and all associated data will be permanently removed. This cannot be undone.",
    confirmLabel: "Yes, delete account",
    cancelLabel: "Keep my account",
  },
  warning: {
    buttonLabel: "Revoke access",
    buttonVariant: "secondary",
    title: "Revoke API access?",
    description: "Revoking access will immediately invalidate all tokens. Any integrations using this key will stop working.",
    confirmLabel: "Revoke access",
    cancelLabel: "Cancel",
  },
  default: {
    buttonLabel: "Publish changes",
    buttonVariant: "outline",
    title: "Publish changes?",
    description: "Your changes will be visible to all users immediately. Make sure everything looks correct before continuing.",
    confirmLabel: "Publish",
    cancelLabel: "Review again",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AlertDialogDocPage() {
  const [openVariant, setOpenVariant] = useState<AlertDialogVariant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVariant, setActiveVariant] = useState<AlertDialogVariant>("destructive");

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpenVariant(null);
    }, 1800);
  };

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Overlay</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Alert Dialog</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Alert Dialog
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A blocking confirmation dialog. Unlike Dialog, it cannot be dismissed by clicking
            the backdrop or pressing Escape — the user must explicitly choose an action.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Portal", "3 Variants", "Loading State", "Blocking"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Callout */}
        <div className="mb-12 flex gap-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 p-4">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L1.5 13h13L8 1.5zM8 6v3.5m0 1.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Key difference from Dialog:</strong> No backdrop click dismiss, no Escape key dismiss, no × close button. Use this only for actions that require deliberate acknowledgement.
          </p>
        </div>

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            Destructive variant — forced light and dark styling for direct comparison.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <ThemedAlertPreview theme="light" />
            <ThemedAlertPreview theme="dark" />
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-sm space-y-5">

            {/* Variant selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Variant</span>
              <div className="flex gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVariant(v)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeVariant === v
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click the button to open the alert dialog. Notice the backdrop click and Escape key do not dismiss it.
            </p>

            <Button
              variant={DEMO_CONFIGS[activeVariant].buttonVariant}
              onClick={() => setOpenVariant(activeVariant)}
            >
              {DEMO_CONFIGS[activeVariant].buttonLabel}
            </Button>
          </div>

          {VARIANTS.map((v) => (
            <AlertDialog
              key={v}
              open={openVariant === v}
              onClose={() => { if (!isLoading) setOpenVariant(null); }}
              onConfirm={handleConfirm}
              title={DEMO_CONFIGS[v].title}
              description={DEMO_CONFIGS[v].description}
              confirmLabel={DEMO_CONFIGS[v].confirmLabel}
              cancelLabel={DEMO_CONFIGS[v].cancelLabel}
              variant={v}
              isLoading={isLoading}
            />
          ))}
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="components/ui/AlertDialog.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400 break-words">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
