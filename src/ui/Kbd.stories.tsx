import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "./Kbd";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Kbd",
  component: Kbd,
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Common Keys</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>⌘</Kbd>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Alt</Kbd>
          <Kbd>Option</Kbd>
          <Kbd>Enter</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>Tab</Kbd>
          <Kbd>Backspace</Kbd>
          <Kbd>Delete</Kbd>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Letter Keys</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>A</Kbd>
          <Kbd>K</Kbd>
          <Kbd>S</Kbd>
          <Kbd>C</Kbd>
          <Kbd>V</Kbd>
          <Kbd>Z</Kbd>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Arrow Keys</h3>
        <div className="flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
        </div>
      </div>
    </StorySurface>
  ),
};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Size Comparison</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">Small:</span>
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">K</Kbd>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">Medium:</span>
            <Kbd size="md">⌘</Kbd>
            <Kbd size="md">K</Kbd>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Use Cases</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Search</span>
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">K</Kbd>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Save</span>
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">S</Kbd>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Emphasis</span>
            <Kbd size="md">⌘</Kbd>
            <Kbd size="md">Shift</Kbd>
            <Kbd size="md">S</Kbd>
          </div>
        </div>
      </div>
    </StorySurface>
  ),
};

export const KeyCombinations: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Common Shortcuts</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Search</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">K</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Copy</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">C</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Paste</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">V</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Save</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">S</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Undo</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">Z</Kbd>
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Windows/Linux</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Search</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">Ctrl</Kbd>
              <Kbd size="sm">K</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Copy</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">Ctrl</Kbd>
              <Kbd size="sm">C</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Paste</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">Ctrl</Kbd>
              <Kbd size="sm">V</Kbd>
            </span>
          </div>
        </div>
      </div>
    </StorySurface>
  ),
};

export const Navigation: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Navigation Keys</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Arrow navigation</p>
            <div className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-1">
                <Kbd size="sm">↑</Kbd>
              </div>
              <div className="flex items-center gap-1">
                <Kbd size="sm">←</Kbd>
                <Kbd size="sm">↓</Kbd>
                <Kbd size="sm">→</Kbd>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Tab navigation</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Next field</span>
              <Kbd size="sm">Tab</Kbd>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-600 dark:text-slate-400">Previous field</span>
              <span className="inline-flex items-center gap-1">
                <Kbd size="sm">Shift</Kbd>
                <Kbd size="sm">Tab</Kbd>
              </span>
            </div>
          </div>
        </div>
      </div>
    </StorySurface>
  ),
};

export const CompleteExample: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Keyboard Shortcuts Reference</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1f2937]">
            <span className="text-sm text-slate-700 dark:text-slate-300">Search</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">K</Kbd>
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1f2937]">
            <span className="text-sm text-slate-700 dark:text-slate-300">Command Palette</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">Shift</Kbd>
              <Kbd size="sm">P</Kbd>
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1f2937]">
            <span className="text-sm text-slate-700 dark:text-slate-300">Toggle Sidebar</span>
            <span className="inline-flex items-center gap-1">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">B</Kbd>
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1f2937]">
            <span className="text-sm text-slate-700 dark:text-slate-300">Navigate Up</span>
            <Kbd size="sm">↑</Kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 dark:text-slate-300">Navigate Down</span>
            <Kbd size="sm">↓</Kbd>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-[#1f2937]">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Press <Kbd size="sm">?</Kbd> to see all available keyboard shortcuts.
          Use <Kbd size="sm">Esc</Kbd> to close any dialog or dropdown.
        </p>
      </div>
    </StorySurface>
  ),
};
