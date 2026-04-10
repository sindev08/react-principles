import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Slider",
  component: Slider,
  args: {
    defaultValue: 64,
    min: 0,
    max: 100,
    step: 1,
    label: "Progress",
    showValue: true,
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <Slider {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FineControl: Story = {
  args: {
    defaultValue: 0.35,
    min: 0,
    max: 1,
    step: 0.05,
    label: "Animation speed",
  },
};
