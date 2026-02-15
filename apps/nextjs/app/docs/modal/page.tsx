"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/components/docs";
import { CodeBlock } from "@react-principles/shared/components";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ModalSize, ModalSide } from "@/components/ui/Modal";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Props", href: "#props" },
];

const SIZES: ModalSize[] = ["sm", "md", "lg", "full"];
const SIDES: ModalSide[] = ["right", "left"];

const CODE_SNIPPET = `import {
  Modal, ModalHeader, ModalTitle,
  ModalDescription, ModalContent, ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open drawer</Button>

<Modal open={open} onClose={() => setOpen(false)} size="md" side="right">
  <ModalHeader>
    <ModalTitle>Notification settings</ModalTitle>
    <ModalDescription>
      Manage how you receive updates.
    </ModalDescription>
  </ModalHeader>
  <ModalContent>
    {/* scrollable body */}
  </ModalContent>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
  </ModalFooter>
</Modal>

// Sizes: "sm" | "md" | "lg" | "full"
// Sides: "right" | "left"`;

const PROPS_ROWS = [
  { prop: "open", type: "boolean", default: "—", description: "Controls drawer visibility." },
  { prop: "onClose", type: "() => void", default: "—", description: "Called on Escape, backdrop click, or × button." },
  { prop: "side", type: '"right" | "left"', default: '"right"', description: "Edge the drawer slides in from." },
  { prop: "size", type: '"sm" | "md" | "lg" | "full"', default: '"md"', description: "Controls width of the drawer panel." },
  { prop: "children", type: "ReactNode", default: "—", description: "Drawer content, typically composed with sub-components." },
  { prop: "className", type: "string", default: "—", description: "Extra classes applied to the drawer panel." },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

type ForcedTheme = {
  panelBg: string;
  panelBorder: string;
  wrapBg: string;
  titleCls: string;
  descCls: string;
  divider: string;
  itemBg: string;
  itemBorder: string;
  itemLabel: string;
  itemMeta: string;
  cancelCls: string;
  saveCls: string;
};

const FORCED: Record<"light" | "dark", ForcedTheme> = {
  light: {
    panelBg: "bg-white",
    panelBorder: "border-l border-slate-200",
    wrapBg: "bg-slate-100",
    titleCls: "text-slate-900",
    descCls: "text-slate-500",
    divider: "border-slate-100",
    itemBg: "bg-slate-50",
    itemBorder: "border border-slate-200",
    itemLabel: "text-slate-700",
    itemMeta: "text-slate-400",
    cancelCls: "border border-slate-200 text-slate-600",
    saveCls: "bg-[#4628F1] text-white",
  },
  dark: {
    panelBg: "bg-[#161b22]",
    panelBorder: "border-l border-[#1f2937]",
    wrapBg: "bg-[#0d1117]",
    titleCls: "text-white",
    descCls: "text-slate-400",
    divider: "border-[#1f2937]",
    itemBg: "bg-[#0d1117]",
    itemBorder: "border border-[#1f2937]",
    itemLabel: "text-slate-300",
    itemMeta: "text-slate-500",
    cancelCls: "border border-[#1f2937] text-slate-400",
    saveCls: "bg-[#4628F1] text-white",
  },
};

const PREVIEW_ITEMS = [
  { label: "Email notifications", meta: "you@example.com", badge: "Active" },
  { label: "Push notifications", meta: "Mobile & Desktop", badge: "Active" },
  { label: "Weekly digest", meta: "Every Monday 9am", badge: "Off" },
];

function ThemedModalPreview({ theme }: { theme: "light" | "dark" }) {
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
      <div className={`${c.wrapBg} rounded-xl overflow-hidden`}>
        {/* Drawer panel mockup */}
        <div className={`${c.panelBg} ${c.panelBorder} w-full flex flex-col`}>
          {/* Header */}
          <div className={`px-5 pt-5 pb-4 border-b ${c.divider} relative`}>
            <div className="absolute right-4 top-4 h-7 w-7 rounded-lg flex items-center justify-center text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={`text-base font-semibold pr-8 ${c.titleCls}`}>Notification settings</h3>
            <p className={`mt-1 text-xs leading-relaxed ${c.descCls}`}>Manage how you receive updates.</p>
          </div>
          {/* Content */}
          <div className="px-5 py-4 space-y-2">
            {PREVIEW_ITEMS.map((item) => (
              <div key={item.label} className={`rounded-lg px-3 py-2.5 flex items-center justify-between ${c.itemBg} ${c.itemBorder}`}>
                <div>
                  <p className={`text-xs font-medium ${c.itemLabel}`}>{item.label}</p>
                  <p className={`text-[10px] ${c.itemMeta}`}>{item.meta}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.badge === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-500"
                }`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className={`px-5 py-4 border-t ${c.divider} flex justify-end gap-2`}>
            <button className={`px-3 py-1.5 text-xs font-medium rounded-lg ${c.cancelCls}`}>Cancel</button>
            <button className={`px-3 py-1.5 text-xs font-medium rounded-lg ${c.saveCls}`}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const NOTIFICATION_ITEMS = [
  { id: "email", label: "Email notifications", meta: "you@example.com", active: true },
  { id: "push", label: "Push notifications", meta: "Mobile & Desktop", active: true },
  { id: "sms", label: "SMS alerts", meta: "+1 (555) 000-0000", active: false },
  { id: "digest", label: "Weekly digest", meta: "Every Monday 9am", active: false },
  { id: "security", label: "Security alerts", meta: "Login & password changes", active: true },
];

const FILTER_ITEMS = [
  { id: "bugs", label: "Bug reports", count: 12 },
  { id: "features", label: "Feature requests", count: 8 },
  { id: "improvements", label: "Improvements", count: 5 },
  { id: "docs", label: "Documentation", count: 3 },
  { id: "design", label: "Design", count: 7 },
];

type ModalId = "notifications" | "filters" | "user";

export default function ModalDocPage() {
  const [openModal, setOpenModal] = useState<ModalId | null>(null);
  const [activeSize, setActiveSize] = useState<ModalSize>("md");
  const [activeSide, setActiveSide] = useState<ModalSide>("right");
  const [activeItems, setActiveItems] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_ITEMS.map((i) => [i.id, i.active]))
  );
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set(["bugs", "features"])
  );

  const toggleFilter = (id: string) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
          <span className="text-slate-900 dark:text-white">Modal</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Modal
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A side drawer rendered via portal. Slides in from the left or right edge.
            Supports scrollable content, Escape to close, and four width sizes.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Portal", "4 Sizes", "Left / Right", "Scrollable"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
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
            Drawer panel rendered inline — forced light and dark styling for direct comparison.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <ThemedModalPreview theme="light" />
            <ThemedModalPreview theme="dark" />
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

            {/* Controls */}
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Size</span>
                <div className="flex gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSize(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeSize === s
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Side</span>
                <div className="flex gap-2">
                  {SIDES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSide(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeSide === s
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">Click a button to open a drawer.</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => setOpenModal("notifications")}>
                Notifications
              </Button>
              <Button variant="secondary" onClick={() => setOpenModal("filters")}>
                Filters
              </Button>
              <Button variant="outline" onClick={() => setOpenModal("user")}>
                User profile
              </Button>
            </div>
          </div>

          {/* Notifications drawer */}
          <Modal open={openModal === "notifications"} onClose={() => setOpenModal(null)} size={activeSize} side={activeSide}>
            <ModalHeader>
              <ModalTitle>Notification settings</ModalTitle>
              <ModalDescription>Choose how and when you receive updates.</ModalDescription>
            </ModalHeader>
            <ModalContent>
              <div className="space-y-3">
                {NOTIFICATION_ITEMS.map((item) => (
                  <label key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#1f2937] hover:bg-slate-50 dark:hover:bg-[#1f2937] cursor-pointer transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.meta}</p>
                    </div>
                    <div
                      onClick={() => setActiveItems((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        activeItems[item.id] ? "bg-primary" : "bg-slate-200 dark:bg-[#1f2937]"
                      }`}
                    >
                      <span className={`pointer-events-none h-4 w-4 rounded-full bg-white shadow transition-transform ${activeItems[item.id] ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </label>
                ))}
              </div>
            </ModalContent>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpenModal(null)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpenModal(null)}>Save changes</Button>
            </ModalFooter>
          </Modal>

          {/* Filters drawer */}
          <Modal open={openModal === "filters"} onClose={() => setOpenModal(null)} size={activeSize} side={activeSide}>
            <ModalHeader>
              <ModalTitle>Filter issues</ModalTitle>
              <ModalDescription>Select categories to include in your view.</ModalDescription>
            </ModalHeader>
            <ModalContent>
              <div className="space-y-2">
                {FILTER_ITEMS.map((item) => {
                  const active = selectedFilters.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleFilter(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-slate-100 dark:border-[#1f2937] hover:bg-slate-50 dark:hover:bg-[#1f2937]"
                      }`}
                    >
                      <span className={`text-sm font-medium ${active ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>
                        {item.label}
                      </span>
                      <Badge variant={active ? "info" : "default"} size="sm">{item.count}</Badge>
                    </button>
                  );
                })}
              </div>
            </ModalContent>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setSelectedFilters(new Set())}>Clear all</Button>
              <Button variant="primary" onClick={() => setOpenModal(null)}>
                Apply ({selectedFilters.size})
              </Button>
            </ModalFooter>
          </Modal>

          {/* User profile drawer */}
          <Modal open={openModal === "user"} onClose={() => setOpenModal(null)} size={activeSize} side={activeSide}>
            <ModalHeader>
              <ModalTitle>User profile</ModalTitle>
              <ModalDescription>View and manage account details.</ModalDescription>
            </ModalHeader>
            <ModalContent>
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">John Doe</p>
                    <p className="text-sm text-slate-500">you@example.com</p>
                  </div>
                </div>
                {/* Details */}
                <div className="divide-y divide-slate-100 dark:divide-[#1f2937]">
                  {[
                    { label: "Role", value: "Admin" },
                    { label: "Team", value: "Engineering" },
                    { label: "Location", value: "San Francisco, CA" },
                    { label: "Joined", value: "Jan 12, 2023" },
                    { label: "Last active", value: "2 hours ago" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5">
                      <span className="text-sm text-slate-500">{label}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpenModal(null)}>Close</Button>
              <Button variant="primary" onClick={() => setOpenModal(null)}>Edit profile</Button>
            </ModalFooter>
          </Modal>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="components/ui/Modal.tsx" copyText={CODE_SNIPPET}>
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
