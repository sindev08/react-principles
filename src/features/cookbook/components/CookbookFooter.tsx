export function CookbookFooter() {
  return (
    <footer className="mt-24 py-12 border-t border-slate-200 dark:border-[#1f2937]">
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-white">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              React Patterns
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Helping developers build robust React applications since 2026.
          </p>
        </div>
        <div className="flex gap-12">
          <div>
            <h6 className="mb-3 text-xs font-bold uppercase text-slate-900 dark:text-white">
              Resources
            </h6>
            <ul className="space-y-2 text-sm text-slate-500">
              {["GitHub", "Discord", "NPM Package"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-3 text-xs font-bold uppercase text-slate-900 dark:text-white">
              Legal
            </h6>
            <ul className="space-y-2 text-sm text-slate-500">
              {["Privacy", "License"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-8 mt-12 text-xs text-center border-t border-slate-100 dark:border-[#1f2937] text-slate-400">
        &copy; 2026 React Patterns Cookbook. Built with &hearts; for the community.
      </div>
    </footer>
  );
}
