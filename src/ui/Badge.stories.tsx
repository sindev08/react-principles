import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "Early access",
    variant: "default",
    size: "md",
  },
  render: (args) => (
    <StorySurface className="flex items-center gap-3">
      <Badge {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <StorySurface className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
    </StorySurface>
  ),
};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="flex flex-wrap items-center gap-3">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </StorySurface>
  ),
};
