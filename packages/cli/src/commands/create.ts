import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import pc from "picocolors";
import prompts from "prompts";
import { decodePreset, type CliPreset } from "../utils/preset";
import { resolvePresetDependencies, installPresetDependencies } from "../utils/deps";
import { detectPackageManager } from "../utils/pm";
import { getEntry, getTemplate } from "../registry";

// ── Style system CSS vars ─────────────────────────────────────────────────

const STYLE_VARS: Record<string, Record<string, string>> = {
  arc: {
    "--radius-sm": "0.375rem", "--radius-md": "0.5rem", "--radius-lg": "0.75rem", "--radius-full": "9999px",
    "--font-size-xs": "0.75rem", "--font-size-sm": "0.875rem", "--font-size-base": "1rem",
    "--font-size-lg": "1.125rem", "--font-size-xl": "1.25rem", "--font-size-2xl": "1.5rem",
    "--font-size-3xl": "1.875rem",
    "--font-weight-normal": "400", "--font-weight-medium": "500",
    "--font-weight-semibold": "600", "--font-weight-bold": "700",
    "--shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "--shadow-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "--line-height-tight": "1.25", "--line-height-normal": "1.5", "--line-height-relaxed": "1.75",
  },
  edge: {
    "--radius-sm": "0rem", "--radius-md": "0.125rem", "--radius-lg": "0.25rem", "--radius-full": "0.25rem",
    "--font-size-xs": "0.6875rem", "--font-size-sm": "0.8125rem", "--font-size-base": "0.875rem",
    "--font-size-lg": "1rem", "--font-size-xl": "1.125rem", "--font-size-2xl": "1.375rem",
    "--font-size-3xl": "1.75rem",
    "--font-weight-normal": "400", "--font-weight-medium": "500",
    "--font-weight-semibold": "700", "--font-weight-bold": "800",
    "--shadow-sm": "none", "--shadow-md": "0 1px 3px 0 rgb(0 0 0 / 0.15)",
    "--line-height-tight": "1.2", "--line-height-normal": "1.45", "--line-height-relaxed": "1.65",
  },
  soleil: {
    "--radius-sm": "0.25rem", "--radius-md": "0.375rem", "--radius-lg": "0.625rem", "--radius-full": "9999px",
    "--font-size-xs": "0.75rem", "--font-size-sm": "0.875rem", "--font-size-base": "1rem",
    "--font-size-lg": "1.125rem", "--font-size-xl": "1.25rem", "--font-size-2xl": "1.5rem",
    "--font-size-3xl": "1.875rem",
    "--font-weight-normal": "400", "--font-weight-medium": "500",
    "--font-weight-semibold": "600", "--font-weight-bold": "700",
    "--shadow-sm": "0 1px 3px 0 rgb(0 0 0 / 0.08)",
    "--shadow-md": "0 4px 8px -2px rgb(0 0 0 / 0.12), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
    "--line-height-tight": "1.3", "--line-height-normal": "1.6", "--line-height-relaxed": "1.8",
  },
};

const RADIUS_VALUES: Record<string, string> = {
  none: "0px", sm: "0.25rem", md: "0.5rem", lg: "0.75rem",
};

// ── File generators ───────────────────────────────────────────────────────

