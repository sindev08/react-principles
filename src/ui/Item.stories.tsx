import type { Meta, StoryObj } from "@storybook/react";
import { Item } from "./Item";
import { Badge } from "./Badge";
import { Kbd } from "./Kbd";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Item",
  component: Item,
  args: {
    label: "Settings",
  },
  render: (args) => (
    <StorySurface className="space-y-1">
      <Item {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    label: "Settings",
    icon: <span className="material-symbols-outlined text-[18px]">settings</span>,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Notifications",
    description: "Manage your notification preferences",
  },
};

export const WithTrailing: Story = {
  render: () => (
    <StorySurface className="space-y-1">
      <Item
        label="Save"
        trailing={<Kbd>⌘S</Kbd>}
      />
      <Item
        label="Copy"
        trailing={<Kbd>⌘C</Kbd>}
      />
    </StorySurface>
  ),
};

export const WithBadgeTrailing: Story = {
  render: () => (
    <StorySurface className="space-y-1">
      <Item
        label="Messages"
        trailing={<Badge variant="default">3</Badge>}
      />
      <Item
        label="Updates"
        trailing={<Badge variant="success">New</Badge>}
      />
    </StorySurface>
  ),
};

export const Active: Story = {
  render: () => (
    <StorySurface className="space-y-1">
      <Item label="Inactive item" />
      <Item label="Active item" active />
    </StorySurface>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="space-y-1">
      <Item label="Enabled item" />
      <Item label="Disabled item" disabled />
    </StorySurface>
  ),
};

export const AsButton: Story = {
  render: () => (
    <StorySurface className="space-y-1">
      <Item
        label="Clickable item"
        onClick={() => {}}
        icon={<span className="material-symbols-outlined text-[18px]">settings</span>}
      />
    </StorySurface>
  ),
};

export const AllSlots: Story = {
  render: () => (
    <StorySurface className="space-y-1">
      <Item
        icon={<span className="material-symbols-outlined text-[18px]">search</span>}
        label="Search"
        description="Find files and content"
        trailing={<Kbd>⌘K</Kbd>}
      />
      <Item
        icon={<span className="material-symbols-outlined text-[18px]">home</span>}
        label="Home"
        description="Go to dashboard"
        active
      />
      <Item
        icon={<span className="material-symbols-outlined text-[18px]">logout</span>}
        label="Sign out"
        disabled
      />
    </StorySurface>
  ),
};
