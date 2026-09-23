import { CopyButton } from "@/shared/components";
import { cn } from "@/shared/utils/cn";

const PLUGIN_MARKETPLACE_CMD =
  "/plugin marketplace add sindev08/react-principles-skills";
const PLUGIN_INSTALL_CMD = "/plugin install reactprinciples@react-principles";
const PLUGIN_RELOAD_CMD = "/reload-plugins";
const PLUGIN_FULL_CMD = `${PLUGIN_MARKETPLACE_CMD}\n${PLUGIN_INSTALL_CMD}\n${PLUGIN_RELOAD_CMD}`;
const SKILLS_INSTALL_CMD = "npx skills add sindev08/react-principles-skills";

function CommandSnippet({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const multiline = code.includes("\n");
  return (
    <div
      className={cn(
        "flex gap-2 overflow-hidden rounded-lg bg-slate-900 pl-4 pr-2 dark:bg-black",
        multiline ? "items-start" : "items-center",
        className,
      )}
    >
      <pre className="min-w-0 flex-1 overflow-x-auto py-3 text-sm text-slate-100">
        <code>{code}</code>
      </pre>
      <CopyButton
        text={code}
        label="Copy"
        className={cn(
          "text-slate-500 hover:bg-white/5 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-200",
          multiline && "mt-1.5",
        )}
      />
    </div>
  );
}

const COMPARISON_ROWS = [
  {
    feature: "Invocable skills (review, scaffold)",
    npx: "Yes (10 skills)",
    plugin: "Yes (10 skills)",
  },
  {
    feature: "MCP server auto-registered",
    npx: "No (manual .mcp.json)",
    plugin: "Yes (automatic)",
  },
  {
    feature: "Tool compatibility",
    npx: "Cursor, Copilot, OpenCode, 75+ tools",
    plugin: "Claude Code only",
  },
  {
    feature: "Best for",
    npx: "Multi-editor or non-Claude workflows",
    plugin: "Native Claude Code developers",
  },
];

export function PluginInstallGuide() {
  return (
    <div className="mb-12 space-y-8">
      {/* Side-by-side install options */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">
              extension
            </span>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Option A: Claude Code Plugin
            </h3>
          </div>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Installs all 10 skills and auto-registers the remote MCP server in one pass.
          </p>
          <CommandSnippet code={PLUGIN_FULL_CMD} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">
              terminal
            </span>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Option B: skills.sh (Universal)
            </h3>
          </div>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Installs skills into any agentic CLI or editor (Cursor, Copilot, OpenCode).
          </p>
          <CommandSnippet code={SKILLS_INSTALL_CMD} />
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
            <tr>
              <th className="p-3.5 font-semibold">Capability</th>
              <th className="p-3.5 font-semibold">npx skills add</th>
              <th className="p-3.5 font-semibold text-primary">Claude Code Plugin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-3.5 font-medium text-slate-900 dark:text-slate-200">
                  {row.feature}
                </td>
                <td className="p-3.5">{row.npx}</td>
                <td className="p-3.5 font-medium text-primary">{row.plugin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Flow Explanation */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          How Plugin Execution Works
        </h4>
        <div className="grid gap-3 pt-2 text-xs sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70">
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              1. Prompt Match
            </span>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              User asks <em>&ldquo;bikin store cart pakai zustand&rdquo;</em> ➔ AI auto-selects <code className="font-mono text-primary">reactprinciples-store</code>.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70">
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              2. Live Recipe Pull
            </span>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Skill queries MCP server <code className="font-mono text-primary">get_recipe</code> for client-state conventions in real time.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70">
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              3. Pattern Conformance
            </span>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Generates production code matching React Principles without copy-paste or hallucinated APIs.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Guidance Notes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-xs dark:border-amber-900/30 dark:bg-amber-950/20">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-200">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            Duplicate Install Warning
          </div>
          <p className="mt-1 leading-5 text-amber-800 dark:text-amber-300/90">
            Do not install both methods. If you previously ran <code className="font-mono">npx skills add</code>, remove it before enabling the plugin so skills don&apos;t appear twice in listing.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-[18px] text-primary">forum</span>
            Natural Trigger Phrasing
          </div>
          <p className="mt-1 leading-5 text-slate-600 dark:text-slate-400">
            Skills auto-trigger on everyday phrasing (e.g. <em>&ldquo;review component ini&rdquo;</em>, <em>&ldquo;buat dialog modal&rdquo;</em>). You do not need to prefix with slash commands.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-[18px] text-primary">cloud_sync</span>
            Outbound Requests & Privacy
          </div>
          <p className="mt-1 leading-5 text-slate-600 dark:text-slate-400">
            The MCP server only queries <code className="font-mono">reactprinciples.dev/api/mcp</code> for public recipes/components. Zero repository code, secrets, or prompt contexts are ever sent to our servers.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
            Zero Hooks, Zero Rules
          </div>
          <p className="mt-1 leading-5 text-slate-600 dark:text-slate-400">
            The plugin is entirely non-invasive: no git pre-commit hooks, no modified project configs, and no background enforcement. It only delivers skills and MCP tools.
          </p>
        </div>
      </div>
    </div>
  );
}
