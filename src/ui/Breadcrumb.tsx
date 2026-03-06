import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

function BreadcrumbRoot({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <nav aria-label="Breadcrumb" className={cn("w-full", className)} {...props} />;
}

function BreadcrumbList({ className, ...props }: HTMLAttributes<HTMLOListElement>) {
  return <ol className={cn("flex items-center gap-1.5 text-sm", className)} {...props} />;
}

function BreadcrumbItem({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

function BreadcrumbLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("font-medium text-slate-900 dark:text-white", className)} {...props} />;
}

function BreadcrumbSeparator({ className, children = <span aria-hidden="true">/</span> }: { className?: string; children?: ReactNode }) {
  return <span className={cn("text-slate-400 dark:text-slate-500", className)}>{children}</span>;
}

type BreadcrumbCompoundComponent = typeof BreadcrumbRoot & {
  Root: typeof BreadcrumbRoot;
  List: typeof BreadcrumbList;
  Item: typeof BreadcrumbItem;
  Link: typeof BreadcrumbLink;
  Page: typeof BreadcrumbPage;
  Separator: typeof BreadcrumbSeparator;
};

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
}) as BreadcrumbCompoundComponent;

export { BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator };
