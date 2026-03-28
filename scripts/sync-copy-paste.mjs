/**
 * Script to sync COPY_PASTE_SNIPPET in docs pages with actual UI component source code.
 * Run: node scripts/sync-copy-paste.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const MAPPING = [
  { doc: "accordion", ui: "Accordion.tsx" },
  { doc: "alert", ui: "Alert.tsx" },
  { doc: "alert-dialog", ui: "AlertDialog.tsx" },
  { doc: "avatar", ui: "Avatar.tsx" },
  { doc: "badge", ui: "Badge.tsx" },
  { doc: "breadcrumb", ui: "Breadcrumb.tsx" },
  { doc: "button", ui: "Button.tsx" },
  { doc: "card", ui: "Card.tsx" },
  { doc: "checkbox", ui: "Checkbox.tsx" },
  { doc: "combobox", ui: "Combobox.tsx" },
  { doc: "command", ui: "Command.tsx" },
  { doc: "date-picker", ui: "DatePicker.tsx" },
  { doc: "dialog", ui: "Dialog.tsx" },
  { doc: "drawer", ui: "Drawer.tsx" },
  { doc: "dropdown-menu", ui: "DropdownMenu.tsx" },
  { doc: "input", ui: "Input.tsx" },
  { doc: "pagination", ui: "Pagination.tsx" },
  { doc: "popover", ui: "Popover.tsx" },
  { doc: "progress", ui: "Progress.tsx" },
  { doc: "radio-group", ui: "RadioGroup.tsx" },
  { doc: "select", ui: "Select.tsx" },
  { doc: "separator", ui: "Separator.tsx" },
  { doc: "skeleton", ui: "Skeleton.tsx" },
  { doc: "slider", ui: "Slider.tsx" },
  { doc: "switch", ui: "Switch.tsx" },
  { doc: "tabs", ui: "Tabs.tsx" },
  { doc: "textarea", ui: "Textarea.tsx" },
  { doc: "toast", ui: "Toast.tsx" },
  { doc: "tooltip", ui: "Tooltip.tsx" },
];

let updated = 0;
let failed = 0;

for (const { doc, ui } of MAPPING) {
  const docPath = resolve(ROOT, "src/app/docs", doc, "page.tsx");
  const uiPath = resolve(ROOT, "src/ui", ui);

  try {
    const uiSource = readFileSync(uiPath, "utf-8").trimEnd();
    let docSource = readFileSync(docPath, "utf-8");

    // Escape backticks and ${...} for template literal embedding
    const escaped = uiSource.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

    // Match the COPY_PASTE_SNIPPET = `...`; pattern (handles multiline)
    const snippetRegex = /(const COPY_PASTE_SNIPPET\s*=\s*`)[\s\S]*?(`;\s*)/;
    const match = docSource.match(snippetRegex);

    if (!match) {
      console.error(`[SKIP] ${doc}: could not find COPY_PASTE_SNIPPET pattern`);
      failed++;
      continue;
    }

    const newDocSource = docSource.replace(snippetRegex, `$1${escaped}$2`);

    if (newDocSource === docSource) {
      console.log(`[OK]   ${doc}: already in sync`);
    } else {
      writeFileSync(docPath, newDocSource, "utf-8");
      console.log(`[DONE] ${doc}: updated`);
      updated++;
    }
  } catch (err) {
    console.error(`[ERR]  ${doc}: ${err.message}`);
    failed++;
  }
}

console.log(`\nSummary: ${updated} updated, ${failed} failed, ${MAPPING.length - updated - failed} already in sync`);
