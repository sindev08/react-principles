interface FlowNode {
  icon: string;
  title: string;
  description: string;
}

const NODES: FlowNode[] = [
  {
    icon: "smart_toy",
    title: "Your AI",
    description: "Claude, Cursor, Copilot, GPT — any MCP client",
  },
  {
    icon: "hub",
    title: "MCP Server",
    description: "reactprinciples.dev/api/mcp — 6 tools, live",
  },
  {
    icon: "menu_book",
    title: "Cookbook + UI Kit",
    description: "Recipes and components, always current",
  },
];

/**
 * Explains the MCP request path in plain terms: three nodes connected by
 * arrows, reusing the icon-badge card idiom used elsewhere on this page.
 */
export function McpFlowDiagram() {
  return (
    <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      {NODES.map((node, i) => (
        <div key={node.title} className="flex flex-1 items-center gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <span className="material-symbols-outlined text-[18px] text-primary">
                {node.icon}
              </span>
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {node.title}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {node.description}
              </p>
            </div>
          </div>
          {i < NODES.length - 1 && (
            <span className="material-symbols-outlined shrink-0 rotate-90 text-slate-400 sm:rotate-0 dark:text-slate-600">
              arrow_forward
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
