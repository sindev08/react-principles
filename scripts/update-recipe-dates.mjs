#!/usr/bin/env node
/**
 * Auto-updates `lastUpdated` in detail-data.ts for any recipe whose
 * content changed in the current staged diff.
 *
 * Run automatically via .git/hooks/pre-commit, or manually:
 *   node scripts/update-recipe-dates.mjs
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const FILE = "src/features/cookbook/data/detail-data.ts";
const filePath = resolve(process.cwd(), FILE);

// Check if detail-data.ts is staged — skip if not
const stagedFiles = execSync("git diff --staged --name-only").toString().trim().split("\n");
if (!stagedFiles.includes(FILE)) process.exit(0);

const diff = execSync(`git diff --staged -- ${FILE}`).toString();

// Walk through the diff, track which recipe slug we're inside,
// and mark it as changed when we see a +/- line (excluding lastUpdated itself)
const changedSlugs = new Set();
let currentSlug = null;

for (const line of diff.split("\n")) {
  const slugMatch = line.match(/^\s+"([a-z][a-z0-9-]+)":\s*\{/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }

  const isChange = (line.startsWith("+") || line.startsWith("-")) &&
    !line.startsWith("+++") &&
    !line.startsWith("---");

  if (isChange && currentSlug && !line.includes("lastUpdated")) {
    changedSlugs.add(currentSlug);
  }
}

if (changedSlugs.size === 0) {
  console.warn("No recipe content changes detected — skipping date update.");
  process.exit(0);
}

const today = new Date().toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

let content = readFileSync(filePath, "utf-8");

for (const slug of changedSlugs) {
  const escapedSlug = slug.replace(/-/g, "\\-");
  const pattern = new RegExp(
    `("${escapedSlug}":[\\s\\S]{0,3000}?lastUpdated:\\s*")[^"]*(")`
  );
  content = content.replace(pattern, `$1${today}$2`);
  console.warn(`  ↳ Updated "${slug}" → ${today}`);
}

writeFileSync(filePath, content);
execSync(`git add ${FILE}`);
console.warn("✓ Recipe dates updated and re-staged.");
