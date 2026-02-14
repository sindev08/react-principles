import type { ReactNode } from "react";
import { DocsHeader } from "./DocsHeader";
import { DocsSidebar } from "./DocsSidebar";
import { DocsToc } from "./DocsToc";
import { MobileNav } from "./MobileNav";

export interface TocItem {
  label: string;
  href: string;
}

interface DocsPageLayoutProps {
  children: ReactNode;
  tocItems?: TocItem[];
}

export function DocsPageLayout({
  children,
  tocItems = [],
}: DocsPageLayoutProps) {
  return (
    <div className="font-display bg-white dark:bg-[#0b0e14] text-slate-900 dark:text-[#e2e8f0] antialiased min-h-screen">
      <DocsHeader />
      <div className="mx-auto flex max-w-[1440px] px-6 lg:px-10">
        <DocsSidebar />
        <main className="flex-1 min-w-0 px-0 py-8 lg:px-12 lg:py-12">
          {children}
        </main>
        <DocsToc items={tocItems} />
      </div>
      <MobileNav />
    </div>
  );
}
