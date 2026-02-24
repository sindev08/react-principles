const FILE_TREE = [
  {
    indent: 0,
    icon: "folder_open",
    iconColor: "text-primary/50",
    label: "react-principles/",
    bold: false,
  },
  {
    indent: 1,
    icon: "folder",
    iconColor: "text-slate-500",
    label: "apps/",
    bold: false,
  },
  {
    indent: 2,
    icon: "web",
    iconColor: "text-primary",
    label: "nextjs/",
    comment: "// Next.js 15 App Router",
    bold: true,
  },
  {
    indent: 2,
    icon: "bolt",
    iconColor: "text-slate-500",
    label: "vite/",
    comment: "// Vite + React 18",
    bold: false,
  },
  {
    indent: 1,
    icon: "folder_open",
    iconColor: "text-slate-500",
    label: "packages/",
    bold: false,
  },
  {
    indent: 2,
    icon: "extension",
    iconColor: "text-primary",
    label: "shared/",
    comment: "// Components, hooks, utils, types",
    bold: false,
    highlight: true,
  },
  {
    indent: 1,
    icon: "description",
    iconColor: "text-slate-500",
    label: "pnpm-workspace.yaml",
    bold: false,
  },
  {
    indent: 1,
    icon: "description",
    iconColor: "text-slate-500",
    label: "package.json",
    bold: false,
  },
];

const INDENT_MAP: Record<number, string> = { 0: "", 1: "pl-6", 2: "pl-12" };

export function MonorepoSection() {
  return (
    <section
      className="px-6 py-24 overflow-hidden bg-white dark:bg-slate-900"
      id="structure"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Monorepo First
          </h2>
          <p className="max-w-xl mx-auto text-slate-500">
            See how logic is shared between the documentation, Vite playgrounds,
            and Next.js implementations.
          </p>
        </div>

        <div className="max-w-4xl p-4 mx-auto border shadow-2xl rounded-2xl border-slate-800 bg-slate-900 dark:border-white/5 dark:bg-slate-950 md:p-8">
          <div className="flex items-center gap-2 pb-4 mb-8 border-b border-slate-800">
            <span className="material-symbols-outlined text-primary">
              account_tree
            </span>
            <span className="font-mono text-sm tracking-widest uppercase text-slate-400">
              Project Structure
            </span>
          </div>
          <div className="space-y-2 font-mono text-sm text-slate-300">
            {FILE_TREE.map((item) => (
              <div
                key={`${item.indent}-${item.label}`}
                className={`flex items-center gap-2 ${INDENT_MAP[item.indent] ?? ""} ${item.highlight ? "text-primary" : ""} ${item.bold ? "font-bold text-slate-100" : ""}`}
              >
                <span className={`material-symbols-outlined ${item.iconColor}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.comment && (
                  <span className="ml-2 text-xs italic font-normal text-slate-500">
                    {item.comment}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
