import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    label: "Project name",
    placeholder: "react-principles",
    description: "Used in docs and generated code examples.",
    size: "md",
    variant: "default",
  },
  render: (args) => (
    <StorySurface className="w-[360px]">
      <Input {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <StorySurface className="grid w-[420px] gap-4">
      <Input label="Default" placeholder="Type here" variant="default" />
      <Input label="Filled" placeholder="Type here" variant="filled" />
      <Input label="Ghost" placeholder="Type here" variant="ghost" />
    </StorySurface>
  ),
};

export const ErrorAndDisabled: Story = {
  render: () => (
    <StorySurface className="grid w-[420px] gap-4">
      <Input
        label="Repository"
        value="react-principles"
        error="Repository name is already taken."
        readOnly
      />
      <Input
        label="Archived package"
        value="legacy-ui"
        description="This package is no longer editable."
        disabled
        readOnly
      />
    </StorySurface>
  ),
};
