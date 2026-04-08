"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Dialog } from "@/ui/Dialog";
import { Button } from "@/ui/Button";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { Dialog } from "@/ui/Dialog";
import { Button } from "@/ui/Button";

// Confirm dialog
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Delete item</Button>

<Dialog open={open} onClose={() => setOpen(false)} size="sm">
  <Dialog.Header>
    <Dialog.Title>Delete item?</Dialog.Title>
    <Dialog.Description>
      This action is permanent and cannot be undone.
    </Dialog.Description>
  </Dialog.Header>
  <Dialog.Footer>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive" onClick={() => setOpen(false)}>Delete</Button>
  </Dialog.Footer>
</Dialog>

// Sizes: "sm" | "md" | "lg" | "xl"
<Dialog open={open} onClose={() => setOpen(false)} size="lg">
  ...
</Dialog>`;

const COPY_PASTE_SNIPPET = `"use client";

import { useEffect, useRef, HTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useAnimatedMount } from "@/hooks/use-animated-mount";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DialogSize = "sm" | "md" | "lg" | "xl";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  size?: DialogSize;
  children: ReactNode;
  className?: string;
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

Dialog.Header = function DialogHeader({ children, className, ...props }: DialogHeaderProps) {
  return (
    <div className={cn("px-6 pt-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

Dialog.Title = function DialogTitle({ children, className, ...props }: DialogTitleProps) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-white pr-8", className)} {...props}>
      {children}
    </h2>
  );
}

Dialog.Description = function DialogDescription({ children, className, ...props }: DialogDescriptionProps) {
  return (
    <p className={cn("mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

Dialog.Content = function DialogContent({ children, className, ...props }: DialogContentProps) {
  return (
    <div className={cn("px-6 py-2", className)} {...props}>
      {children}
    </div>
  );
}

Dialog.Footer = function DialogFooter({ children, className, ...props }: DialogFooterProps) {
  return (
    <div className={cn("px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#1f2937]", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

export function Dialog({ open, onClose, size = "md", children, className }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { mounted, visible } = useAnimatedMount(open, 200);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const panel = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full rounded-2xl bg-white dark:bg-[#161b22] shadow-2xl shadow-black/20",
          "border border-slate-200 dark:border-[#1f2937]",
          "transition-all duration-200",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          SIZE_CLASSES[size],
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close dialog"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}`;

const PROPS_ROWS = [
  { prop: "open", type: "boolean", default: "—", description: "Controls dialog visibility." },
  { prop: "onClose", type: "() => void", default: "—", description: "Called when Escape is pressed, backdrop is clicked, or the × button is clicked." },
  { prop: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Controls max-width of the dialog panel." },
  { prop: "children", type: "ReactNode", default: "—", description: "Dialog content, typically composed with sub-components." },
  { prop: "className", type: "string", default: "—", description: "Extra classes applied to the dialog panel." },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

type PreviewConfig = {
  bg: string;
  border: string;
  titleCls: string;
  descCls: string;
  dividerCls: string;
  cancelCls: string;
  confirmCls: string;
};

const FORCED: Record<"light" | "dark", PreviewConfig> = {
  light: {
    bg: "bg-white",
    border: "border-slate-200",
    titleCls: "text-slate-900",
    descCls: "text-slate-500",
    dividerCls: "border-slate-100",
    cancelCls: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    confirmCls: "bg-[#4628F1] text-white hover:bg-[#3a20d4]",
  },
  dark: {
    bg: "bg-[#161b22]",
    border: "border-[#1f2937]",
    titleCls: "text-white",
    descCls: "text-slate-400",
    dividerCls: "border-[#1f2937]",
    cancelCls: "border border-[#1f2937] text-slate-400 hover:bg-[#1f2937]",
    confirmCls: "bg-[#4628F1] text-white hover:bg-[#3a20d4]",
  },
};

function ThemedDialogPreview({ theme }: { theme: "light" | "dark" }) {
  const c = FORCED[theme];
  const dot = theme === "dark"
    ? "h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400"
    : "h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300";
  const themeLabel = theme === "dark" ? "Dark" : "Light";
  const panelWrap = theme === "dark" ? "bg-[#0d1117] p-6 rounded-xl" : "bg-slate-100 p-6 rounded-xl";

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={dot} />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{themeLabel}</span>
      </div>
      <div className={panelWrap}>
        {/* Inline static dialog panel */}
        <div className={`rounded-2xl border ${c.border} ${c.bg} shadow-2xl shadow-black/10 max-w-sm w-full mx-auto`}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4 relative">
            {/* X button placeholder */}
            <div className="absolute right-4 top-4 h-7 w-7 rounded-lg flex items-center justify-center text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={`text-base font-semibold pr-8 ${c.titleCls}`}>Delete item?</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${c.descCls}`}>
              This action is permanent and cannot be undone.
            </p>
          </div>
          {/* Footer */}
          <div className={`px-6 py-4 flex justify-end gap-3 border-t ${c.dividerCls}`}>
            <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${c.cancelCls}`}>
              Cancel
            </button>
            <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${c.confirmCls}`}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type DialogId = "confirm" | "edit" | "details";

export default function DialogDocPage() {
  const [openDialog, setOpenDialog] = useState<DialogId | null>(null);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Overlay</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Dialog</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Dialog
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A modal overlay rendered via portal. Supports Escape to close, backdrop click to dismiss,
            body scroll lock, and four sizes.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Portal", "4 Sizes", "Compound"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="dialog" />

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            Static dialog panel rendered inline — forced light and dark styling for direct comparison.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <ThemedDialogPreview theme="light" />
            <ThemedDialogPreview theme="dark" />
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Click a button to open the corresponding dialog.</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive" onClick={() => setOpenDialog("confirm")}>
                Confirm Delete
              </Button>
              <Button variant="secondary" onClick={() => setOpenDialog("edit")}>
                Edit Profile
              </Button>
              <Button variant="outline" onClick={() => setOpenDialog("details")}>
                View Details
              </Button>
            </div>
          </div>

          {/* Confirm Delete — sm */}
          <Dialog open={openDialog === "confirm"} onClose={() => setOpenDialog(null)} size="sm">
            <Dialog.Header>
              <Dialog.Title>Delete item?</Dialog.Title>
              <Dialog.Description>
                This action is permanent and cannot be undone. All associated data will be removed from our servers.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer>
              <Button variant="ghost" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => setOpenDialog(null)}>Delete</Button>
            </Dialog.Footer>
          </Dialog>

          {/* Edit Profile — md */}
          <Dialog open={openDialog === "edit"} onClose={() => setOpenDialog(null)} size="md">
            <Dialog.Header>
              <Dialog.Title>Edit Profile</Dialog.Title>
              <Dialog.Description>
                Update your display name and bio. Changes are visible to other users immediately.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Content>
              <div className="space-y-4 py-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Display name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="React developer & UI enthusiast."
                    className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>
              </div>
            </Dialog.Content>
            <Dialog.Footer>
              <Button variant="ghost" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpenDialog(null)}>Save changes</Button>
            </Dialog.Footer>
          </Dialog>

          {/* View Details — lg */}
          <Dialog open={openDialog === "details"} onClose={() => setOpenDialog(null)} size="lg">
            <Dialog.Header>
              <Dialog.Title>Package details</Dialog.Title>
              <Dialog.Description>
                Full metadata for the selected dependency.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Content>
              <div className="divide-y divide-slate-100 dark:divide-[#1f2937] py-2">
                {[
                  { label: "Name", value: "react-principles" },
                  { label: "Version", value: "1.0.0" },
                  { label: "License", value: "MIT" },
                  { label: "Author", value: "singgih" },
                  { label: "Repository", value: "github.com/singgih/react-principles" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </Dialog.Content>
            <Dialog.Footer>
              <Button variant="primary" onClick={() => setOpenDialog(null)}>Got it</Button>
            </Dialog.Footer>
          </Dialog>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Dialog.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Flat exports seperti <code>DialogHeader</code>, <code>DialogContent</code>, dan
            lainnya tetap didukung untuk migrasi bertahap.
          </p>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Versi ini sudah self-contained, termasuk helper class merge dan animated mount, jadi minim setup saat dipindahkan.
          </p>
          <CodeBlock filename="Dialog.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
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
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
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
