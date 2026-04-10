import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  args: {
    variant: "line",
  },
  render: (args) => (
    <StorySurface>
      <Skeleton {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <StorySurface className="grid w-[420px] gap-4">
      <Skeleton variant="line" width="60%" />
      <Skeleton variant="rect" height={120} />
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" />
        <div className="grid gap-2">
          <Skeleton variant="line" width={180} />
          <Skeleton variant="line" width={120} />
        </div>
      </div>
    </StorySurface>
  ),
};
