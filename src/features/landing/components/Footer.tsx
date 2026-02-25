import Link from "next/link";

const RESOURCES = [
  { label: "Documentation", href: "/docs/introduction" },
  { label: "Cookbook", href: "/nextjs/cookbook" },
];

const FRAMEWORKS = [
  { label: "Next.js 15", href: "/nextjs/cookbook/server-state" },
  { label: "Vite", href: "/vitejs/cookbook/client-state" },
];

export function Footer() {
  return (
    <footer className="px-6 py-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 mb-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl material-symbols-outlined text-primary">
                terminal
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                react-principles
              </span>
            </div>
            <p className="max-w-sm mb-6 text-slate-500">
              An open-source initiative to document and share best practices for
              modern React development.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {RESOURCES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Frameworks */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900 dark:text-white">
              Frameworks
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {FRAMEWORKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-slate-100 dark:border-white/5 md:flex-row">
          <p className="text-xs text-slate-400">
            © 2025 react-principles. Built for the React community.
          </p>
        </div>
      </div>
    </footer>
  );
}
