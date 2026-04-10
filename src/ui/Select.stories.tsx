import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { SAMPLE_OPTIONS, StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Select",
  component: Select,
  args: {
    label: "Section",
    description: "Pick a section to preview.",
    placeholder: "Choose a section",
    options: SAMPLE_OPTIONS.map(({ label, value, disabled }) => ({ label, value, disabled })),
    size: "md",
  },
  render: (args) => (
    <StorySurface className="w-[360px]">
      <Select {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="grid w-[360px] gap-4">
      <Select
        size="sm"
        label="Small"
        options={[{ label: "Button", value: "button" }]}
        defaultValue="button"
      />
      <Select
        size="md"
        label="Medium"
        options={[{ label: "Input", value: "input" }]}
        defaultValue="input"
      />
      <Select
        size="lg"
        label="Large"
        options={[{ label: "Dialog", value: "dialog" }]}
        defaultValue="dialog"
      />
    </StorySurface>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <StorySurface className="w-[360px]">
      <Select
        label="Framework"
        error="Please choose a supported framework."
        placeholder="Select framework"
        options={[
          { label: "Next.js", value: "nextjs" },
          { label: "Vite", value: "vitejs" },
        ]}
      />
    </StorySurface>
  ),
};