function buildCssVars(preset: CliPreset): string {
  const vars: Record<string, string> = STYLE_VARS[preset.style] ?? STYLE_VARS.arc;
  const radius = RADIUS_VALUES[preset.radius] ?? "0.5rem";

  const entries = [
    `  --radius: ${radius};`,
    `  --color-brand: ${preset.colors.brand};`,
    `  --color-accent: ${preset.colors.accent};`,
    `  --color-chart: ${preset.colors.chart};`,
    `  --color-base: ${preset.colors.base};`,
    `  --font-header: "${preset.fonts.header}";`,
    `  --font-body: "${preset.fonts.body}";`,
    ...Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`),
  ];

  return entries.join("\n");
}

function buildGlobalCss(preset: CliPreset): string {
  return `@import "tailwindcss";

:root {
${buildCssVars(preset)}
}

body {
  font-family: var(--font-body), sans-serif;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-header), sans-serif;
  line-height: var(--line-height-tight);
}
`;
}

function buildNextPackageJson(appName: string, preset: CliPreset, extraDeps: string[]): string {
  const deps: Record<string, string> = {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4",
  };

  for (const dep of extraDeps) {
    const [name, version] = dep.split("@").length > 1
      ? [dep.slice(0, dep.lastIndexOf("@")), dep.slice(dep.lastIndexOf("@") + 1)]
      : [dep, "latest"];
    deps[name] = version;
  }

  const pkg = {
    name: appName,
    version: "0.1.0",
    private: true,
    scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" },
    dependencies: deps,
    devDependencies: {
      typescript: "^5.0.0",
      "@types/node": "^22.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
    },
  };

  return JSON.stringify(pkg, null, 2);
}

function buildVitePackageJson(appName: string, preset: CliPreset, extraDeps: string[]): string {
  const deps: Record<string, string> = {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4",
  };

  for (const dep of extraDeps) {
    const at = dep.lastIndexOf("@");
    const name = at > 0 ? dep.slice(0, at) : dep;
    const version = at > 0 ? dep.slice(at + 1) : "latest";
    deps[name] = version;
  }

  const pkg = {
    name: appName,
    version: "0.1.0",
    private: true,
    scripts: { dev: "vite", build: "tsc -b && vite build", preview: "vite preview" },
    dependencies: deps,
    devDependencies: {
      typescript: "^5.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.0.0",
      "vite": "^6.0.0",
      "tailwindcss": "^4.0.0",
      "@tailwindcss/vite": "^4.0.0",
    },
  };

  return JSON.stringify(pkg, null, 2);
}

const NEXT_CONFIG = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`;

const VITE_CONFIG = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

const TSCONFIG_NEXT = JSON.stringify({
  compilerOptions: {
    target: "ES2017", lib: ["dom", "dom.iterable", "esnext"],
    allowJs: true, skipLibCheck: true, strict: true,
    noEmit: true, esModuleInterop: true, module: "esnext",
    moduleResolution: "bundler", resolveJsonModule: true,
    isolatedModules: true, jsx: "preserve", incremental: true,
    plugins: [{ name: "next" }],
    paths: { "@/*": ["./src/*"] },
  },
  include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  exclude: ["node_modules"],
}, null, 2);

const TSCONFIG_VITE = JSON.stringify({
  compilerOptions: {
    target: "ES2020", lib: ["ES2020", "DOM", "DOM.Iterable"],
    module: "ESNext", skipLibCheck: true,
    moduleResolution: "bundler", allowImportingTsExtensions: true,
    isolatedModules: true, moduleDetection: "force",
    noEmit: true, jsx: "react-jsx", strict: true,
    paths: { "@/*": ["./src/*"] },
  },
  include: ["src"],
}, null, 2);

const INDEX_HTML = (appName: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const MAIN_TSX = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

const APP_TSX_VITE = `export default function App() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="mt-2 text-slate-500">Scaffolded with react-principles</p>
    </main>
  );
}
`;

const NEXT_LAYOUT = (appName: string) => `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${appName}",
  description: "Scaffolded with react-principles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;

const NEXT_PAGE = `export default function Page() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="mt-2 text-slate-500">Scaffolded with react-principles</p>
    </main>
  );
}
`;

const GITIGNORE = `# dependencies
node_modules/
.pnp
.pnp.js

# build output
dist/
.next/
out/

# env
.env
.env.local
.env.*.local

