"use client";

import { Button } from "@/ui/Button";
import { cn } from "@/shared/utils/cn";

export interface ConfiguratorSidebarProps {
  onOpenCreateModal: () => void;
  className?: string;
}

export function ConfiguratorSidebar({ onOpenCreateModal, className }: ConfiguratorSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#0b0e14]",
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto p-5">
        <div className="rounded-xl border border-dashed border-slate-200 p-4 dark:border-[#1f2937]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Configurator controls
          </p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Sidebar implementation will replace this stub in the UI execution phase.
          </p>
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-5 dark:border-[#1f2937] dark:bg-[#0b0e14]">
        <Button className="w-full" onClick={onOpenCreateModal}>
          Create Project
        </Button>
      </div>
    </aside>
  );
}
