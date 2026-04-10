import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Switch",
  component: Switch,
  args: {
    label: "Dark mode",
    description: "Toggle the preview canvas theme.",
    defaultChecked: true,
    size: "md",
  },
  render: (args) => (
    <StorySurface>
      <Switch {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="grid gap-4">
      <Switch size="sm" label="Small" defaultChecked />
      <Switch size="md" label="Medium" defaultChecked />
      <Switch size="lg" label="Large" defaultChecked />
    </StorySurface>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="grid gap-4">
      <Switch label="Disabled on" defaultChecked disabled />
      <Switch label="Disabled off" disabled />
    </StorySurface>
  ),
};
