import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./ScrollArea";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  args: {
    orientation: "vertical",
    type: "auto",
    children: (
      <div className="space-y-4 p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">ScrollArea Demo</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This is a scrollable area component.
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-100 dark:bg-[#1f2937]">
            <p className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</p>
          </div>
        ))}
      </div>
    ),
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="h-64" />
    </StorySurface>
  ),
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    type: "auto",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="h-64">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Vertical Scrolling</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This is a vertically scrollable area. Use the scrollbar or arrow keys to navigate through the content.
          </p>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-100 dark:bg-[#1f2937]">
              <p className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </StorySurface>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    type: "auto",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="w-full">
        <div className="flex gap-4 p-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 h-32 rounded-lg bg-slate-100 dark:bg-[#1f2937] flex items-center justify-center">
              <span className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </StorySurface>
  ),
};

export const Both: Story = {
  args: {
    orientation: "both",
    type: "auto",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="h-64 w-full">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Both Orientations</h3>
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, col) => (
              <div key={col} className="flex-shrink-0 w-48 space-y-2">
                {Array.from({ length: 20 }).map((_, row) => (
                  <div key={row} className="p-2 rounded bg-slate-100 dark:bg-[#1f2937]">
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Cell {col}-{row}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </StorySurface>
  ),
};

export const AlwaysVisible: Story = {
  args: {
    orientation: "vertical",
    type: "always",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="h-64">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Always Visible Scrollbar</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The scrollbar is always visible, even when content doesn't overflow.
          </p>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-100 dark:bg-[#1f2937]">
              <p className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </StorySurface>
  ),
};

export const OnHover: Story = {
  args: {
    orientation: "vertical",
    type: "hover",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="h-64">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Scrollbar on Hover</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Hover over this area to see the scrollbar appear.
          </p>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-100 dark:bg-[#1f2937]">
              <p className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </StorySurface>
  ),
};

export const KeyboardNavigation: Story = {
  args: {
    orientation: "vertical",
    type: "auto",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Keyboard Navigation</h4>
          <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Arrow Up/Down - Scroll by small amount</li>
            <li>• Page Up/Down - Scroll by page</li>
            <li>• Home/End - Jump to start/end</li>
            <li>• Tab - Focus on scrollable area</li>
          </ul>
        </div>
        <ScrollArea {...args} className="h-64">
          <div className="space-y-4 p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Keyboard Navigation Demo</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Click on this area and use keyboard shortcuts to navigate.
            </p>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-100 dark:bg-[#1f2937]">
                <p className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </StorySurface>
  ),
};

export const WithTable: Story = {
  args: {
    orientation: "both",
    type: "auto",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="h-64 w-full">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Wide Table</h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 dark:bg-[#1f2937]">
              <tr>
                {Array.from({ length: 10 }).map((_, i) => (
                  <th key={i} className="px-4 py-2 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    Column {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1f2937]">
              {Array.from({ length: 20 }).map((_, row) => (
                <tr key={row}>
                  {Array.from({ length: 10 }).map((_, col) => (
                    <td key={col} className="px-4 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      Cell {row}-{col}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </StorySurface>
  ),
};

export const LongContent: Story = {
  args: {
    orientation: "vertical",
    type: "auto",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="h-64">
        <div className="space-y-6 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Long Content Example</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This demonstrates a scrollable area with long-form content.
          </p>
          <section>
            <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Introduction</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>
          <section>
            <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Features</h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
              <li>Custom scrollbar styling across all browsers</li>
              <li>Keyboard navigation support</li>
              <li>Configurable orientations</li>
              <li>Multiple scrollbar visibility options</li>
              <li>Dark mode support</li>
              <li>Accessibility features built-in</li>
            </ul>
          </section>
          <section>
            <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Usage</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>
          {Array.from({ length: 10 }).map((_, i) => (
            <section key={i}>
              <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Section {i + 1}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </section>
          ))}
        </div>
      </ScrollArea>
    </StorySurface>
  ),
};

export const WithCards: Story = {
  args: {
    orientation: "vertical",
    type: "auto",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <ScrollArea {...args} className="h-64">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Card Grid</h3>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22]">
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Card {i + 1}</h5>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Description text for card {i + 1}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </StorySurface>
  ),
};
