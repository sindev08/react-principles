import { Outlet, useLocation } from "react-router-dom";
import { DocsHeader } from "./DocsHeader";
import { DocsSidebar } from "./DocsSidebar";
import { MobileNav } from "./MobileNav";

// Persistent shell for all docs + cookbook pages.
// DocsHeader and DocsSidebar stay mounted across navigations.
// Only the <Outlet> content remounts and fades in.

export function DocsShellLayout() {
  const location = useLocation();
  return (
    <div className="font-display bg-white dark:bg-[#0b0e14] text-slate-900 dark:text-[#e2e8f0] antialiased min-h-screen">
      <DocsHeader />
      <div className="mx-auto flex max-w-[1440px] px-6 lg:px-10">
        <DocsSidebar />
        <div key={location.pathname} className="flex-1 min-w-0 animate-fade-in">
          <Outlet />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
