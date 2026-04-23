import type { Meta, StoryObj } from "@storybook/react";
import { Resizable } from "./Resizable";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Resizable",
  component: Resizable,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => (
    <StorySurface className="w-[800px]">
      <Resizable direction="horizontal" className="h-64">
        <Resizable.Panel defaultSize={50}>
          <div className="p-4 h-full bg-slate-100 dark:bg-[#1f2937]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Left Panel</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Drag the handle to resize</p>
          </div>
        </Resizable.Panel>
        <Resizable.Handle withHandle />
        <Resizable.Panel defaultSize={50}>
          <div className="p-4 h-full bg-slate-200 dark:bg-[#161b22]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Right Panel</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Panels resize within min/max bounds</p>
          </div>
        </Resizable.Panel>
      </Resizable>
    </StorySurface>
  ),
};

export const WithVisualGrip: Story = {
  render: () => (
    <StorySurface className="w-[800px]">
      <Resizable direction="horizontal" className="h-64">
        <Resizable.Panel defaultSize={50}>
          <div className="p-4 h-full bg-slate-100 dark:bg-[#1f2937]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Panel 1</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">With visual grip indicator</p>
          </div>
        </Resizable.Panel>
        <Resizable.Handle withHandle />
        <Resizable.Panel defaultSize={50}>
          <div className="p-4 h-full bg-slate-200 dark:bg-[#161b22]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Panel 2</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Drag handle to resize</p>
          </div>
        </Resizable.Panel>
      </Resizable>
    </StorySurface>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <StorySurface className="w-[800px]">
      <Resizable direction="horizontal" className="h-64">
        <Resizable.Panel defaultSize={33.33}>
          <div className="p-4 h-full bg-slate-100 dark:bg-[#1f2937]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Panel 1</h3>
          </div>
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={33.33}>
          <div className="p-4 h-full bg-slate-200 dark:bg-[#161b22]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Panel 2</h3>
          </div>
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={33.34}>
          <div className="p-4 h-full bg-slate-300 dark:bg-[#0d1117]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Panel 3</h3>
          </div>
        </Resizable.Panel>
      </Resizable>
    </StorySurface>
  ),
};

export const CodeEditorLayout: Story = {
  render: () => (
    <StorySurface className="w-[800px]">
      <Resizable direction="horizontal" className="h-96">
        <Resizable.Panel defaultSize={30} minSize={20} maxSize={40}>
          <div className="p-4 h-full bg-slate-900 dark:bg-black">
            <h3 className="text-sm font-semibold text-white mb-4">File Explorer</h3>
            <div className="space-y-2">
              {["src/", "components/", "utils/", "index.tsx"].map((item, i) => (
                <div key={i} className="text-xs text-slate-400 px-3 py-2 hover:bg-white/10 rounded cursor-pointer">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Resizable.Panel>
        <Resizable.Handle withHandle />
        <Resizable.Panel defaultSize={70} minSize={60}>
          <div className="p-4 h-full bg-slate-800 dark:bg-[#161b22]">
            <h3 className="text-sm font-semibold text-white mb-4">Code Editor</h3>
            <div className="text-xs text-slate-400 font-mono space-y-1">
              <div>const panel = document.getElementById('app');</div>
              <div>panel.addEventListener('resize', handleResize);</div>
              <div></div>
              <div>function handleResize() {`{`}</div>
              <div>  console.log('Resized...');</div>
              <div>{`}`}</div>
            </div>
          </div>
        </Resizable.Panel>
      </Resizable>
    </StorySurface>
  ),
};
