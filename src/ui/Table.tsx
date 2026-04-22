import {
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
  children?: ReactNode;
}

// ─── Table ───────────────────────────────────────────────────────────────────

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]",
        className,
      )}
      {...props}
    >
      <table className="w-full caption-top text-left text-sm">
        {children}
      </table>
    </div>
  );
}

// ─── Table.Header ─────────────────────────────────────────────────────────────

Table.Header = function TableHeader({
  className,
  children,
  ...props
}: TableHeaderProps) {
  return (
    <thead
      className={cn(
        "border-b border-slate-200 bg-slate-50 dark:border-[#1f2937] dark:bg-[#161b22]",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

// ─── Table.Body ───────────────────────────────────────────────────────────────

Table.Body = function TableBody({
  className,
  children,
  ...props
}: TableBodyProps) {
  return (
    <tbody
      className={cn(
        "divide-y divide-slate-100 dark:divide-[#1f2937]",
        className,
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};

// ─── Table.Footer ─────────────────────────────────────────────────────────────

Table.Footer = function TableFooter({
  className,
  children,
  ...props
}: TableFooterProps) {
  return (
    <tfoot
      className={cn(
        "border-t border-slate-200 bg-slate-50 font-medium dark:border-[#1f2937] dark:bg-[#161b22] dark:text-slate-300",
        className,
      )}
      {...props}
    >
      {children}
    </tfoot>
  );
};

// ─── Table.Row ────────────────────────────────────────────────────────────────

Table.Row = function TableRow({
  className,
  children,
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors border-b border-transparent last:border-b-0",
        "hover:bg-slate-50 dark:hover:bg-slate-800/50",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

// ─── Table.Head ───────────────────────────────────────────────────────────────

Table.Head = function TableHead({
  className,
  children,
  ...props
}: TableHeadProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
};

// ─── Table.Cell ───────────────────────────────────────────────────────────────

Table.Cell = function TableCell({
  className,
  children,
  ...props
}: TableCellProps) {
  return (
    <td
      className={cn(
        "px-4 py-3",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
};

// ─── Table.Caption ───────────────────────────────────────────────────────────

Table.Caption = function TableCaption({
  className,
  children,
  ...props
}: TableCaptionProps) {
  return (
    <caption
      className={cn(
        "px-4 py-3 text-sm text-slate-500 dark:text-slate-400",
        className,
      )}
      {...props}
    >
      {children}
    </caption>
  );
};
