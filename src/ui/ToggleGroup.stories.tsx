import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup } from "./ToggleGroup";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  args: {
    type: "single",
    defaultValue: "center",
    variant: "default",
    size: "md",
  },
  render: (args) => (
    <StorySurface>
      <ToggleGroup {...args}>
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup>
    </StorySurface>
  ),
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Single: Story = {
  render: () => (
    <StorySurface>
      <ToggleGroup type="single" defaultValue="center">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup>
    </StorySurface>
  ),
};

export const Multiple: Story = {
  render: () => (
    <StorySurface>
      <ToggleGroup type="multiple" defaultValue="bold,underline">
        <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
        <ToggleGroup.Item value="strikethrough">S</ToggleGroup.Item>
      </ToggleGroup>
    </StorySurface>
  ),
};

export const Outline: Story = {
  render: () => (
    <StorySurface className="space-y-6">
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Single</p>
        <ToggleGroup type="single" defaultValue="md" variant="outline">
          <ToggleGroup.Item value="sm">Small</ToggleGroup.Item>
          <ToggleGroup.Item value="md">Medium</ToggleGroup.Item>
          <ToggleGroup.Item value="lg">Large</ToggleGroup.Item>
        </ToggleGroup>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Multiple</p>
        <ToggleGroup type="multiple" defaultValue="react" variant="outline">
          <ToggleGroup.Item value="react">React</ToggleGroup.Item>
          <ToggleGroup.Item value="vue">Vue</ToggleGroup.Item>
          <ToggleGroup.Item value="svelte">Svelte</ToggleGroup.Item>
        </ToggleGroup>
      </div>
    </StorySurface>
  ),
};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="space-y-4">
      <ToggleGroup size="sm" defaultValue="a">
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        <ToggleGroup.Item value="c">C</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup size="md" defaultValue="a">
        <ToggleGroup.Item value="a">Small</ToggleGroup.Item>
        <ToggleGroup.Item value="b">Medium</ToggleGroup.Item>
        <ToggleGroup.Item value="c">Large</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup size="lg" defaultValue="a">
        <ToggleGroup.Item value="a">Small</ToggleGroup.Item>
        <ToggleGroup.Item value="b">Medium</ToggleGroup.Item>
        <ToggleGroup.Item value="c">Large</ToggleGroup.Item>
      </ToggleGroup>
    </StorySurface>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="space-y-4">
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">All disabled</p>
        <ToggleGroup type="single" defaultValue="b" disabled>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
          <ToggleGroup.Item value="c">C</ToggleGroup.Item>
        </ToggleGroup>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Per-item disabled</p>
        <ToggleGroup type="multiple" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b" disabled>B (disabled)</ToggleGroup.Item>
          <ToggleGroup.Item value="c">C</ToggleGroup.Item>
        </ToggleGroup>
      </div>
    </StorySurface>
  ),
};
