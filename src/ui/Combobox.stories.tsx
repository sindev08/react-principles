import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "./Combobox";
import { SAMPLE_OPTIONS, StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Combobox",
  component: Combobox,
  args: {
    options: SAMPLE_OPTIONS,
    label: "Surface",
    description: "Filter and pick a product area.",
    placeholder: "Search areas...",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <Combobox {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: {
    defaultValue: "cookbook",
  },
};
