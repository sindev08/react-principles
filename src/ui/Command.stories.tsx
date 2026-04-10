import type { Meta, StoryObj } from "@storybook/react";
import { Command } from "./Command";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Command",
  component: Command,
  render: () => (
    <StorySurface className="w-[480px] p-0">
      <Command>
        <Command.Input placeholder="Search components and patterns..." />
        <Command.List>
          <Command.Group>
            <Command.Label>Components</Command.Label>
            <Command.Item value="button" keywords={["action", "cta"]}>Button</Command.Item>
            <Command.Item value="dialog" keywords={["modal", "overlay"]}>Dialog</Command.Item>
            <Command.Item value="tabs" keywords={["navigation", "content"]}>Tabs</Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group>
            <Command.Label>Patterns</Command.Label>
            <Command.Item value="react-query" keywords={["server state"]}>Server State</Command.Item>
            <Command.Item value="zustand" keywords={["client state"]}>Client State</Command.Item>
          </Command.Group>
          <Command.Empty>No matches in this demo.</Command.Empty>
        </Command.List>
      </Command>
    </StorySurface>
  ),
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
