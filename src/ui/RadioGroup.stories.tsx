import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./RadioGroup";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  args: {
    defaultValue: "next",
    children: null,
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <RadioGroup {...args}>
        <RadioGroup.Item
          value="next"
          label="Next.js"
          description="App Router, metadata, and server-first patterns."
        />
        <RadioGroup.Item
          value="vite"
          label="Vite"
          description="Fast SPA tooling for local playgrounds."
        />
        <RadioGroup.Item
          value="storybook"
          label="Storybook"
          description="Visual documentation environment."
        />
      </RadioGroup>
    </StorySurface>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DisabledOption: Story = {
  render: () => (
    <StorySurface className="w-[420px]">
      <RadioGroup defaultValue="docs">
        <RadioGroup.Item value="docs" label="Docs" description="Published on the website." />
        <RadioGroup.Item value="storybook" label="Storybook" description="Internal visual QA." />
        <RadioGroup.Item
          value="playground"
          label="Playground"
          description="Blocked by future work."
          disabled
        />
      </RadioGroup>
    </StorySurface>
  ),
};
