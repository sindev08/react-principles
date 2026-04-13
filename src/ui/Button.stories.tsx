import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Create recipe",
    variant: "primary",
    size: "md",
    isLoading: false,
    disabled: false,
  },
  render: (args) => (
    <StorySurface className="flex flex-wrap items-center gap-3">
      <Button {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <StorySurface className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Delete</Button>
    </StorySurface>
  ),
};

export const SizesAndStates: Story = {
  render: () => (
    <StorySurface className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button isLoading>Loading</Button>
      <Button disabled>Disabled</Button>
    </StorySurface>
  ),
};
