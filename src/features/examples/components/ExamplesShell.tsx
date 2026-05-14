"use client";

import { useAppStore } from "@/shared/stores/useAppStore";
import { ExamplesNavbar } from "@/features/examples/components/ExamplesNavbar";
import { ExamplesSidebar } from "@/features/examples/components/ExamplesSidebar";
import { cn } from "@/shared/utils/cn";

export function ExamplesShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen">
      <ExamplesNavbar />
      <div className="flex">
        <ExamplesSidebar />
        <main
          className={cn(
            "flex-1 transition-all duration-200",
            sidebarOpen ? "ml-56" : "ml-0",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
