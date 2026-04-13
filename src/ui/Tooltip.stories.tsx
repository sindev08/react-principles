import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { StorySurface } from "./storybook-utils";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  args: {
    children: null,
    defaultOpen: true,
    side: "top",
  },
  render: () => (
    <StorySurface className="flex h-32 w-[420px] items-center justify-center">
      <Tooltip defaultOpen>
        <Tooltip.Trigger>
          <Button variant="outline">Hover target</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Helpful context appears here.</Tooltip.Content>
      </Tooltip>
    </StorySurface>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {};

export const Right: Story = {
  render: () => (
    <StorySurface className="flex h-32 w-[420px] items-center justify-center">
      <Tooltip defaultOpen side="right">
        <Tooltip.Trigger>
          <Button variant="secondary">Right side</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Useful for dense toolbars.</Tooltip.Content>
      </Tooltip>
    </StorySurface>
  ),
};
