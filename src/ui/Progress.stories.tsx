import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Progress",
  component: Progress,
  args: {
    value: 64,
    max: 100,
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <Progress {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Milestones: Story = {
  render: () => (
    <StorySurface className="grid w-[420px] gap-4">
      <Progress value={12} />
      <Progress value={48} />
      <Progress value={92} />
    </StorySurface>
  ),
};
