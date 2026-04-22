import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  args: {
    children: "Bold",
    defaultPressed: false,
    size: "md",
  },
  render: (args) => (
    <StorySurface>
      <Toggle {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = {
  args: { defaultPressed: true, children: "Italic" },
};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="flex items-center gap-4">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
    </StorySurface>
  ),
};

export const Variants: Story = {
  render: () => (
    <StorySurface className="grid gap-4">
      <div className="flex items-center gap-4">
        <Toggle variant="default" defaultPressed>Default On</Toggle>
        <Toggle variant="default">Default Off</Toggle>
      </div>
      <div className="flex items-center gap-4">
        <Toggle variant="outline" defaultPressed>Outline On</Toggle>
        <Toggle variant="outline">Outline Off</Toggle>
      </div>
    </StorySurface>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="flex items-center gap-4">
      <Toggle disabled defaultPressed>Disabled On</Toggle>
      <Toggle disabled>Disabled Off</Toggle>
    </StorySurface>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <StorySurface className="inline-flex">
      <Toggle variant="outline" defaultPressed>B</Toggle>
      <Toggle variant="outline">I</Toggle>
      <Toggle variant="outline">U</Toggle>
      <Toggle variant="outline" defaultPressed>S</Toggle>
    </StorySurface>
  ),
};
