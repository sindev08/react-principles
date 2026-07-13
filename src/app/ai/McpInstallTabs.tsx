"use client";

import { Tabs } from "@/ui/Tabs";
import { CopyButton } from "@/shared/components";
import { cn } from "@/shared/utils/cn";

const ENDPOINT = "https://www.reactprinciples.dev/api/mcp";

const MCP_SERVERS_JSON = `{
  "mcpServers": {
    "reactprinciples": {
      "url": "${ENDPOINT}"
    }
  }
}`;

// VS Code uses a "servers" key with an explicit transport type.
const VSCODE_JSON = `{
  "servers": {
    "reactprinciples": {
      "type": "http",
      "url": "${ENDPOINT}"
    }
  }
}`;

const CLAUDE_CODE_CMD = `claude mcp add --transport http reactprinciples ${ENDPOINT}`;

interface Step {
  text: string;
  code: string;
}

interface ClientTab {
  id: string;
  label: string;
  steps: Step[];
}

const CLIENTS: ClientTab[] = [
  {
    id: "cursor",
    label: "Cursor",
    steps: [
      {
        text: "Add to .cursor/mcp.json (project) or ~/.cursor/mcp.json (global):",
        code: MCP_SERVERS_JSON,
      },
    ],
  },
  {
    id: "claude-code",
    label: "Claude Code",
    steps: [{ text: "Run in your terminal:", code: CLAUDE_CODE_CMD }],
  },
  {
    id: "windsurf",
    label: "Windsurf",
    steps: [
      {
        text: "Add to ~/.codeium/windsurf/mcp_config.json:",
        code: MCP_SERVERS_JSON,
      },
    ],
  },
  {
    id: "vscode",
    label: "VS Code",
    steps: [
      {
        text: "Add to .vscode/mcp.json (Copilot agent mode):",
        code: VSCODE_JSON,
      },
    ],
  },
  {
    id: "other",
    label: "Other",
    steps: [
      {
        text: "Any MCP client speaks Streamable HTTP — point it at the endpoint:",
        code: ENDPOINT,
      },
      { text: "…or add the standard server config:", code: MCP_SERVERS_JSON },
    ],
  },
];

function Snippet({ code }: { code: string }) {
  const multiline = code.includes("\n");
  return (
    <div
      className={cn(
        "flex gap-2 overflow-hidden rounded-lg bg-slate-900 pl-4 pr-2 dark:bg-black",
        multiline ? "items-start" : "items-center",
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

export function McpInstallTabs() {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        MCP is an open protocol — this server works with any MCP client. Pick
        yours:
      </p>
      <Tabs defaultValue="cursor">
        <Tabs.List className="flex-wrap">
          {CLIENTS.map((client) => (
            <Tabs.Trigger key={client.id} value={client.id}>
              {client.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {CLIENTS.map((client) => (
          <Tabs.Content
            key={client.id}
            value={client.id}
            className="space-y-4 pt-5"
          >
            {client.steps.map((step) => (
              <div key={step.text}>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {step.text}
                </p>
                <Snippet code={step.code} />
              </div>
            ))}
          </Tabs.Content>
        ))}
      </Tabs>
    </div>
  );
}
