"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { NavigationMenu } from "@/ui/NavigationMenu";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { NavigationMenu } from "@/ui/NavigationMenu";

function MyComponent() {
  return (
    <NavigationMenu>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/products/electronics">Electronics</NavigationMenu.Link>
            <NavigationMenu.Link href="/products/clothing">Clothing</NavigationMenu.Link>
            <NavigationMenu.Link href="/products/books">Books</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Solutions</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/solutions/marketing">Marketing</NavigationMenu.Link>
            <NavigationMenu.Link href="/solutions/analytics">Analytics</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  );
}

// With Next.js Link (asChild pattern)
<NavigationMenu.Item>
  <NavigationMenu.Trigger asChild>
    <Link href="/products">Products</Link>
  </NavigationMenu.Trigger>
  <NavigationMenu.Content>
    <NavigationMenu.Link href="/products/electronics">Electronics</NavigationMenu.Link>
  </NavigationMenu.Content>
</NavigationMenu.Item>`;

const COPY_PASTE_SNIPPET = `"use client";

import { createContext, useContext, useEffect, useState, type ReactElement, type ReactNode, cloneElement } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavigationMenuProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationMenuListProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationMenuItemProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationMenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface NavigationMenuContentProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationMenuLinkProps {
  href?: string;
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

// ─── Context ────────────────────────────────────────────────────────────────────

interface NavigationMenuContextValue {
  open: string | null;
  setOpen: (value: string | null) => void;
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenuContext() {
  const context = useContext(NavigationMenuContext);
  if (!context) {
    throw new Error("NavigationMenu sub-components must be used inside <NavigationMenu>");
  }
  return context;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NavigationMenu({ children, className }: NavigationMenuProps) {
  const [open, setOpen] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menu = target.closest("[data-navigation-menu]");
      if (!menu && open) setOpen(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Assign indices to items
  let itemIndex = 0;
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (child.type === NavigationMenu.Item) {
      const index = itemIndex++;
      return cloneElement(child, {
        index,
        value: \`item-\${index}\`,
      } as any);
    }

    return child;
  });

  return (
    <NavigationMenuContext.Provider value={{ open, setOpen }}>
      <nav className={className} data-navigation-menu>
        {childrenWithProps}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

// ─── List Sub-Component ───────────────────────────────────────────────────────

NavigationMenu.List = function NavigationMenuList({ children, className }: NavigationMenuListProps) {
  return (
    <ul className={cn("flex items-center gap-1", className)} role="menubar">
      {children}
    </ul>
  );
};

// ─── Item Sub-Component ───────────────────────────────────────────────────────

NavigationMenu.Item = function NavigationMenuItem({
  children,
  className,
  index,
  value,
}: NavigationMenuItemProps & { index?: number; value?: string }) {
  const { open, setOpen } = useNavigationMenuContext();
  const isOpen = open === value;
  const hasContent = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === NavigationMenu.Content
  );

  return (
    <li className={cn("relative", className)} role="none">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === NavigationMenu.Trigger) {
          return cloneElement(child, {
            isOpen,
            onToggle: () => setOpen(isOpen ? null : value),
            hasContent,
          } as any);
        }

        if (child.type === NavigationMenu.Content) {
          return cloneElement(child, {
            isOpen,
            onClose: () => setOpen(null),
          } as any);
        }

        return child;
      })}
    </li>
  );
};

// ─── Trigger Sub-Component ─────────────────────────────────────────────────────

NavigationMenu.Trigger = function NavigationMenuTrigger({
  asChild = false,
  children,
  className,
  isOpen,
  onToggle,
  hasContent,
}: NavigationMenuTriggerProps & {
  isOpen?: boolean;
  onToggle?: () => void;
  hasContent?: boolean;
}) {
  // Handle hover for desktop
  const handleMouseEnter = () => {
    if (hasContent && onToggle) {
      onToggle();
    }
  };

  // Handle click for touch/mobile
  const handleClick = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const triggerClassName = cn(
    "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium",
    "transition-colors",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
    "cursor-pointer",
    isOpen
      ? "bg-slate-100 dark:bg-[#1f2937] text-slate-900 dark:text-white"
      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]",
    className
  );

  if (asChild && React.isValidElement(children)) {
    return cloneElement(children as ReactElement<any>, {
      onMouseEnter: handleMouseEnter,
      onClick: handleClick,
      className: cn(triggerClassName, (children as ReactElement<any>).props.className),
      'aria-expanded': isOpen,
      'aria-haspopup': hasContent,
    } as any);
  }

  return (
    <button
      type="button"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={triggerClassName}
      aria-expanded={isOpen}
      aria-haspopup={hasContent}
    >
      {children}
      {/* Chevron indicator */}
      {hasContent && (
        <svg
          className={cn(
            "ml-2 h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

// ─── Content Sub-Component ───────────────────────────────────────────────────

NavigationMenu.Content = function NavigationMenuContent({
  children,
  className,
  isOpen,
  onClose,
}: NavigationMenuContentProps & {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 mt-2 min-w-[200px] p-2",
        "bg-white dark:bg-[#161b22]",
        "border border-slate-200 dark:border-[#1f2937]",
        "rounded-lg shadow-lg",
        "z-50",
        className
      )}
      onMouseLeave={onClose}
    >
      {children}
    </div>
  );
};

// ─── Link Sub-Component ────────────────────────────────────────────────────────

NavigationMenu.Link = function NavigationMenuLink({
  href,
  asChild = false,
  children,
  className,
}: NavigationMenuLinkProps) {
  const linkClassName = cn(
    "block rounded-sm px-4 py-2 text-sm font-medium",
    "text-slate-700 dark:text-slate-300",
    "hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-900 dark:hover:text-white",
    "transition-colors",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
    className
  );

  if (asChild && React.isValidElement(children)) {
    return cloneElement(children as ReactElement<any>, {
      className: cn(linkClassName, (children as ReactElement<any>).props.className),
    } as any);
  }

  return (
    <a href={href} className={linkClassName}>
      {children}
    </a>
  );
};
`;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function NavigationMenuDocsPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">NavigationMenu</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            NavigationMenu
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Horizontal navigation bar with dropdown/flyout panels for site-level navigation. Supports
            hover and click interactions with keyboard navigation.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Keyboard Nav", "Dropdown Panels", "Compound Component"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CliInstallBlock */}
        <section className="mb-16">
          <CliInstallBlock name="navigation-menu" />
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
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Hover & Click:</strong> Opens flyout panel on hover (desktop) or click (mobile)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Single Panel:</strong> Only one dropdown panel open at a time
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Keyboard Navigation:</strong> Escape to close, Tab to navigate
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Next.js Link Support:</strong> Compose with Next.js Link via asChild prop
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Compound Components:</strong> List, Item, Trigger, Content, Link
              </span>
            </li>
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
            <NavigationMenu>
              <NavigationMenu.List>
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                      Electronics
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                      Clothing
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                      Books
                    </a>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                  <NavigationMenu.Trigger>Solutions</NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                      Marketing
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                      Analytics
                    </a>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                  <NavigationMenu.Link href="/documentation">Documentation</NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu>
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
          <CodeBlock filename="NavigationMenu.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="NavigationMenu.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
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
            {/* Basic dropdown menu */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Basic dropdown menu
              </h3>
              <CodeBlock
                copyText={`<NavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/products/electronics">Electronics</NavigationMenu.Link>
        <NavigationMenu.Link href="/products/clothing">Clothing</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu>`}
              >{`<NavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/products/electronics">Electronics</NavigationMenu.Link>
        <NavigationMenu.Link href="/products/clothing">Clothing</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu>`}</CodeBlock>
            </div>

            {/* With Next.js Link using asChild */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                With Next.js Link (asChild pattern)
              </h3>
              <CodeBlock
                copyText={`<NavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger asChild>
        <Link href="/products">Products</Link>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/products/electronics">Electronics</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu>`}
              >{`<NavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger asChild>
        <Link href="/products">Products</Link>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/products/electronics">Electronics</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu>`}</CodeBlock>
            </div>

            {/* Single level navigation */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Single level navigation (no dropdowns)
              </h3>
              <CodeBlock
                copyText={`<NavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu>`}
              >{`<NavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu>`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Props Table */}
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
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Component
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Prop
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Default
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={2}>
                    NavigationMenu.Trigger
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    asChild
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Merge props with child element (e.g., Next.js Link)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    className
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Additional CSS classes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={2}>
                    NavigationMenu.Link
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    href
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Link href attribute
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    asChild
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Merge props with child element (e.g., Next.js Link)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
