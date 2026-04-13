import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./Separator";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Separator",
  component: Separator,
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <div className="space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">Section one</p>
        <Separator {...args} />
        <p className="text-sm text-slate-600 dark:text-slate-400">Section two</p>
      </div>
    </StorySurface>
  ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <StorySurface className="flex h-20 items-center gap-4">
      <span className="text-sm text-slate-600 dark:text-slate-400">Docs</span>
      <Separator {...args} />
      <span className="text-sm text-slate-600 dark:text-slate-400">Cookbook</span>
    </StorySurface>
  ),
};
