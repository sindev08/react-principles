import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  args: {
    label: "Description",
    description: "Short explanation shown in docs.",
    placeholder: "Write a concise summary...",
    size: "md",
    variant: "default",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <Textarea {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <StorySurface className="grid w-[480px] gap-4">
      <Textarea label="Default" placeholder="Default variant" />
      <Textarea label="Filled" placeholder="Filled variant" variant="filled" />
      <Textarea label="Ghost" placeholder="Ghost variant" variant="ghost" />
    </StorySurface>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <StorySurface className="w-[420px]">
      <Textarea
        label="Announcement"
        defaultValue="A living cookbook and UI kit for modern React development."
        error="Keep the copy under 80 characters."
      />
    </StorySurface>
  ),
};
