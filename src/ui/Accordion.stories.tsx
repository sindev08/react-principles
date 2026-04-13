import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  args: {
    children: null,
  },
  render: () => (
    <StorySurface className="w-[520px]">
      <Accordion defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>What is react-principles?</Accordion.Trigger>
          <Accordion.Content>
            A living cookbook and UI kit for modern React development.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Why Storybook here?</Accordion.Trigger>
          <Accordion.Content>
            To add visual QA and reusable documentation for the `src/ui` primitives.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>Does it support dark mode?</Accordion.Trigger>
          <Accordion.Content>
            Yes. The Storybook preview follows the same `.dark` class contract as the app.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </StorySurface>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultipleOpen: Story = {
  render: () => (
    <StorySurface className="w-[520px]">
      <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Patterns</Accordion.Trigger>
          <Accordion.Content>Recipes, guides, and implementation examples.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>UI</Accordion.Trigger>
          <Accordion.Content>Copy-paste primitives ready for customization.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </StorySurface>
  ),
};
