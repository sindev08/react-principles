"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { ContextMenu } from "@/ui/ContextMenu";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { ContextMenu } from "@/ui/ContextMenu";

function MyComponent() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>Right-click me</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onSelect={() => {}}>
          Back <ContextMenu.Shortcut>Alt+Left</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item onSelect={() => {}}>Forward</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
          <ContextMenu.Content>
            <ContextMenu.Item onSelect={() => {}}>Option A</ContextMenu.Item>
            <ContextMenu.Item onSelect={() => {}}>Option B</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Sub>
      </ContextMenu.Content>
    </ContextMenu>
  );
}`;

const COPY_PASTE_SNIPPET = `"use client";

import React, {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type ReactElement, type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

export interface ContextMenuProps { children: ReactNode; }

export interface ContextMenuTriggerProps { children: ReactNode; className?: string; }

export interface ContextMenuContentProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; }

export interface ContextMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; onSelect?: () => void; disabled?: boolean; inset?: boolean;
}

export interface ContextMenuCheckboxItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; checked?: boolean; defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void; disabled?: boolean;
}

export interface ContextMenuRadioGroupProps {
  value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
  children: ReactNode; className?: string;
}

export interface ContextMenuRadioItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string; children: ReactNode; disabled?: boolean;
}

export interface ContextMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> { className?: string; }

export interface ContextMenuSubProps {
  children: ReactNode; className?: string; defaultOpen?: boolean;
  open?: boolean; onOpenChange?: (open: boolean) => void;
}

export interface ContextMenuSubTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; }

export interface ContextMenuShortcutProps extends HTMLAttributes<HTMLSpanElement> { children: ReactNode; }

interface ContextMenuContextValue {
  open: boolean; setOpen: (open: boolean) => void; closeAll: () => void;
  position: React.MutableRefObject<{ x: number; y: number }>;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("ContextMenu sub-components must be used inside <ContextMenu>");
  return ctx;
}

