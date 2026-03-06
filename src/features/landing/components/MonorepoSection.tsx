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
    icon: "folder_open",
    iconColor: "text-slate-500",
    label: "src/",
    bold: false,
  },
  {
    indent: 2,
    icon: "web",
    iconColor: "text-primary",
    label: "app/",
    comment: "// Next.js 16 App Router",
    bold: true,
  },
  {
    indent: 2,
    icon: "category",
    iconColor: "text-slate-300",
    label: "features/",
    comment: "// landing, docs, cookbook, examples",
    bold: false,
  },
  {
    indent: 2,
    icon: "hub",
    iconColor: "text-primary",
    label: "shared/",
    comment: "// shared hooks, stores, types, utils",
    bold: false,
    highlight: true,
  },
  {
    indent: 2,
    icon: "dns",
    iconColor: "text-slate-300",
    label: "lib/",
    comment: "// query + API client layer",
    bold: false,
  },
  {
    indent: 2,
    icon: "extension",
    iconColor: "text-primary",
    label: "ui/",
    comment: "// custom shadcn-style primitives",
    bold: false,
    highlight: true,
  },
  {
    indent: 1,
    icon: "description",
    iconColor: "text-slate-500",
    label: "docs/",
    bold: false,
  },
  {
    indent: 1,
    icon: "folder",
    iconColor: "text-slate-500",
    label: "public/",
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
            Project Structure First
          </h2>
          <p className="max-w-xl mx-auto text-slate-500">
            One Next.js codebase with clear boundaries for app routes, feature
            modules, shared logic, and UI primitives.
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
