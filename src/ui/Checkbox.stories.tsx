import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: {
    label: "Enable previews",
    description: "Show live examples inside the docs page.",
    size: "md",
  },
  render: (args) => (
    <StorySurface>
      <Checkbox {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <StorySurface className="grid gap-4">
      <Checkbox label="Unchecked" description="Default state" />
      <Checkbox checked label="Checked" description="Controlled checked state" />
      <Checkbox indeterminate label="Indeterminate" description="Partially selected collection" />
      <Checkbox disabled checked label="Disabled" description="Read-only preference" />
    </StorySurface>
  ),
};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="grid gap-4">
      <Checkbox size="sm" checked label="Small" />
      <Checkbox size="md" checked label="Medium" />
      <Checkbox size="lg" checked label="Large" />
    </StorySurface>
  ),
};
