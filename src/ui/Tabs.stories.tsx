import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  args: {
    children: null,
    defaultValue: "overview",
    variant: "underline",
  },
  render: (args) => (
    <StorySurface className="w-[520px]">
      <Tabs {...args}>
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="api">API</Tabs.Trigger>
          <Tabs.Trigger value="examples">Examples</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">
          <p className="text-sm text-slate-600 dark:text-slate-400">High-level mental model and usage guidance.</p>
        </Tabs.Content>
        <Tabs.Content value="api">
          <p className="text-sm text-slate-600 dark:text-slate-400">Typed props inferred directly from component source.</p>
        </Tabs.Content>
        <Tabs.Content value="examples">
          <p className="text-sm text-slate-600 dark:text-slate-400">Visual scenarios rendered in Storybook stories.</p>
        </Tabs.Content>
      </Tabs>
    </StorySurface>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Underline: Story = {
  args: {
    defaultValue: "overview",
    variant: "underline",
  },
};

export const Pills: Story = {
  args: {
    defaultValue: "api",
    variant: "pills",
  },
};
