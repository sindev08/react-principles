import { Link } from "react-router-dom";

const RESOURCES = [
  { label: "Documentation", href: "#" },
  { label: "GitHub Repository", href: "#" },
  { label: "Cookbook PDF", href: "#" },
  { label: "Changelog", href: "#" },
];

const FRAMEWORKS = [
  { label: "Next.js 15", href: "#" },
  { label: "Vite", href: "#" },
  { label: "React Native", href: "#" },
  { label: "Remix", href: "#" },
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
            <div className="flex gap-4">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 transition-all rounded-full hover:bg-primary/10 hover:text-primary bg-slate-50 dark:bg-slate-900 dark:text-slate-400"
              >
                <span className="text-xl material-symbols-outlined">share</span>
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 transition-all rounded-full hover:bg-primary/10 hover:text-primary bg-slate-50 dark:bg-slate-900 dark:text-slate-400"
              >
                <span className="text-xl material-symbols-outlined">rss_feed</span>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {RESOURCES.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
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
                  <a
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-slate-100 dark:border-white/5 md:flex-row">
          <p className="text-xs text-slate-400">
            © 2024 react-principles. Built for the React community.
          </p>
          <div className="flex gap-8 text-xs font-medium text-slate-400">
            <a href="#" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Code of Conduct
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