# misc
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`;

const CN_UTIL = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

// ── Helpers ───────────────────────────────────────────────────────────────

function write(dir: string, file: string, content: string): void {
  const fullPath = join(dir, file);
  mkdirSync(join(dir, file, ".."), { recursive: true });
  writeFileSync(fullPath, content, "utf8");
}

function step(msg: string) {
  console.log(`\n${pc.bold(pc.cyan("→"))} ${msg}`);
}

function ok(msg: string) {
  console.log(`  ${pc.green("✓")} ${msg}`);
}

// ── Main ──────────────────────────────────────────────────────────────────

export async function create(
  appNameArg: string | undefined,
  opts: { preset?: string; dryRun?: boolean },
): Promise<void> {
  console.log(pc.bold("\n✦ react-principles create\n"));

  // 1. App name
  let appName = appNameArg;
  if (!appName) {
    const res = await prompts({
      type: "text",
      name: "name",
      message: "Project name",
      initial: "my-app",
      validate: (v: string) => /^[a-z0-9-_]+$/i.test(v) || "Use letters, numbers, hyphens only",
    });
    if (!res.name) process.exit(0);
    appName = res.name as string;
  }

  const cwd = process.cwd();
  const projectDir = join(cwd, appName);

  if (existsSync(projectDir)) {
    console.log(pc.red(`\n✖ Directory "${appName}" already exists.`));
    process.exit(1);
  }

  // 2. Preset
  let preset: CliPreset | null = null;

  if (opts.preset) {
    preset = decodePreset(opts.preset);
    if (!preset) {
      console.log(pc.yellow("⚠ Could not decode preset — using defaults (Next.js, Arc style)."));
    }
  }

  if (!preset) {
    preset = {
      style: "arc",
      colors: { base: "#0f172a", brand: "#3b82f6", accent: "#8b5cf6", chart: "#10b981" },
      fonts: { header: "Inter", body: "Inter" },
      iconSet: "material-symbols",
      radius: "md",
      components: ["Button", "Input", "Card", "Badge"],
      stack: { framework: "nextjs", stateManagement: false, dataFetching: false, forms: false, monorepo: false, rtl: false },
      version: 1,
    };
  }

  const isNext = preset.stack.framework === "nextjs";
  const pm = detectPackageManager(cwd);

  // 3. Dependency resolution (#141)
  const resolved = resolvePresetDependencies(preset);

  // 4. Summary
  console.log(pc.gray(`  Framework : ${isNext ? "Next.js" : "Vite"}`));
  console.log(pc.gray(`  Style     : ${preset.style} (${preset.colors.brand})`));
  console.log(pc.gray(`  Radius    : ${preset.radius}`));
  console.log(pc.gray(`  Components: ${preset.components.join(", ") || "none"}`));
  console.log(pc.gray(`  Packages  : ${resolved.deps.length} deps, ${resolved.devDeps.length} devDeps`));
  console.log(pc.gray(`  PM        : ${pm}`));

  if (opts.dryRun) {
    console.log(pc.yellow("\n[dry-run] Dependencies that would be installed:"));
    if (resolved.deps.length > 0) console.log(pc.gray("  deps:"), resolved.deps.join(" "));
    if (resolved.devDeps.length > 0) console.log(pc.gray("  devDeps:"), resolved.devDeps.join(" "));
    console.log(pc.yellow("\n[dry-run] No files written.\n"));
    return;
  }

  const confirm = await prompts({
    type: "confirm",
    name: "ok",
    message: `Create "${appName}"?`,
    initial: true,
  });
  if (!confirm.ok) process.exit(0);

  // 5. Scaffold
  step("Creating project structure");
  mkdirSync(projectDir, { recursive: true });

  // Common
  write(projectDir, ".gitignore", GITIGNORE);
  write(projectDir, "tsconfig.json", isNext ? TSCONFIG_NEXT : TSCONFIG_VITE);
  write(projectDir, "src/shared/utils/cn.ts", CN_UTIL);
  ok("Base files");

  // Framework config + entry files
  if (isNext) {
    write(projectDir, "next.config.mjs", NEXT_CONFIG);
    write(projectDir, "postcss.config.mjs", `export default { plugins: { "@tailwindcss/postcss": {} } };\n`);
    write(projectDir, "src/app/globals.css", buildGlobalCss(preset));
    write(projectDir, "src/app/layout.tsx", NEXT_LAYOUT(appName));
    write(projectDir, "src/app/page.tsx", NEXT_PAGE);
    ok("Next.js config + app directory");
  } else {
    write(projectDir, "vite.config.ts", VITE_CONFIG);
    write(projectDir, "index.html", INDEX_HTML(appName));
    write(projectDir, "src/index.css", buildGlobalCss(preset));
    write(projectDir, "src/main.tsx", MAIN_TSX);
    write(projectDir, "src/App.tsx", APP_TSX_VITE);
    ok("Vite config + entry files");
  }

  // package.json
  const pkgJson = isNext
    ? buildNextPackageJson(appName, preset, resolved.deps)
    : buildVitePackageJson(appName, preset, resolved.deps);
  write(projectDir, "package.json", pkgJson);
  ok("package.json");

  // components.json
  const componentsJson = {
    framework: isNext ? "next" : "vite",
    rsc: isNext,
    tsx: true,
    componentsDir: "src/ui",
    hooksDir: "src/shared/hooks",
    libDir: "src/shared/utils",
    aliases: { components: "@/ui", hooks: "@/shared/hooks", lib: "@/shared/utils" },
  };
  write(projectDir, "components.json", JSON.stringify(componentsJson, null, 2));
  ok("components.json");

  // 6. Copy selected UI components
  step("Copying components");
  const copied: string[] = [];
  const skipped: string[] = [];

  for (const compName of preset.components) {
    const entryName = compName.toLowerCase();
    const entry = getEntry(entryName);
    if (!entry) { skipped.push(compName); continue; }

    const template = getTemplate(entry.templateKey);
    if (!template) { skipped.push(compName); continue; }

    write(projectDir, `src/ui/${entry.outputFile}`, template);
    copied.push(compName);
  }

  // Always include utils (cn) via registry for correct @/lib/utils import
  const utilsEntry = getEntry("utils");
  if (utilsEntry) {
    const utilsTemplate = getTemplate(utilsEntry.templateKey);
    if (utilsTemplate) {
      write(projectDir, "src/shared/utils/cn.ts", utilsTemplate);
    }
  }

  if (copied.length > 0) ok(`Copied: ${copied.join(", ")}`);
  if (skipped.length > 0) console.log(pc.yellow(`  ⚠ Not found in registry: ${skipped.join(", ")}`));

  // 7. Install
  step(`Installing dependencies with ${pm}`);
  try {
    const installCmd = pm === "yarn" ? "yarn" : `${pm} install`;
    execSync(installCmd, { cwd: projectDir, stdio: "inherit" });

    // Extra preset deps (component + stack)
    installPresetDependencies(resolved, projectDir);

    ok("Dependencies installed");
  } catch {
    console.log(pc.yellow("\n  ⚠ Install failed. Run manually:"));
    console.log(pc.gray(`    cd ${appName} && ${pm} install`));
  }

  // 8. Done
  console.log(`\n${pc.bold(pc.green("✓ Done!"))} ${pc.gray(`Created ${appName}/`)}\n`);
  console.log(pc.gray(`  cd ${appName}`));
  console.log(pc.gray(`  ${pm} run dev\n`));
}
