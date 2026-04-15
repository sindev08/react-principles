"use client";

import Link from "next/link";
import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { AlertDialog } from "@/ui/AlertDialog";
import { Button } from "@/ui/Button";
import type { AlertDialogVariant } from "@/ui/AlertDialog";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-alert-dialog--default";

const VARIANTS: AlertDialogVariant[] = ["destructive", "warning", "default"];

const CODE_SNIPPET = `import { AlertDialog } from "@/ui/AlertDialog";

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

const COPY_PASTE_SNIPPET = `import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useAnimatedMount } from "@/hooks/use-animated-mount";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertDialogVariant = "destructive" | "warning" | "default";

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  variant?: AlertDialogVariant;
  isLoading?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONFIRM_CLASSES: Record<AlertDialogVariant, string> = {
  destructive: "bg-red-500 hover:bg-red-600 text-white focus-visible:ring-red-400/40",
  warning: "bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-400/40",
  default: "bg-primary hover:bg-primary/90 text-white focus-visible:ring-primary/40",
};

const ICON_BG: Record<AlertDialogVariant, string> = {
  destructive: "bg-red-100 dark:bg-red-900/30 text-red-500",
  warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-500",
  default: "bg-primary/10 text-primary",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function VariantIcon({ variant }: { variant: AlertDialogVariant }) {
  if (variant === "destructive") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 5v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
        <path d="M8.485 3.495a1.75 1.75 0 0 1 3.03 0l6.28 10.875A1.75 1.75 0 0 1 16.28 17H3.72a1.75 1.75 0 0 1-1.515-2.63L8.485 3.495zM10 8v3m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AlertDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  variant = "default",
  isLoading = false,
}: AlertDialogProps) {
  const { mounted, visible } = useAnimatedMount(open, 200);

  // Scroll lock only — no Escape dismiss (by design)
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  const panel = (
    // Backdrop — clicking does NOT close (intentional)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-desc"
        className={cn(
          "relative w-full max-w-md rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] shadow-2xl shadow-black/20",
          "transition-all duration-200",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", ICON_BG[variant])}>
              <VariantIcon variant={variant} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="alert-title" className="text-base font-semibold leading-snug text-slate-900 dark:text-white">
                {title}
              </h2>
              <p id="alert-desc" className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1f2937] hover:bg-slate-50 dark:hover:bg-[#1f2937] disabled:opacity-50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-70 transition-colors focus-visible:outline-hidden focus-visible:ring-2",
              CONFIRM_CLASSES[variant]
            )}
          >
            {isLoading && <Spinner />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}`;

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

type ForcedVariant = {
  iconBg: string;
  iconColor: string;
  confirmBg: string;
};

const FORCED_VARIANTS: Record<AlertDialogVariant, ForcedVariant> = {
  destructive: { iconBg: "bg-red-100", iconColor: "text-red-500", confirmBg: "bg-red-500 text-white" },
  warning: { iconBg: "bg-amber-100", iconColor: "text-amber-500", confirmBg: "bg-amber-500 text-white" },
  default: { iconBg: "bg-[#ede9fe]", iconColor: "text-[#4628F1]", confirmBg: "bg-[#4628F1] text-white" },
};

type ForcedTheme = {
  panelBg: string;
  panelBorder: string;
  wrapBg: string;
  title: string;
  desc: string;
  cancelBg: string;
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
    cancelBg: "hover:bg-slate-50",
    cancelBorder: "border border-slate-200",
    cancelText: "text-slate-600",
  },
  dark: {
    panelBg: "bg-[#161b22]",
    panelBorder: "border border-[#1f2937]",
    wrapBg: "bg-[#0d1117]",
    title: "text-white",
    desc: "text-slate-400",
    cancelBg: "hover:bg-[#1f2937]",
    cancelBorder: "border border-[#1f2937]",
    cancelText: "text-slate-300",
  },
};

const DESTRUCTIVE_SVG = (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 5v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function ThemedAlertPreview({ theme }: { theme: "light" | "dark" }) {
  const c = FORCED[theme];
  const v = FORCED_VARIANTS.destructive;
  const dot =
    theme === "dark"
      ? "h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400"
      : "h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300";

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
              <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${v.iconBg} ${v.iconColor}`}>
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
          <div className="flex justify-end gap-3 px-6 pb-6">
            <button className={`px-4 py-2 rounded-lg text-sm font-medium ${c.cancelBorder} ${c.cancelText} ${c.cancelBg}`}>
              Keep it
            </button>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium ${v.confirmBg}`}>
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

export default function AlertDialogDocPage() {
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
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Overlay</span>
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

        {/* Callout — key difference */}
        <div className="flex gap-3 p-4 mb-12 border rounded-xl border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L1.5 13h13L8 1.5zM8 6v3.5m0 1.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Key difference from Dialog:</strong> No backdrop click dismiss, no Escape key dismiss, no × close button. Use this only for actions that require deliberate acknowledgement.
          </p>
        </div>

        <CliInstallBlock name="alert-dialog" />

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
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
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <a
            href={STORYBOOK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in mb-4 flex w-full items-center gap-3 rounded-lg border border-[#FF4785]/20 bg-[#FF4785]/5 px-4 py-3 transition-opacity hover:opacity-80"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]"></span>
            </span>
            <p className="flex-1 text-xs text-slate-500 dark:text-slate-400">Explore all variants and interactive states in Storybook.</p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-5">

            {/* Variant selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Variant</span>
              <div className="flex gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVariant(v)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeVariant === v
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

          {/* Alert dialogs for each variant */}
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
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/AlertDialog.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Bentuk lama <code>&lt;AlertDialog /&gt;</code> tetap jalan. Bentuk baru
            namespaced yang direkomendasikan adalah <code>&lt;AlertDialog /&gt;</code>.
          </p>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Versi ringkas self-contained yang bisa dipindahkan langsung ke project lain.
          </p>
          <CodeBlock filename="AlertDialog.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <code className="font-mono text-xs text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
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
