#!/usr/bin/env node
/**
 * update-docs-pages.mjs
 *
 * Bulk-updates all component doc pages:
 * 1. Fix COPY_PASTE_SNIPPET: @/shared/utils/cn → @/lib/utils
 * 2. Fix COPY_PASTE_SNIPPET: @/shared/hooks/useAnimatedMount → @/hooks/use-animated-mount
 * 3. Fix CODE_SNIPPET: @/ui/Xxx → @/components/ui/Xxx
 * 4. Add CliInstallBlock import to DocsPageLayout import line
 * 5. Insert <CliInstallBlock name="..." /> after header section
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOCS_DIR = join(ROOT, "src/app/docs");

// Pages that are concept/guide pages, not component pages
const SKIP_PAGES = new Set([
  "introduction",
  "installation",
  "theming",
  "dark-mode",
  "forms",
  "table",
]);

/**
 * Replace imports inside a named template literal const.
 * e.g. replace occurrences of `pattern` inside `const NAME = \`...\``
 */
function replaceInsideTemplateConst(source, constName, pattern, replacement) {
  // Match: const NAME = `...` (possibly multiline)
  const regex = new RegExp(
    `(const ${constName} = \`)([\\s\\S]*?)(\`(?:;|\\n))`,
    "g"
  );
  return source.replace(regex, (match, open, body, close) => {
    const newBody = body.replaceAll(pattern, replacement);
    return open + newBody + close;
  });
}

function updatePage(componentName, filePath) {
  let source = readFileSync(filePath, "utf8");
  const original = source;
  let changed = false;

  // ── 1 & 2: Fix COPY_PASTE_SNIPPET import paths ───────────────────────────
  if (source.includes("@/shared/utils/cn")) {
    source = replaceInsideTemplateConst(
      source,
      "COPY_PASTE_SNIPPET",
      "@/shared/utils/cn",
      "@/lib/utils"
    );
    // Also direct string replace in case it appears outside the const
    if (source.includes("@/shared/utils/cn")) {
      source = source.replaceAll("@/shared/utils/cn", "@/lib/utils");
    }
    changed = true;
  }

  if (source.includes("@/shared/hooks/useAnimatedMount")) {
    source = replaceInsideTemplateConst(
      source,
      "COPY_PASTE_SNIPPET",
      "@/shared/hooks/useAnimatedMount",
      "@/hooks/use-animated-mount"
    );
    if (source.includes("@/shared/hooks/useAnimatedMount")) {
      source = source.replaceAll(
        "@/shared/hooks/useAnimatedMount",
        "@/hooks/use-animated-mount"
      );
    }
    changed = true;
  }

  // ── 3: Fix CODE_SNIPPET: @/ui/Xxx → @/components/ui/Xxx ─────────────────
  if (source.includes('CODE_SNIPPET') && source.includes('"@/ui/')) {
    source = replaceInsideTemplateConst(
      source,
      "CODE_SNIPPET",
      '"@/ui/',
      '"@/components/ui/'
    );
    changed = true;
  }

  // ── 4: Add CliInstallBlock to docs/components import ─────────────────────
  if (!source.includes("CliInstallBlock")) {
    source = source.replace(
      /import \{ DocsPageLayout \} from "@\/features\/docs\/components";/,
      `import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";`
    );
    changed = true;
  }

  // ── 5: Insert <CliInstallBlock name="..." /> after header section ─────────
  // The header section ends with </div> then a blank line then {/* 01 Theme Preview */}
  if (!source.includes("<CliInstallBlock")) {
    // Match the closing </div> of the header and the following section comment
    const insertPattern = new RegExp(
      "(\\s*<\\/div>\\n\\n)(\\s*\\{/\\* 0[1-9])"
    );
    if (insertPattern.test(source)) {
      source = source.replace(
        insertPattern,
        (match, endDiv, sectionComment) => {
          return (
            endDiv +
            `        <CliInstallBlock name="${componentName}" />\n\n` +
            sectionComment
          );
        }
      );
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, source, "utf8");
    return true;
  }
  return false;
}

// ── Main ─────────────────────────────────────────────────────────────────────

import { readdirSync, statSync } from "fs";

const entries = readdirSync(DOCS_DIR).filter((name) => {
  if (SKIP_PAGES.has(name)) return false;
  const fullPath = join(DOCS_DIR, name);
  return (
    statSync(fullPath).isDirectory() &&
    // must have a page.tsx
    statSync(join(fullPath, "page.tsx"), { throwIfNoEntry: false })?.isFile()
  );
});

let updated = 0;
let skipped = 0;

for (const componentName of entries.sort()) {
  const filePath = join(DOCS_DIR, componentName, "page.tsx");
  const wasUpdated = updatePage(componentName, filePath);
  if (wasUpdated) {
    console.log(`  ✓ Updated ${componentName}/page.tsx`);
    updated++;
  } else {
    console.log(`  – Skipped ${componentName}/page.tsx (no changes needed)`);
    skipped++;
  }
}

console.log(`\nDone! ${updated} updated, ${skipped} skipped.\n`);