export function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const closeAll = useCallback(() => setOpen(false), []);
  return (
    <ContextMenuContext.Provider value={{ open, setOpen, closeAll, position }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

ContextMenu.Trigger = function ContextMenuTrigger({ children, className }: ContextMenuTriggerProps) {
  const { setOpen, position } = useContextMenuContext();
  return (
    <div
      className={cn("inline-block", className)}
      onContextMenu={(e) => {
        e.preventDefault();
        position.current = { x: e.clientX, y: e.clientY };
        setOpen(true);
      }}
    >
      {children}
    </div>
  );
};

ContextMenu.Content = function ContextMenuContent({ children, className, isOpen, onClose, isSubmenu, ...props }: ContextMenuContentProps & { isOpen?: boolean; onClose?: () => void; isSubmenu?: boolean }) {
  const { position } = useContextMenuContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const x = Math.min(position.current.x, vw - rect.width - 8);
      const y = Math.min(position.current.y, vh - rect.height - 8);
      contentRef.current.style.left = \`\${Math.max(x, 4)}px\`;
      contentRef.current.style.top = \`\${Math.max(y, 4)}px\`;
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (contentRef.current?.contains(e.target as Node)) return;
      onClose?.();
    };
    const timer = setTimeout(() => document.addEventListener("pointerdown", handlePointerDown), 0);
    return () => { clearTimeout(timer); document.removeEventListener("pointerdown", handlePointerDown); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef} role="menu" aria-orientation="vertical"
      className={cn(
        "z-50 min-w-[200px] p-1 fixed",
        "bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937]",
        "rounded-lg shadow-lg", isSubmenu ? "left-full top-0 ml-1" : "", className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

ContextMenu.Item = function ContextMenuItem({ children, onSelect, disabled, className, onClick, ...props }: ContextMenuItemProps) {
  const { closeAll } = useContextMenuContext();
  return (
    <button type="button" role="menuitem" disabled={disabled}
      onClick={(e) => { onClick?.(e); if (disabled) return; onSelect?.(); closeAll(); }}
      className={cn(
        "relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-default",
        "text-slate-700 dark:text-slate-300 focus:bg-slate-100 focus:text-slate-900 dark:focus:bg-[#1f2937] dark:focus:text-white",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

ContextMenu.Separator = function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-slate-200 dark:bg-[#1f2937]", className)} role="separator" aria-orientation="horizontal" {...props} />
  );
};

ContextMenu.Shortcut = function ContextMenuShortcut({ children, className, ...props }: ContextMenuShortcutProps) {
  return <span className={cn("ml-auto text-xs tracking-widest text-slate-500 dark:text-slate-400", className)} {...props}>{children}</span>;
};`;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ContextMenuDocsPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Overlay</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Context Menu</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">ContextMenu</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A menu that appears on right-click over a target area. Supports nested submenus,
            checkbox and radio items, keyboard navigation, and shortcut hints.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-[#1f2937] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">Accessible</span>
            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-[#1f2937] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-[#1f2937] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">Keyboard Nav</span>
          </div>
        </div>

        <section className="mb-16">
          <CliInstallBlock name="context-menu" />
        </section>

        {/* Features */}
        <section id="features" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Features</h2>
          </div>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span><strong>Right-click to open:</strong> Appears at cursor position, auto-adjusts to stay in viewport</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span><strong>Nested submenus:</strong> Arbitrary depth with hover/click/keyboard support</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span><strong>Checkbox &amp; Radio items:</strong> Controlled/uncontrolled toggle state</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span><strong>Keyboard navigation:</strong> Arrow keys, Enter, Escape</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span><strong>Auto-close:</strong> Escape, item selection, or outside click</span></li>
          </ul>
        </section>

        {/* Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>

          <div className="border border-slate-200 dark:border-[#1f2937] rounded-lg p-8">
            <ContextMenu>
              <ContextMenu.Trigger className="rounded-lg border border-dashed border-slate-300 dark:border-[#1f2937] px-4 py-8 w-full text-center text-sm text-slate-500 dark:text-slate-400">
                Right-click here
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                <ContextMenu.Item onSelect={() => {}}>Back <ContextMenu.Shortcut>Alt+Left</ContextMenu.Shortcut></ContextMenu.Item>
                <ContextMenu.Item onSelect={() => {}}>Forward <ContextMenu.Shortcut>Alt+Right</ContextMenu.Shortcut></ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Sub>
                  <ContextMenu.SubTrigger>Open Recent</ContextMenu.SubTrigger>
                  <ContextMenu.Content>
                    <ContextMenu.Item onSelect={() => {}}>home.html</ContextMenu.Item>
                    <ContextMenu.Item onSelect={() => {}}>about.html</ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item onSelect={() => {}}>More...</ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Sub>
                <ContextMenu.Separator />
                <ContextMenu.RadioGroup defaultValue="system">
                  <ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem>
                  <ContextMenu.RadioItem value="dark">Dark</ContextMenu.RadioItem>
                  <ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
                </ContextMenu.RadioGroup>
                <ContextMenu.Separator />
                <ContextMenu.CheckboxItem defaultChecked>Auto-save</ContextMenu.CheckboxItem>
              </ContextMenu.Content>
            </ContextMenu>
          </div>
        </section>

        {/* Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="ContextMenu.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        {/* Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="ContextMenu.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>

        {/* Usage Examples */}
        <section id="examples" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Usage Examples</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">With shortcuts</h3>
              <CodeBlock
                copyText={`<ContextMenu>
  <ContextMenu.Trigger>
    <p>Right-click me</p>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => {}}>
      Back <ContextMenu.Shortcut>Alt+Left</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item onSelect={() => {}}>
      Forward <ContextMenu.Shortcut>Alt+Right</ContextMenu.Shortcut>
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu>`}
              >{`<ContextMenu>
  <ContextMenu.Trigger>
    <p>Right-click me</p>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => {}}>
      Back <ContextMenu.Shortcut>Alt+Left</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item onSelect={() => {}}>
      Forward <ContextMenu.Shortcut>Alt+Right</ContextMenu.Shortcut>
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Nested submenu</h3>
              <CodeBlock
                copyText={`<ContextMenu.Sub>
  <ContextMenu.SubTrigger>Open Recent</ContextMenu.SubTrigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => {}}>home.html</ContextMenu.Item>
    <ContextMenu.Item onSelect={() => {}}>about.html</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Sub>`}
              >{`<ContextMenu.Sub>
  <ContextMenu.SubTrigger>Open Recent</ContextMenu.SubTrigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => {}}>home.html</ContextMenu.Item>
    <ContextMenu.Item onSelect={() => {}}>about.html</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Sub>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Checkbox items</h3>
              <CodeBlock
                copyText={`<ContextMenu.CheckboxItem defaultChecked>
  Show Bookmarks Bar
</ContextMenu.CheckboxItem>`}
              >{`<ContextMenu.CheckboxItem defaultChecked>
  Show Bookmarks Bar
</ContextMenu.CheckboxItem>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Radio group</h3>
              <CodeBlock
                copyText={`<ContextMenu.RadioGroup defaultValue="system">
  <ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem>
  <ContextMenu.RadioItem value="dark">Dark</ContextMenu.RadioItem>
  <ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
</ContextMenu.RadioGroup>`}
              >{`<ContextMenu.RadioGroup defaultValue="system">
  <ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem>
  <ContextMenu.RadioItem value="dark">Dark</ContextMenu.RadioItem>
  <ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
</ContextMenu.RadioGroup>`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">06</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1f2937]">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Component</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Prop</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Default</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={1}>ContextMenu.Trigger</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">className</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Additional CSS classes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={4}>ContextMenuItem</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onSelect</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">() =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when item is selected (menu closes)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable the item</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">inset</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Add left padding</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">className</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Additional CSS classes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={4}>ContextMenuCheckboxItem</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">checked</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Controlled checked state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">defaultChecked</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Uncontrolled initial state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onCheckedChange</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">(checked: boolean) =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when state changes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable the item</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={3}>ContextMenuRadioGroup</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">value</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Controlled value</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">defaultValue</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">""</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Uncontrolled initial value</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onValueChange</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">(value: string) =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when value changes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={2}>ContextMenuRadioItem</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">value</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Unique value for this radio item</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable the item</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={3}>ContextMenuSub</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">defaultOpen</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Start with submenu open</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">open</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Controlled open state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onOpenChange</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">(open: boolean) =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when open state changes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
