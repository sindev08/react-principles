import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Popover } from "./Popover";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Popover",
  component: Popover,
  args: {
    children: null,
    defaultOpen: true,
    side: "bottom",
    align: "start",
  },
  render: () => (
    <StorySurface className="flex w-[420px] justify-center">
      <Popover defaultOpen>
        <Popover.Trigger>Filters</Popover.Trigger>
        <Popover.Content>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview settings</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Storybook can render the same component in both light and dark theme.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button size="sm">Apply</Button>
            <Popover.Close>Close</Popover.Close>
          </div>
        </Popover.Content>
      </Popover>
    </StorySurface>
  ),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CenterAligned: Story = {
  render: () => (
    <StorySurface className="flex w-[420px] justify-center">
      <Popover defaultOpen align="center" side="top">
        <Popover.Trigger>Alignment</Popover.Trigger>
        <Popover.Content>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Centered content anchored above the trigger.
          </p>
        </Popover.Content>
      </Popover>
    </StorySurface>
  ),
};
