import type { ReactNode } from "react";
import { DocsToc } from "./DocsToc";

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
    <div className="flex w-full">
      <main className="flex-1 min-w-0 px-0 py-8 lg:px-12 lg:py-12">
        {children}
      </main>
      <DocsToc items={tocItems} />
    </div>
  );
}
