import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "./Button";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  args: {
    variant: "default",
    size: "md",
    orientation: "horizontal",
  },
  render: (args) => (
    <StorySurface>
      <ButtonGroup {...args}>
        <Button>Left</Button>
        <Button>Center</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </StorySurface>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="space-y-4">
      {(["sm", "md", "lg"] as const).map((s) => (
        <ButtonGroup key={s} size={s}>
          <Button>Small</Button>
          <Button>Medium</Button>
          <Button>Large</Button>
        </ButtonGroup>
      ))}
    </StorySurface>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const VerticalOutline: Story = {
  args: { variant: "outline", orientation: "vertical" },
};

export const ChildVariantOverride: Story = {
  render: () => (
    <StorySurface className="space-y-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        The second button overrides the group default variant with "destructive".
      </p>
      <ButtonGroup>
        <Button>Save</Button>
        <Button variant="destructive">Delete</Button>
        <Button>Cancel</Button>
      </ButtonGroup>
    </StorySurface>
  ),
};

export const SingleChild: Story = {
  render: () => (
    <StorySurface>
      <ButtonGroup>
        <Button>Only child (keeps full rounded-lg)</Button>
      </ButtonGroup>
    </StorySurface>
  ),
};
